#!/usr/bin/env node

/**
 * SmythOS SRE - API REST Mejorada con Múltiples Proveedores de IA
 * Servidor Express.js que expone SmythOS con soporte para múltiples APIs
 */

require('dotenv').config();
const express = require('express');
// CORS is handled by Caddy - removed to prevent header duplication
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const AIProviderManager = require('./providers/ai-providers');
const path = require('path');
const OpenAIAssistantsManager = require('./providers/openai-assistants');
const SearchProvidersManager = require('./providers/search-providers');
const OCRProvider = require('./providers/ocr-provider');
const multer = require('multer');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./swagger-config');

const app = express();
const PORT = process.env.PORT || 8000;

// Inicializar gestores de IA
const aiManager = new AIProviderManager();
const assistantsManager = new OpenAIAssistantsManager();
const searchManager = new SearchProvidersManager();
const ocrProvider = new OCRProvider();

// Configurar multer para subida de archivos
const upload = multer({
    dest: 'uploads/',
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/bmp', 'image/tiff', 'image/webp'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Tipo de archivo no soportado. Use: JPG, PNG, GIF, BMP, TIFF, WEBP'));
        }
    }
});

// Middleware de seguridad
app.set('trust proxy', 1); // Confiar en el primer proxy (Caddy)
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com"],
            scriptSrcAttr: ["'unsafe-inline'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com"],
            fontSrc: ["'self'", "https://cdnjs.cloudflare.com", "data:"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'"]
        }
    }
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
    message: {
        error: 'Demasiadas solicitudes, intenta de nuevo más tarde'
    }
});
app.use('/api/', limiter);

// Base de datos en memoria (usar PostgreSQL en producción)
const agentes = new Map();
const sesionesChat = new Map();

// Middleware de logging
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
});

// Middleware de validación de errores
const validarErrores = (req, res, next) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({
            exito: false,
            errores: errores.array()
        });
    }
    next();
};

// ==================== ARCHIVOS ESTÁTICOS ====================

// Servir favicon desde raíz
app.get('/favicon.ico', (req, res) => {
    res.sendFile(path.join(__dirname, '../docs-ui/favicon.ico'));
});

// ==================== DOCUMENTACIÓN INTERACTIVA ====================

// Swagger UI - Interfaz interactiva para probar endpoints
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'SmythOS SRE Enhanced API',
    customfavIcon: '/favicon.ico',
    swaggerOptions: {
        persistAuthorization: true,
        displayRequestDuration: true,
        docExpansion: 'none',
        filter: true,
        showExtensions: true,
        showCommonExtensions: true,
        tryItOutEnabled: true
    }
}));

