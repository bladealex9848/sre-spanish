/**
 * SmythOS SRE - Gestor de OCR (Reconocimiento Óptico de Caracteres)
 * Integra múltiples métodos de OCR: Tesseract, Google Vision, OpenAI Vision
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { createWorker } = require('tesseract.js');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

class OCRProvider {
    constructor() {
        this.tesseractWorker = null;
        this.supportedFormats = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'tiff', 'webp', 'pdf'];
    }

    /**
     * Inicializa el worker de Tesseract
     */
    async initTesseract() {
        if (!this.tesseractWorker) {
            this.tesseractWorker = await createWorker('spa+eng'); // Español e inglés
            console.log('Tesseract worker inicializado');
        }
        return this.tesseractWorker;
    }

    /**
     * OCR con Tesseract (local, gratuito)
     */
    async ocrWithTesseract(imagePath, options = {}) {
        try {
            const worker = await this.initTesseract();
            
            const { data } = await worker.recognize(imagePath, {
                logger: options.verbose ? console.log : undefined
            });

            return {
                success: true,
                provider: 'tesseract',
                text: data.text,
                confidence: data.confidence,
                words: data.words?.map(word => ({
                    text: word.text,
                    confidence: word.confidence,
                    bbox: word.bbox
                })) || [],
                lines: data.lines?.map(line => ({
                    text: line.text,
                    confidence: line.confidence,
                    bbox: line.bbox
                })) || [],
                timestamp: new Date().toISOString()
            };

        } catch (error) {
            return {
                success: false,
                provider: 'tesseract',
                error: error.message,
                timestamp: new Date().toISOString()
            };
        }
    }

    /**
     * OCR con OpenAI Vision (requiere API key)
     */
    async ocrWithOpenAI(imagePath, options = {}) {
        if (!process.env.OPENAI_API_KEY) {
            throw new Error('OpenAI API Key no configurada');
        }

        try {
            // Leer y codificar imagen en base64
            const imageBuffer = fs.readFileSync(imagePath);
            const base64Image = imageBuffer.toString('base64');
            const mimeType = this.getMimeType(imagePath);

            const response = await axios.post('https://api.openai.com/v1/chat/completions', {
                model: options.model || 'gpt-4o',
                messages: [
                    {
                        role: 'user',
                        content: [
                            {
                                type: 'text',
                                text: options.prompt || 'Extrae todo el texto de esta imagen. Mantén el formato y estructura original. Si hay tablas, mantenlas organizadas.'
                            },
                            {
                                type: 'image_url',
                                image_url: {
                                    url: `data:${mimeType};base64,${base64Image}`,
                                    detail: options.detail || 'high'
                                }
                            }
                        ]
                    }
                ],
                max_tokens: options.maxTokens || 4000,
                temperature: options.temperature || 0
            }, {
                headers: {
                    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            });

            const extractedText = response.data.choices[0].message.content;

            return {
                success: true,
                provider: 'openai-vision',
                text: extractedText,
                model: options.model || 'gpt-4o',
                usage: response.data.usage,
                timestamp: new Date().toISOString()
            };

        } catch (error) {
            return {
                success: false,
                provider: 'openai-vision',
                error: error.message,
                timestamp: new Date().toISOString()
            };
        }
    }

    /**
     * OCR inteligente que combina múltiples métodos
     */
    async smartOCR(imagePath, options = {}) {
        const preferredMethod = options.method || 'tesseract';
        const results = {};

        // Validar formato de imagen
        if (!this.isValidImageFormat(imagePath)) {
            return {
                success: false,
                error: `Formato de imagen no soportado. Formatos válidos: ${this.supportedFormats.join(', ')}`,
                timestamp: new Date().toISOString()
            };
        }

        // Validar que el archivo existe
        if (!fs.existsSync(imagePath)) {
            return {
                success: false,
                error: 'Archivo de imagen no encontrado',
                timestamp: new Date().toISOString()
            };
        }

        // Intentar con el método preferido
        try {
            let primaryResult;
            
            if (preferredMethod === 'tesseract') {
                primaryResult = await this.ocrWithTesseract(imagePath, options);
            } else if (preferredMethod === 'openai' && process.env.OPENAI_API_KEY) {
                primaryResult = await this.ocrWithOpenAI(imagePath, options);
            } else {
                // Fallback a Tesseract si OpenAI no está disponible
                primaryResult = await this.ocrWithTesseract(imagePath, options);
            }

            results.primary = primaryResult;

            // Si el resultado principal es exitoso y tiene buena confianza, devolverlo
            if (primaryResult.success && 
                (primaryResult.confidence > 80 || primaryResult.provider === 'openai-vision')) {
                return {
                    ...primaryResult,
                    method: 'primary'
                };
            }

        } catch (error) {
            results.primary = {
                success: false,
                error: error.message,
                provider: preferredMethod
            };
        }

        // Si el método principal falla o tiene baja confianza, intentar con método alternativo
        if (options.fallback !== false) {
            try {
                let fallbackResult;
                
                if (preferredMethod === 'tesseract' && process.env.OPENAI_API_KEY) {
                    fallbackResult = await this.ocrWithOpenAI(imagePath, options);
                } else if (preferredMethod === 'openai') {
                    fallbackResult = await this.ocrWithTesseract(imagePath, options);
                }

                if (fallbackResult) {
                    results.fallback = fallbackResult;
                    
                    if (fallbackResult.success) {
                        return {
                            ...fallbackResult,
                            method: 'fallback',
                            primaryResult: results.primary
                        };
                    }
                }

            } catch (error) {
                results.fallback = {
                    success: false,
                    error: error.message
                };
            }
        }

        // Si ambos métodos fallan
        return {
            success: false,
            error: 'Todos los métodos de OCR fallaron',
            results: results,
            timestamp: new Date().toISOString()
        };
    }

    /**
     * OCR de múltiples imágenes
     */
    async batchOCR(imagePaths, options = {}) {
        const results = [];
        const batchSize = options.batchSize || 5;

        for (let i = 0; i < imagePaths.length; i += batchSize) {
            const batch = imagePaths.slice(i, i + batchSize);
            
            const batchPromises = batch.map(async (imagePath, index) => {
                try {
                    const result = await this.smartOCR(imagePath, options);
                    return {
                        index: i + index,
                        imagePath: imagePath,
                        ...result
                    };
                } catch (error) {
                    return {
                        index: i + index,
                        imagePath: imagePath,
                        success: false,
                        error: error.message
                    };
                }
            });

            const batchResults = await Promise.allSettled(batchPromises);
            
            batchResults.forEach(result => {
                if (result.status === 'fulfilled') {
                    results.push(result.value);
                } else {
                    results.push({
                        success: false,
                        error: result.reason.message
                    });
                }
            });

            // Pausa entre lotes para evitar rate limiting
            if (i + batchSize < imagePaths.length) {
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }

        return {
            success: true,
            totalImages: imagePaths.length,
            successfulOCR: results.filter(r => r.success).length,
            results: results,
            timestamp: new Date().toISOString()
        };
    }

    /**
     * Extrae texto de PDF (páginas como imágenes)
     */
    async ocrFromPDF(pdfPath, options = {}) {
        // Esta función requeriría pdf2pic o similar para convertir PDF a imágenes
        // Por ahora, devolvemos un placeholder
        return {
            success: false,
            error: 'OCR de PDF no implementado aún. Use imágenes individuales.',
            timestamp: new Date().toISOString()
        };
    }

    /**
     * Utilidades
     */
    isValidImageFormat(imagePath) {
        const ext = path.extname(imagePath).toLowerCase().replace('.', '');
        return this.supportedFormats.includes(ext);
    }

    getMimeType(imagePath) {
        const ext = path.extname(imagePath).toLowerCase();
        const mimeTypes = {
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.png': 'image/png',
            '.gif': 'image/gif',
            '.bmp': 'image/bmp',
            '.tiff': 'image/tiff',
            '.webp': 'image/webp'
        };
        return mimeTypes[ext] || 'image/jpeg';
    }

    /**
     * Limpia el worker de Tesseract
     */
    async cleanup() {
        if (this.tesseractWorker) {
            await this.tesseractWorker.terminate();
            this.tesseractWorker = null;
            console.log('Tesseract worker terminado');
        }
    }

    /**
     * Obtiene información sobre las capacidades de OCR disponibles
     */
    getCapabilities() {
        return {
            tesseract: {
                available: true,
                languages: ['spa', 'eng'],
                cost: 'gratuito',
                speed: 'medio',
                accuracy: 'buena'
            },
            openai: {
                available: !!process.env.OPENAI_API_KEY,
                languages: ['múltiples'],
                cost: 'pagado',
                speed: 'rápido',
                accuracy: 'excelente'
            },
            supportedFormats: this.supportedFormats
        };
    }
}

module.exports = OCRProvider;
