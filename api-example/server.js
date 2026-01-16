#!/usr/bin/env node

/**
 * SmythOS SRE - API REST en Español
 * Servidor Express.js que expone SmythOS como API REST
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware de seguridad
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // máximo 100 requests por ventana
    message: {
        error: 'Demasiadas solicitudes, intenta de nuevo más tarde'
    }
});
app.use('/api/', limiter);

// Simulación de base de datos en memoria (usar PostgreSQL en producción)
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
 * POST /api/agentes/crear
 * Crear un nuevo agente de IA
 */
app.post('/api/agentes/crear', [
    body('nombre').isLength({ min: 1 }).withMessage('El nombre es requerido'),
    body('comportamiento').isLength({ min: 10 }).withMessage('El comportamiento debe tener al menos 10 caracteres'),
    body('modelo').isIn(['gpt-4o', 'gpt-4o-mini', 'claude-3-sonnet']).withMessage('Modelo no válido')
], validarErrores, (req, res) => {
    try {
        const { nombre, comportamiento, modelo, descripcion } = req.body;
        
        const agenteId = `agente_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        const nuevoAgente = {
            id: agenteId,
            nombre,
            descripcion: descripcion || '',
            comportamiento,
            modelo,
            fechaCreacion: new Date().toISOString(),
            estado: 'activo',
            habilidades: [],
            configuracion: {
                temperatura: 0.7,
                maxTokens: 2000,
                streaming: false
            }
        };

        agentes.set(agenteId, nuevoAgente);

        res.status(201).json({
            exito: true,
            mensaje: 'Agente creado exitosamente',
            datos: {
                id: agenteId,
                nombre,
                descripcion,
                modelo,
                fechaCreacion: nuevoAgente.fechaCreacion
            }
        });
    } catch (error) {
        res.status(500).json({
            exito: false,
            error: 'Error al crear el agente',
            mensaje: error.message
        });
    }
});

/**
 * POST /api/agentes/:id/prompt
 * Ejecutar un prompt en un agente específico
 */
app.post('/api/agentes/:id/prompt', [
    body('mensaje').isLength({ min: 1 }).withMessage('El mensaje es requerido')
], validarErrores, async (req, res) => {
    try {
        const { id } = req.params;
        const { mensaje, contexto } = req.body;

        const agente = agentes.get(id);
        if (!agente) {
            return res.status(404).json({
                exito: false,
                error: 'Agente no encontrado'
            });
        }

        // Simulación de procesamiento con SmythOS
        // En implementación real, aquí se usaría el SDK de SmythOS
        const respuestaSimulada = await simularRespuestaIA(agente, mensaje, contexto);

        res.json({
            exito: true,
            datos: {
                agenteId: id,
                mensaje,
                respuesta: respuestaSimulada.contenido,
                modelo: agente.modelo,
                tokens: respuestaSimulada.tokens,
                tiempo: respuestaSimulada.tiempo,
                timestamp: new Date().toISOString()
            }
        });
    } catch (error) {
        res.status(500).json({
            exito: false,
            error: 'Error al procesar el prompt',
            mensaje: error.message
        });
    }
});

/**
 * POST /api/agentes/:id/chat/iniciar
 * Iniciar una sesión de chat con un agente
 */
app.post('/api/agentes/:id/chat/iniciar', (req, res) => {
    try {
        const { id } = req.params;
        
        const agente = agentes.get(id);
        if (!agente) {
            return res.status(404).json({
                exito: false,
                error: 'Agente no encontrado'
            });
        }

        const sesionId = `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        const nuevaSesion = {
            id: sesionId,
            agenteId: id,
            historial: [],
            fechaInicio: new Date().toISOString(),
            estado: 'activa'
        };

        sesionesChat.set(sesionId, nuevaSesion);

        res.status(201).json({
            exito: true,
            mensaje: 'Sesión de chat iniciada',
            datos: {
                sesionId,
                agenteId: id,
                agente: {
                    nombre: agente.nombre,
                    modelo: agente.modelo
                }
            }
        });
    } catch (error) {
        res.status(500).json({
            exito: false,
            error: 'Error al iniciar chat',
            mensaje: error.message
        });
    }
});

/**
 * POST /api/chat/:sesionId/mensaje
 * Enviar mensaje en una sesión de chat
 */