// ReDoc - Documentación estática más elegante
app.get('/redoc', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>SmythOS SRE Enhanced API - ReDoc</title>
        <meta charset="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link href="https://fonts.googleapis.com/css?family=Montserrat:300,400,700|Roboto:300,400,700" rel="stylesheet">
        <style>
            body { margin: 0; padding: 0; }
        </style>
    </head>
    <body>
        <redoc spec-url='/api-docs.json'></redoc>
        <script src="https://cdn.jsdelivr.net/npm/redoc@2.0.0/bundles/redoc.standalone.js"></script>
    </body>
    </html>
    `);
});

// Endpoint para obtener la especificación OpenAPI en JSON
app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpecs);
});

// Servir documentación interactiva personalizada
app.use('/docs-ui', express.static(path.join(__dirname, '../docs-ui')));

// Redirigir raíz a documentación interactiva
app.get('/', (req, res) => {
    res.redirect('/docs-ui');
});

// ==================== ENDPOINTS DE SISTEMA ====================

/**
 * @swagger
 * /api/estado:
 *   get:
 *     summary: Estado completo del sistema
 *     description: Obtiene información detallada sobre el estado del sistema, proveedores de IA, asistentes especializados y métricas de rendimiento.
 *     tags: [Sistema]
 *     responses:
 *       200:
 *         description: Estado del sistema obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 exito:
 *                   type: boolean
 *                   example: true
 *                 datos:
 *                   type: object
 *                   properties:
 *                     version:
 *                       type: string
 *                       example: "1.0.0"
 *                     estado:
 *                       type: string
 *                       example: "operativo"
 *                     asistentesEspecializados:
 *                       type: integer
 *                       example: 37
 *                     proveedoresIA:
 *                       type: integer
 *                       example: 10
 *                     uptime:
 *                       type: number
 *                       description: Tiempo de actividad en segundos
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
app.get('/api/estado', async (req, res) => {
    try {
        const proveedoresDisponibles = aiManager.getAvailableProviders();
        const asistentesDisponibles = assistantsManager.getAvailableAssistants();
        const categorias = assistantsManager.getCategories();

        res.json({
            exito: true,
            datos: {
                version: process.env.API_VERSION || '1.0.0',
                estado: 'operativo',
                agentesActivos: agentes.size,
                sesionesChat: sesionesChat.size,
                proveedoresIA: proveedoresDisponibles.length,
                proveedores: proveedoresDisponibles,
                asistentesEspecializados: asistentesDisponibles.length,
                categorias: categorias,
                uptime: process.uptime(),
                memoria: process.memoryUsage(),
                timestamp: new Date().toISOString()
            }
        });
    } catch (error) {
        res.status(500).json({
            exito: false,
            error: 'Error interno del servidor',
            mensaje: error.message
        });
    }
});

/**
 * GET /api/proveedores
 * Lista todos los proveedores de IA disponibles
 */
app.get('/api/proveedores', (req, res) => {
    try {
        const proveedores = aiManager.getAvailableProviders();
        
        res.json({
            exito: true,
            datos: proveedores,
            total: proveedores.length
        });
    } catch (error) {
        res.status(500).json({
            exito: false,
            error: 'Error al obtener proveedores',
            mensaje: error.message
        });
    }
});

/**
 * GET /api/modelos
 * Lista todos los modelos disponibles de todos los proveedores
 */
app.get('/api/modelos', (req, res) => {
    try {
        const modelos = aiManager.getAllModels();
        
        res.json({
            exito: true,
            datos: modelos,
            total: modelos.length
        });
    } catch (error) {
        res.status(500).json({
            exito: false,
            error: 'Error al obtener modelos',
            mensaje: error.message
        });
    }
});

/**
 * POST /api/proveedores/test
 * Prueba la conectividad de todos los proveedores
 */
app.post('/api/proveedores/test', async (req, res) => {
    try {
        const resultados = await aiManager.checkProvidersHealth();
        
        res.json({
            exito: true,
            datos: resultados,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            exito: false,
            error: 'Error al probar proveedores',
            mensaje: error.message
        });
    }
});

// ==================== ENDPOINTS DE AGENTES ====================

/**
 * GET /api/agentes
 * Listar todos los agentes disponibles
 */
app.get('/api/agentes', (req, res) => {
    try {
        const listaAgentes = Array.from(agentes.values()).map(agente => ({
            id: agente.id,
            nombre: agente.nombre,
            descripcion: agente.descripcion,
            proveedor: agente.proveedor,
            modelo: agente.modelo,
            fechaCreacion: agente.fechaCreacion,
            estado: agente.estado
        }));

        res.json({
            exito: true,
            datos: listaAgentes,
            total: listaAgentes.length
        });
    } catch (error) {
        res.status(500).json({
            exito: false,
            error: 'Error interno del servidor',
            mensaje: error.message
        });
    }
});

/**
 * POST /api/agentes
 * Crear un nuevo agente de IA
 */
app.post('/api/agentes', [
    body('nombre').isLength({ min: 1 }).withMessage('El nombre es requerido'),
    body('descripcion').isLength({ min: 10 }).withMessage('La descripción debe tener al menos 10 caracteres'),
    body('proveedor').isLength({ min: 1 }).withMessage('El proveedor es requerido'),
    body('modelo').isLength({ min: 1 }).withMessage('El modelo es requerido')
], validarErrores, (req, res) => {
    try {
        const { nombre, descripcion, proveedor, modelo, comportamiento, temperatura } = req.body;
        
        // Verificar que el proveedor existe
        const proveedoresDisponibles = aiManager.getAvailableProviders();
        const proveedorValido = proveedoresDisponibles.find(p => p.id === proveedor);
        
        if (!proveedorValido) {
            return res.status(400).json({
                exito: false,
                error: 'Proveedor no válido',
                mensaje: `El proveedor '${proveedor}' no está disponible`
            });
        }
        
        const agenteId = `agente_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        const nuevoAgente = {
            id: agenteId,
            nombre,
            descripcion,
            proveedor,
            modelo,
            comportamiento: comportamiento || `Eres ${nombre}. ${descripcion}`,
            temperatura: temperatura || 0.7,
            fechaCreacion: new Date().toISOString(),
            estado: 'activo',
            conversaciones: 0
        };
        
        agentes.set(agenteId, nuevoAgente);
        
        res.status(201).json({
            exito: true,
            datos: nuevoAgente,
            mensaje: 'Agente creado exitosamente'
        });
    } catch (error) {
        res.status(500).json({
            exito: false,
            error: 'Error al crear agente',
            mensaje: error.message
        });
    }
});

