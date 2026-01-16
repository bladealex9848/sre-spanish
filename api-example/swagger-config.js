/**
 * SmythOS SRE Enhanced - Configuración de Swagger/OpenAPI
 * Documentación interactiva de la API
 */

const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'SmythOS SRE Enhanced API',
            version: '1.0.0',
            description: `
# SmythOS SRE Enhanced - API REST Completa

Una plataforma completa de IA agéntica con 37 asistentes especializados, múltiples proveedores de IA, búsqueda web inteligente y capacidades de OCR.

## 🚀 Características Principales

- **37 Asistentes Especializados** de OpenAI
- **Múltiples Proveedores de IA**: OpenAI, Anthropic, Ollama, OpenRouter, Mistral
- **Búsqueda Web Inteligente**: Tavily, Google Custom Search, Exa
- **OCR Avanzado**: Tesseract, OpenAI Vision
- **Sistema de Recomendaciones** automático
- **Especialización Legal** colombiana

## 🔗 Acceso Público

**Base URL**: https://sre-api.alexanderoviedofadul.dev

## 📊 Estadísticas

- **Asistentes**: 37 especializados
- **Proveedores IA**: 10+ configurados
- **Endpoints**: 20+ operativos
- **Categorías**: 9 diferentes
- **Modelos**: 25+ disponibles

## 🛡️ Seguridad

- HTTPS habilitado
- CORS configurado
- Rate limiting: 100 requests/15 minutos
- Headers de seguridad implementados

## 📚 Documentación Adicional

- [Documentación Completa](https://github.com/bladealex9848/sre-spanish/blob/main/DOCUMENTACION-API-COMPLETA.md)
- [Ejemplos de Código](https://github.com/bladealex9848/sre-spanish/tree/main/ejemplos)
- [Repositorio GitHub](https://github.com/bladealex9848/sre-spanish)
            `,
            contact: {
                name: 'Alexander Oviedo Fadul',
                email: 'alexander.oviedo.fadul@gmail.com',
                url: 'https://github.com/bladealex9848'
            },
            license: {
                name: 'MIT',
                url: 'https://opensource.org/licenses/MIT'
            }
        },
        servers: [
            {
                url: 'https://sre-api.alexanderoviedofadul.dev',
                description: 'Servidor de Producción'
            },
            {
                url: 'http://localhost:8000',
                description: 'Servidor de Desarrollo'
            }
        ],
        tags: [
            {
                name: 'Sistema',
                description: 'Endpoints de información del sistema'
            },
            {
                name: 'Proveedores IA',
                description: 'Gestión de proveedores de inteligencia artificial'
            },
            {
                name: 'Asistentes',
                description: '37 asistentes especializados de OpenAI'
            },
            {
                name: 'Búsqueda Web',
                description: 'Búsqueda inteligente con múltiples proveedores'
            },
            {
                name: 'OCR',
                description: 'Reconocimiento óptico de caracteres'
            },
            {
                name: 'Agentes',
                description: 'Agentes personalizados de IA'
            }
        ],
        components: {
            schemas: {
                ApiResponse: {
                    type: 'object',
                    properties: {
                        exito: {
                            type: 'boolean',
                            description: 'Indica si la operación fue exitosa'
                        },
                        datos: {
                            type: 'object',
                            description: 'Datos de respuesta'
                        },
                        mensaje: {
                            type: 'string',
                            description: 'Mensaje descriptivo'
                        },
                        error: {
                            type: 'string',
                            description: 'Mensaje de error si aplica'
                        },
                        timestamp: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Timestamp de la respuesta'
                        }
                    }
                },
                Asistente: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'string',
                            description: 'ID único del asistente',
                            example: 'tutela'
                        },
                        assistantId: {
                            type: 'string',
                            description: 'ID del asistente en OpenAI',
                            example: 'asst_xisQZwJ1bbmvXET8YG0eiAmb'
                        },
                        titulo: {
                            type: 'string',
                            description: 'Título descriptivo del asistente',
                            example: 'TutelaBot - Asistente Especializado en Acción de Tutela'
                        },
                        descripcion: {
                            type: 'string',
                            description: 'Descripción de las capacidades',
                            example: 'Experto en mecanismos constitucionales de protección de derechos'
                        },
                        categoria: {
                            type: 'string',
                            description: 'Categoría del asistente',
                            example: 'legal'
                        },
                        especialidad: {
                            type: 'string',
                            description: 'Especialidad específica',
                            example: 'tutela'
                        }
                    }
                },
                Proveedor: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'string',
                            description: 'ID del proveedor',
                            example: 'openai'
                        },
                        name: {
                            type: 'string',
                            description: 'Nombre del proveedor',
                            example: 'OpenAI'
                        },
                        models: {
                            type: 'array',
                            items: {
                                type: 'string'
                            },
                            description: 'Lista de modelos disponibles',
                            example: ['gpt-5-nano', 'gpt-4o']
                        },
                        defaultModel: {
                            type: 'string',
                            description: 'Modelo por defecto',
                            example: 'gpt-5-nano'
                        },
                        status: {
                            type: 'string',
                            description: 'Estado del proveedor',
                            example: 'disponible'
                        },
                        requiresApiKey: {
                            type: 'boolean',
                            description: 'Si requiere API key',
                            example: true
                        }
                    }
                },
                ResultadoBusqueda: {
                    type: 'object',
                    properties: {
                        title: {
                            type: 'string',
                            description: 'Título del resultado'
                        },
                        url: {
                            type: 'string',
                            description: 'URL del resultado'
                        },
                        content: {
                            type: 'string',
                            description: 'Contenido/snippet del resultado'
                        },
                        score: {
                            type: 'number',
                            description: 'Puntuación de relevancia'
                        }
                    }
                },
                OCRResult: {
                    type: 'object',
                    properties: {
                        texto: {
                            type: 'string',
                            description: 'Texto extraído de la imagen'
                        },
                        confianza: {
                            type: 'number',
                            description: 'Nivel de confianza (0-100)'
                        },
                        metodo: {
                            type: 'string',
                            description: 'Método de OCR utilizado',
                            example: 'tesseract'
                        },
                        proveedor: {
                            type: 'string',
                            description: 'Proveedor de OCR',
                            example: 'tesseract'
                        }
                    }
                }
            },
            responses: {
                BadRequest: {
                    description: 'Solicitud incorrecta',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/ApiResponse'
                            }
                        }
                    }
                },
                InternalError: {
                    description: 'Error interno del servidor',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/ApiResponse'
                            }
                        }
                    }
                },
                Success: {
                    description: 'Operación exitosa',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/ApiResponse'
                            }
                        }
                    }
                }
            }
        }
    },
    apis: ['./server-enhanced.js'], // Archivos que contienen anotaciones de Swagger
};

const specs = swaggerJsdoc(options);

module.exports = specs;