app.post('/api/chat/:sesionId/mensaje', [
    body('mensaje').isLength({ min: 1 }).withMessage('El mensaje es requerido')
], validarErrores, async (req, res) => {
    try {
        const { sesionId } = req.params;
        const { mensaje } = req.body;

        const sesion = sesionesChat.get(sesionId);
        if (!sesion) {
            return res.status(404).json({
                exito: false,
                error: 'Sesión de chat no encontrada'
            });
        }

        const agente = agentes.get(sesion.agenteId);
        
        // Agregar mensaje del usuario al historial
        sesion.historial.push({
            tipo: 'usuario',
            mensaje,
            timestamp: new Date().toISOString()
        });

        // Simular respuesta del agente
        const respuesta = await simularRespuestaIA(agente, mensaje, sesion.historial);
        
        // Agregar respuesta del agente al historial
        sesion.historial.push({
            tipo: 'agente',
            mensaje: respuesta.contenido,
            timestamp: new Date().toISOString(),
            tokens: respuesta.tokens
        });

        res.json({
            exito: true,
            datos: {
                sesionId,
                respuesta: respuesta.contenido,
                historial: sesion.historial.slice(-10), // Últimos 10 mensajes
                tokens: respuesta.tokens
            }
        });
    } catch (error) {
        res.status(500).json({
            exito: false,
            error: 'Error al procesar mensaje',
            mensaje: error.message
        });
    }
});

// ==================== ENDPOINTS DE UTILIDADES ====================

/**
 * GET /api/modelos
 * Listar modelos de IA disponibles
 */
app.get('/api/modelos', (req, res) => {
    const modelos = [
        {
            id: 'gpt-4o',
            nombre: 'GPT-4 Optimizado',
            proveedor: 'OpenAI',
            descripcion: 'Modelo más avanzado para tareas complejas',
            costoPorToken: 0.00003
        },
        {
            id: 'gpt-4o-mini',
            nombre: 'GPT-4 Mini',
            proveedor: 'OpenAI',
            descripcion: 'Versión optimizada para velocidad',
            costoPorToken: 0.00001
        },
        {
            id: 'claude-3-sonnet',
            nombre: 'Claude 3 Sonnet',
            proveedor: 'Anthropic',
            descripcion: 'Excelente para análisis y razonamiento',
            costoPorToken: 0.00002
        }
    ];

    res.json({
        exito: true,
        datos: modelos
    });
});

/**
 * GET /api/estado
 * Estado del sistema y estadísticas
 */
app.get('/api/estado', (req, res) => {
    res.json({
        exito: true,
        datos: {
            version: '1.0.0',
            estado: 'operativo',
            agentesActivos: agentes.size,
            sesionesChat: sesionesChat.size,
            uptime: process.uptime(),
            memoria: process.memoryUsage(),
            timestamp: new Date().toISOString()
        }
    });
});

// ==================== FUNCIONES AUXILIARES ====================

/**
 * Simula una respuesta de IA (reemplazar con SmythOS real)
 */
async function simularRespuestaIA(agente, mensaje, contexto = null) {
    // Simular tiempo de procesamiento
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    const respuestas = [
        `Como ${agente.nombre}, entiendo tu consulta sobre "${mensaje}". Basándome en mi comportamiento definido como "${agente.comportamiento}", puedo ayudarte con esto.`,
        `Procesando tu solicitud con el modelo ${agente.modelo}. Aquí está mi análisis de "${mensaje}".`,
        `Excelente pregunta. Según mi configuración y experiencia, te puedo decir que...`,
        `Interesante punto. Déjame analizar "${mensaje}" desde mi perspectiva como ${agente.nombre}.`
    ];

    return {
        contenido: respuestas[Math.floor(Math.random() * respuestas.length)] + ` (Respuesta simulada generada el ${new Date().toLocaleString()})`,
        tokens: Math.floor(Math.random() * 500) + 100,
        tiempo: Math.floor(Math.random() * 3000) + 500
    };
}

// ==================== MANEJO DE ERRORES ====================

// Middleware de manejo de errores 404
app.use('*', (req, res) => {
    res.status(404).json({
        exito: false,
        error: 'Endpoint no encontrado',
        mensaje: `La ruta ${req.method} ${req.originalUrl} no existe`
    });
});

// Middleware de manejo de errores globales
app.use((error, req, res, next) => {
    console.error('Error no manejado:', error);
    res.status(500).json({
        exito: false,
        error: 'Error interno del servidor',
        mensaje: process.env.NODE_ENV === 'development' ? error.message : 'Algo salió mal'
    });
});

// ==================== INICIO DEL SERVIDOR ====================

app.listen(PORT, () => {
    console.log(`
🚀 SmythOS SRE API iniciada exitosamente
📍 Servidor corriendo en: http://localhost:${PORT}
📚 Documentación: http://localhost:${PORT}/api/estado
🔧 Entorno: ${process.env.NODE_ENV || 'development'}
⏰ Iniciado: ${new Date().toLocaleString()}
    `);
});

module.exports = app;