/**
 * GET /api/agentes/:id
 * Obtener información de un agente específico
 */
app.get('/api/agentes/:id', (req, res) => {
    try {
        const agente = agentes.get(req.params.id);
        
        if (!agente) {
            return res.status(404).json({
                exito: false,
                error: 'Agente no encontrado'
            });
        }
        
        res.json({
            exito: true,
            datos: agente
        });
    } catch (error) {
        res.status(500).json({
            exito: false,
            error: 'Error interno del servidor',
            mensaje: error.message
        });
    }
});

/**
 * POST /api/agentes/:id/prompt
 * Enviar un prompt a un agente específico
 */
app.post('/api/agentes/:id/prompt', [
    body('prompt').isLength({ min: 1 }).withMessage('El prompt es requerido')
], validarErrores, async (req, res) => {
    try {
        const agente = agentes.get(req.params.id);
        
        if (!agente) {
            return res.status(404).json({
                exito: false,
                error: 'Agente no encontrado'
            });
        }
        
        const { prompt, incluirBusquedaWeb = false } = req.body;
        
        // Preparar mensajes
        const mensajes = [
            { role: 'system', content: agente.comportamiento },
            { role: 'user', content: prompt }
        ];
        
        // Búsqueda web opcional
        let contextoBusqueda = '';
        if (incluirBusquedaWeb) {
            const resultadoBusqueda = await aiManager.searchWeb(prompt);
            if (resultadoBusqueda.success) {
                contextoBusqueda = `\n\nInformación web relevante:\n${resultadoBusqueda.results.map(r => `- ${r.title}: ${r.content}`).join('\n')}`;
                mensajes[1].content += contextoBusqueda;
            }
        }
        
        // Enviar prompt al proveedor
        const resultado = await aiManager.sendPrompt(
            agente.proveedor,
            agente.modelo,
            mensajes,
            { temperature: agente.temperatura }
        );
        
        if (!resultado.success) {
            return res.status(500).json({
                exito: false,
                error: 'Error del proveedor de IA',
                mensaje: resultado.error
            });
        }
        
        // Actualizar contador de conversaciones
        agente.conversaciones = (agente.conversaciones || 0) + 1;
        
        res.json({
            exito: true,
            datos: {
                respuesta: resultado.response,
                agente: {
                    id: agente.id,
                    nombre: agente.nombre,
                    proveedor: agente.proveedor,
                    modelo: agente.modelo
                },
                metadata: {
                    timestamp: resultado.timestamp,
                    incluyoBusquedaWeb: incluirBusquedaWeb,
                    conversacion: agente.conversaciones
                }
            }
        });
        
    } catch (error) {
        res.status(500).json({
            exito: false,
            error: 'Error al procesar prompt',
            mensaje: error.message
        });
    }
});

// ==================== ENDPOINTS DE BÚSQUEDA WEB ====================

/**
 * POST /api/busqueda
 * Búsqueda web inteligente con múltiples proveedores
 */
app.post('/api/busqueda', [
    body('query').isLength({ min: 1 }).withMessage('La consulta es requerida')
], validarErrores, async (req, res) => {
    try {
        const { query, maxResults = 5, includeAnswer = true, provider = 'tavily' } = req.body;

        const result = await searchManager.smartSearch(query, {
            maxResults,
            includeAnswer,
            provider
        });

        if (result.success) {
            res.json({
                exito: true,
                datos: {
                    consulta: query,
                    resultados: result.results || [],
                    respuesta: result.answer || null,
                    proveedor: result.provider
                },
                timestamp: result.timestamp
            });
        } else {
            res.status(500).json({
                exito: false,
                mensaje: 'Error en la búsqueda web',
                error: result.error
            });
        }

    } catch (error) {
        console.error('Error en búsqueda web:', error.message);
        res.status(500).json({
            exito: false,
            mensaje: 'Error en la búsqueda web',
            error: error.message
        });
    }
});

/**
 * POST /api/busqueda/combinada
 * Búsqueda combinada usando múltiples proveedores
 */
app.post('/api/busqueda/combinada', [
    body('query').isLength({ min: 1 }).withMessage('La consulta es requerida')
], validarErrores, async (req, res) => {
    try {
        const { query, maxResults = 10 } = req.body;

        const result = await searchManager.combinedSearch(query, { maxResults });

        res.json({
            exito: result.success,
            datos: {
                consulta: query,
                resultados: result.results || [],
                respuesta: result.answer || null,
                proveedoresUsados: result.providersUsed || [],
                errores: result.errors || null
            },
            timestamp: result.timestamp
        });

    } catch (error) {
        console.error('Error en búsqueda combinada:', error.message);
        res.status(500).json({
            exito: false,
            mensaje: 'Error en la búsqueda combinada',
            error: error.message
        });
    }
});

/**
 * GET /api/busqueda/proveedores
 * Lista proveedores de búsqueda disponibles
 */
app.get('/api/busqueda/proveedores', (req, res) => {
    try {
        const providers = searchManager.getAvailableProviders();

        res.json({
            exito: true,
            datos: providers,
            total: providers.length
        });
    } catch (error) {
        res.status(500).json({
            exito: false,
            mensaje: 'Error obteniendo proveedores de búsqueda',
            error: error.message
        });
    }
});

/**
 * POST /api/busqueda/test
 * Prueba conectividad de proveedores de búsqueda
 */
app.post('/api/busqueda/test', async (req, res) => {
    try {
        const results = await searchManager.testProviders();

        res.json({
            exito: true,
            datos: results,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            exito: false,
            mensaje: 'Error probando proveedores de búsqueda',
            error: error.message
        });
    }
});

// ==================== ENDPOINTS DE OCR ====================

/**
 * POST /api/ocr
 * Extrae texto de imágenes usando OCR
 */
app.post('/api/ocr', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                exito: false,
                mensaje: 'Imagen es requerida'
            });
        }

        const { method = 'tesseract', fallback = true } = req.body;

        const result = await ocrProvider.smartOCR(req.file.path, {
            method,
            fallback: fallback === 'true'
        });

        // Limpiar archivo temporal
        const fs = require('fs');
        if (fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }

        if (result.success) {
            res.json({
                exito: true,
                datos: {
                    texto: result.text,
                    confianza: result.confidence,
                    metodo: result.method,
                    proveedor: result.provider,
                    palabras: result.words || null,
                    lineas: result.lines || null
                },
                timestamp: result.timestamp
            });
        } else {
            res.status(500).json({
                exito: false,
                mensaje: 'Error en OCR',
                error: result.error
            });
        }

    } catch (error) {
        console.error('Error en OCR:', error.message);
        res.status(500).json({
            exito: false,
            mensaje: 'Error procesando imagen',
            error: error.message
        });
    }
});

/**
 * POST /api/ocr/batch
 * OCR de múltiples imágenes
 */
app.post('/api/ocr/batch', upload.array('images', 10), async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                exito: false,
                mensaje: 'Al menos una imagen es requerida'
            });
        }

        const { method = 'tesseract', batchSize = 5 } = req.body;
        const imagePaths = req.files.map(file => file.path);

        const result = await ocrProvider.batchOCR(imagePaths, {
            method,
            batchSize: parseInt(batchSize)
        });

        // Limpiar archivos temporales
        const fs = require('fs');
        imagePaths.forEach(path => {
            if (fs.existsSync(path)) {
                fs.unlinkSync(path);
            }
        });

        res.json({
            exito: result.success,
            datos: {
                totalImagenes: result.totalImages,
                exitosos: result.successfulOCR,
                resultados: result.results
            },
            timestamp: result.timestamp
        });

    } catch (error) {
        console.error('Error en OCR batch:', error.message);
        res.status(500).json({
            exito: false,
            mensaje: 'Error procesando imágenes',
            error: error.message
        });
    }
});

/**
 * GET /api/ocr/capacidades
 * Información sobre capacidades de OCR
 */
app.get('/api/ocr/capacidades', (req, res) => {
    try {
        const capabilities = ocrProvider.getCapabilities();

        res.json({
            exito: true,
            datos: capabilities
        });
    } catch (error) {
        res.status(500).json({
            exito: false,
            mensaje: 'Error obteniendo capacidades de OCR',
            error: error.message
        });
    }
});

// ==================== ENDPOINTS DE ASISTENTES ESPECIALIZADOS ====================

/**
 * GET /api/asistentes
 * Lista todos los asistentes especializados disponibles
 */
app.get('/api/asistentes', (req, res) => {
    try {
        const asistentes = assistantsManager.getAvailableAssistants();

        res.json({
            exito: true,
            datos: asistentes,
            total: asistentes.length
        });
    } catch (error) {
        res.status(500).json({
            exito: false,
            error: 'Error al obtener asistentes',
            mensaje: error.message
        });
    }
});

/**
 * GET /api/asistentes/categorias
 * Lista las categorías de asistentes disponibles
 */
app.get('/api/asistentes/categorias', (req, res) => {
    try {
        const categorias = assistantsManager.getCategories();

        res.json({
            exito: true,
            datos: categorias,
            total: categorias.length
        });
    } catch (error) {
        res.status(500).json({
            exito: false,
            error: 'Error al obtener categorías',
            mensaje: error.message
        });
    }
});

/**
 * GET /api/asistentes/categoria/:categoria
 * Lista asistentes de una categoría específica
 */
app.get('/api/asistentes/categoria/:categoria', (req, res) => {
    try {
        const { categoria } = req.params;
        const asistentes = assistantsManager.getAssistantsByCategory(categoria);

        res.json({
            exito: true,
            datos: asistentes,
            categoria: categoria,
            total: asistentes.length
        });
    } catch (error) {
        res.status(500).json({
            exito: false,
            error: 'Error al obtener asistentes por categoría',
            mensaje: error.message
        });
    }
});

/**
 * POST /api/asistentes/buscar
 * Busca asistentes por especialidad o descripción
 */
app.post('/api/asistentes/buscar', [
    body('query').isLength({ min: 1 }).withMessage('La consulta es requerida')
], validarErrores, (req, res) => {
    try {
        const { query } = req.body;
        const resultados = assistantsManager.searchAssistants(query);

        res.json({
            exito: true,
            datos: resultados,
            consulta: query,
            total: resultados.length
        });
    } catch (error) {
        res.status(500).json({
            exito: false,
            error: 'Error en búsqueda de asistentes',
            mensaje: error.message
        });
    }
});

/**
 * POST /api/asistentes/:id/consulta
 * Envía una consulta a un asistente especializado
 */
app.post('/api/asistentes/:id/consulta', [
    body('mensaje').isLength({ min: 1 }).withMessage('El mensaje es requerido')
], validarErrores, async (req, res) => {
    try {
        const { id } = req.params;
        const { mensaje, threadId } = req.body;

        const resultado = await assistantsManager.sendMessageToAssistant(id, mensaje, threadId);

        if (!resultado.success) {
            return res.status(500).json({
                exito: false,
                error: 'Error del asistente especializado',
                mensaje: resultado.error
            });
        }

        res.json({
            exito: true,
            datos: {
                respuesta: resultado.response,
                threadId: resultado.threadId,
                asistente: resultado.assistant,
                timestamp: resultado.timestamp
            }
        });

    } catch (error) {
        res.status(500).json({
            exito: false,
            error: 'Error al procesar consulta',
            mensaje: error.message
        });
    }
});

/**
 * POST /api/asistentes/recomendacion
 * Obtiene el mejor asistente para una consulta específica
 */
app.post('/api/asistentes/recomendacion', [
    body('consulta').isLength({ min: 1 }).withMessage('La consulta es requerida')
], validarErrores, (req, res) => {
    try {
        const { consulta } = req.body;
        const recomendacion = assistantsManager.getBestAssistantForQuery(consulta);

        res.json({
            exito: true,
            datos: {
                asistente: {
                    id: recomendacion.key,
                    titulo: recomendacion.assistant.titulo,
                    descripcion: recomendacion.assistant.descripcion,
                    categoria: recomendacion.assistant.categoria
                },
                recomendado: recomendacion.recommended,
                razon: recomendacion.reason,
                consulta: consulta
            }
        });
    } catch (error) {
        res.status(500).json({
            exito: false,
            error: 'Error al obtener recomendación',
            mensaje: error.message
        });
    }
});

// ==================== MANEJO DE ERRORES ====================

// Endpoint no encontrado
app.use('*', (req, res) => {
    res.status(404).json({
        exito: false,
        error: 'Endpoint no encontrado',
        mensaje: `La ruta ${req.method} ${req.originalUrl} no existe`
    });
});

// Manejo global de errores
app.use((error, req, res, next) => {
    console.error('Error no manejado:', error);
    res.status(500).json({
        exito: false,
        error: 'Error interno del servidor',
        mensaje: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
    });
});

// ==================== INICIALIZACIÓN ====================

// Crear agente por defecto si no existe
if (agentes.size === 0) {
    const bestProvider = aiManager.getBestProvider('general');
    
    const agenteDefault = {
        id: 'agente_default_legal',
        nombre: 'Asistente Legal Avanzado',
        descripcion: 'Agente especializado en derecho colombiano con múltiples proveedores de IA',
        proveedor: bestProvider.id,
        modelo: bestProvider.model,
        comportamiento: 'Eres un asistente legal especializado en derecho colombiano. Proporciona información precisa y actualizada sobre leyes, procedimientos y regulaciones en Colombia.',
        temperatura: 0.7,
        fechaCreacion: new Date().toISOString(),
        estado: 'activo',
        conversaciones: 0
    };
    
    agentes.set(agenteDefault.id, agenteDefault);
    console.log(`✅ Agente por defecto creado con proveedor: ${bestProvider.name}`);
}

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 SmythOS SRE API iniciada en puerto ${PORT}`);
    console.log(`📊 Proveedores de IA disponibles: ${aiManager.getAvailableProviders().length}`);
    console.log(`🤖 Agentes configurados: ${agentes.size}`);
    console.log(`🌐 Acceso: http://localhost:${PORT}`);
});

module.exports = app;
