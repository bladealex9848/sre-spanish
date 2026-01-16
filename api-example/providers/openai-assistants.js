/**
 * SmythOS SRE - Gestor de Asistentes Especializados de OpenAI
 * Maneja 35+ asistentes expertos especializados
 */

const axios = require('axios');
require('dotenv').config();

class OpenAIAssistantsManager {
    constructor() {
        this.apiKey = process.env.OPENAI_API_KEY;
        this.baseURL = 'https://api.openai.com/v1';
        
        // Configuración de asistentes especializados
        this.assistants = {
            // === ASISTENTES LEGALES ===
            transformacion_digital: {
                id: "asst_F33bnQzBVqQLcjveUTC14GaM",
                titulo: "Asistente especializado en transformación digital",
                descripcion: "Experto en procesos de transformación digital, tecnología e innovación",
                categoria: "tecnologia",
                especialidad: "transformacion_digital"
            },
            profesor_synapse: {
                id: "asst_MzMayuSJV8AhP6vacv2ee3Xx",
                titulo: "Profesor Synapse - Asistente de IA experto en aprendizaje automático",
                descripcion: "Especialista en IA, aprendizaje automático y resolución de problemas",
                categoria: "educacion",
                especialidad: "inteligencia_artificial"
            },
            vigilancia_judicial: {
                id: "asst_gRTtnBm9jH8VUhAG20l1RBo1",
                titulo: "Experto en Vigilancia Judicial",
                descripcion: "Especialista en vigilancia judicial administrativa y normativa relacionada",
                categoria: "legal",
                especialidad: "vigilancia_judicial"
            },
            constitucion: {
                id: "asst_gpCZlh5HpWgGAjHqbzFaaVpp",
                titulo: "Experto en Constitución Colombiana",
                descripcion: "Autoridad en derechos fundamentales y normativa constitucional",
                categoria: "legal",
                especialidad: "derecho_constitucional"
            },
            proceso_civil: {
                id: "asst_dQhjl00QPrJrJDYrwhfE0gBX",
                titulo: "ProcesAI CGP",
                descripcion: "Especialista en Código General del Proceso y derecho procesal",
                categoria: "legal",
                especialidad: "derecho_procesal"
            },
            derecho_disciplinario: {
                id: "asst_bbeLTquUNR8yFS1IVeeFff68",
                titulo: "ColDisBot - Agente de Derecho Disciplinario Colombiano",
                descripcion: "Experto en régimen disciplinario y procedimientos sancionatorios",
                categoria: "legal",
                especialidad: "derecho_disciplinario"
            },
            delitos_penales: {
                id: "asst_u0MhHeXqHiDztxdLLYrQeeQr",
                titulo: "Parte Especial de los Delitos en Particular",
                descripcion: "Especialista en Código Penal y tipificación de delitos",
                categoria: "legal",
                especialidad: "derecho_penal"
            },
            reclasificaciones: {
                id: "asst_XA5fS0wvyifI3afm1TnRooEQ",
                titulo: "Experto en Reclasificaciones",
                descripcion: "Analista especializado en procesos de reclasificación y validación",
                categoria: "legal",
                especialidad: "reclasificaciones"
            },
            etica_educativa: {
                id: "asst_Y0zt3gjDRD1T0ZBuyJpMB48R",
                titulo: "Asesor Ético Educativo Colombiano",
                descripcion: "Consultor sobre prácticas éticas en entornos educativos",
                categoria: "educacion",
                especialidad: "etica_educativa"
            },
            resiliencia: {
                id: "asst_hd43w2kRFA7VWNxIBy9Mgy8j",
                titulo: "Guía de Resiliencia y Manifestación",
                descripcion: "Facilitador de crecimiento personal y superación de adversidades",
                categoria: "bienestar",
                especialidad: "desarrollo_personal"
            },
            tributaria: {
                id: "asst_1AWeWoJvYpz7DpYvlaNb0pgk",
                titulo: "Guía Tributaria Colombia",
                descripcion: "Asesor en obligaciones fiscales y normativa tributaria colombiana",
                categoria: "legal",
                especialidad: "derecho_tributario"
            },
            copywriting: {
                id: "asst_iHVYk93ksnQKHuN02XIktkMT",
                titulo: "Artífice de Palabras",
                descripcion: "Especialista en redacción persuasiva y optimización de contenidos",
                categoria: "comunicacion",
                especialidad: "redaccion"
            },
            linguistica: {
                id: "asst_g62x4oFzLFqB2Ncmj5YlDbBr",
                titulo: "Asistente Lingüístico",
                descripcion: "Experto en gramática, estilo y comunicación efectiva",
                categoria: "comunicacion",
                especialidad: "linguistica"
            },
            analisis_documental: {
                id: "asst_eYvjSdxv1VUA1Su9zQ07oyoO",
                titulo: "Asistente de Análisis Documental",
                descripcion: "Especialista en procesamiento y validación de documentos",
                categoria: "documentos",
                especialidad: "analisis_documental"
            },
            justicia_lab: {
                id: "asst_HP2cp1DT2LItd1tl6o4Bggma",
                titulo: "Asistente especializado en JusticIALab",
                descripcion: "Experto en innovación y transformación digital para la Rama Judicial",
                categoria: "legal",
                especialidad: "innovacion_judicial"
            },
            gestion_documental: {
                id: "asst_TKhi6U5Cwp0XUO51d2PYp8Pz",
                titulo: "Asistente Experto en Gestión Documental Judicial",
                descripcion: "Especialista en digitalización y manejo de expedientes electrónicos",
                categoria: "legal",
                especialidad: "gestion_documental"
            },
            salud_legal: {
                id: "asst_Jq3qTXZkvpCdn7jcoeNJmDbF",
                titulo: "Asesor Legal en Salud Colombiano",
                descripcion: "Consultor en responsabilidad médica y derechos de pacientes",
                categoria: "legal",
                especialidad: "derecho_salud"
            },
            anticorrupcion: {
                id: "asst_U2RDKhpEi2anWNKrzaGfY0y9",
                titulo: "Asesor Legal Anticorrupción Colombiano",
                descripcion: "Especialista en prevención y tratamiento de casos de corrupción",
                categoria: "legal",
                especialidad: "anticorrupcion"
            },
            calidad_salud: {
                id: "asst_bhP2DkheIoBrZ0EIsV3TlTFw",
                titulo: "Asesor en Gestión de Calidad en Salud",
                descripcion: "Experto en acreditación y sistemas de calidad en entidades de salud",
                categoria: "salud",
                especialidad: "calidad_salud"
            },
            traslados_judiciales: {
                id: "asst_hFL7ZJI9yJm71GM6JOZSwLkr",
                titulo: "Asesor en Traslados de Servidores Judiciales en Colombia",
                descripcion: "Especialista en normativa y procedimientos de traslados judiciales",
                categoria: "legal",
                especialidad: "traslados_judiciales"
            },
            evaluacion_judicial: {
                id: "asst_aNHQtvJC55LqcG7MDMCe7v6N",
                titulo: "Evaluación Judicial de Funcionarios y Empleados",
                descripcion: "Experto en procesos de calificación y evaluación de servicios judiciales",
                categoria: "legal",
                especialidad: "evaluacion_judicial"
            },
            trading: {
                id: "asst_xpjUBpPwPk4dqW9Oy3kwk8jZ",
                titulo: "Asesor de Trading y Análisis Técnico Institucional",
                descripcion: "Especialista en mercados financieros y estrategias de inversión",
                categoria: "finanzas",
                especialidad: "trading"
            },
            bochica: {
                id: "asst_KJJHC62qZfi6yIb54YoTaPHK",
                titulo: "Sistema Unificado para la Provisión de Vacantes Temporales - BOCHICA",
                descripcion: "Experto en gestión de vacantes judiciales y procesos de selección",
                categoria: "legal",
                especialidad: "gestion_vacantes"
            },
            tutela: {
                id: "asst_xisQZwJ1bbmvXET8YG0eiAmb",
                titulo: "TutelaBot - Asistente Especializado en Acción de Tutela",
                descripcion: "Experto en mecanismos constitucionales de protección de derechos",
                categoria: "legal",
                especialidad: "tutela"
            },
            asistente_virtual: {
                id: "asst_RfRNo5Ij76ieg7mV11CqYV9v",
                titulo: "Asistente Virtual de Inteligencia Artificial",
                descripcion: "Ayudante virtual con conocimiento amplio en múltiples disciplinas",
                categoria: "general",
                especialidad: "asistente_general"
            },
            familiabot: {
                id: "asst_FCotE7P9EMKHpNfKUTZou0B3",
                titulo: "FamiliaBot - Asistente de IA especializado en derecho de familia",
                descripcion: "Asistente de IA especializado en derecho de familia en Colombia",
                categoria: "legal",
                especialidad: "derecho_familia"
            },
            mardukia: {
                id: "asst_1RPEPlzl3VOeofqvORt8czBx",
                titulo: "MardukIA - Asistente IA especializado en Marduk",
                descripcion: "Asistente IA especializado experto en el ecosistema Marduk",
                categoria: "tecnologia",
                especialidad: "ecosistema_marduk"
            },
            consentlex: {
                id: "asst_r4XaKXu3vHVJL3fp8Igq6M3o",
                titulo: "ConsentLex - Experto en Consentimiento Informado Médico-Legal",
                descripcion: "Asistente IA experto especializado en consentimientos informados médico-legales",
                categoria: "legal",
                especialidad: "consentimiento_medico"
            },
            guillo: {
                id: "asst_Xol36Cy1LrP13P4Wb7aWQqE4",
                titulo: "Guillo 🎓 - Asistente IA Experto en Instituciones Educativas",
                descripcion: "Agente de inteligencia artificial especializado en Instituciones Educativas",
                categoria: "educacion",
                especialidad: "instituciones_educativas"
            },
            resumen_experto: {
                id: "asst_yCOyXgQSavGHjWZa8hQyqvMC",
                titulo: "Resumen Experto - Analiza documentos y genera resúmenes",
                descripcion: "Especializado en analizar y comunicar de manera concisa el contenido de documentos",
                categoria: "documentos",
                especialidad: "resumenes"
            },
            bibliofinder: {
                id: "asst_EzsMrgkISWujEdKdb1j8Urpq",
                titulo: "Bibliofinder - Extrae y genera detalles de libros de PDFs",
                descripcion: "Agente que procesa archivos PDF de libros para extraer información detallada",
                categoria: "documentos",
                especialidad: "extraccion_libros"
            },
            podcastor: {
                id: "asst_rsfNf9WGqVJh4XeO3Qy2BOvc",
                titulo: "Podcastor 🎙️ - Transforma documentos en episodios de podcast",
                descripcion: "Transforma documentos complejos en episodios de podcast claros y accesibles",
                categoria: "comunicacion",
                especialidad: "podcast"
            },
            powerbi_mentor: {
                id: "asst_F0TqlA7jtKORw4bilVl4mN56",
                titulo: "PowerBI Mentor - Especialista en Análisis y Visualización de Datos",
                descripcion: "Agente experto en Microsoft Power BI con amplio conocimiento del ecosistema",
                categoria: "tecnologia",
                especialidad: "powerbi"
            },
            consejoexpert: {
                id: "asst_1brkBl4Fkd3r8cMQ3OcR0Q9T",
                titulo: "⚖️ ConsejoExpert ⚖️ - Sistema Experto para Consejos Seccionales",
                descripcion: "Agente experto en funciones de los Consejos Seccionales de la Judicatura",
                categoria: "legal",
                especialidad: "consejos_seccionales"
            },
            lextech_advisor: {
                id: "asst_QdhNe9nyNnubkzTsg3CAnPxM",
                titulo: "LexTech Advisor: Asesor Experto en Contratación Judicial",
                descripcion: "Agente especializado en contratación judicial para el Consejo Superior de la Judicatura",
                categoria: "legal",
                especialidad: "contratacion_judicial"
            },
            juris_integral: {
                id: "asst_GUpNOlpxdJZj9oRHkde7qsSe",
                titulo: "JURIS-INTEGRAL - Jurisprudencia Inteligente con Rigor Administrativo",
                descripcion: "Agente que emula la metodología de análisis de la Magistrada Mary Lucero Novoa Moreno",
                categoria: "legal",
                especialidad: "jurisprudencia"
            },
            aejco: {
                id: "asst_FwiOzxQ3SakT3ipX9ioONOVc",
                titulo: "Asistente Estratégico para la Justicia Colombiana (AEJCO)",
                descripcion: "Especializado en estructura, gobernanza y estrategia de la Rama Judicial",
                categoria: "legal",
                especialidad: "estrategia_judicial"
            }
        };
    }

    /**
     * Obtiene la lista de todos los asistentes disponibles
     */
    getAvailableAssistants() {
        return Object.entries(this.assistants).map(([key, assistant]) => ({
            id: key,
            assistantId: assistant.id,
            titulo: assistant.titulo,
            descripcion: assistant.descripcion,
            categoria: assistant.categoria,
            especialidad: assistant.especialidad
        }));
    }

    /**
     * Obtiene asistentes por categoría
     */
    getAssistantsByCategory(categoria) {
        return Object.entries(this.assistants)
            .filter(([key, assistant]) => assistant.categoria === categoria)
            .map(([key, assistant]) => ({
                id: key,
                assistantId: assistant.id,
                titulo: assistant.titulo,
                descripcion: assistant.descripcion,
                especialidad: assistant.especialidad
            }));
    }

    /**
     * Obtiene las categorías disponibles
     */
    getCategories() {
        const categories = [...new Set(Object.values(this.assistants).map(a => a.categoria))];
        return categories.map(cat => ({
            categoria: cat,
            cantidad: Object.values(this.assistants).filter(a => a.categoria === cat).length
        }));
    }

    /**
     * Busca asistentes por especialidad o descripción
     */
    searchAssistants(query) {
        const searchTerm = query.toLowerCase();
        return Object.entries(this.assistants)
            .filter(([key, assistant]) => 
                assistant.titulo.toLowerCase().includes(searchTerm) ||
                assistant.descripcion.toLowerCase().includes(searchTerm) ||
                assistant.especialidad.toLowerCase().includes(searchTerm)
            )
            .map(([key, assistant]) => ({
                id: key,
                assistantId: assistant.id,
                titulo: assistant.titulo,
                descripcion: assistant.descripcion,
                categoria: assistant.categoria,
                especialidad: assistant.especialidad
            }));
    }

    /**
     * Crea un thread para conversación con un asistente
     */
    async createThread() {
        try {
            const response = await axios.post(`${this.baseURL}/threads`, {}, {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json',
                    'OpenAI-Beta': 'assistants=v2'
                }
            });

            return {
                success: true,
                threadId: response.data.id,
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                timestamp: new Date().toISOString()
            };
        }
    }

    /**
     * Envía un mensaje a un asistente específico
     */
    async sendMessageToAssistant(assistantKey, message, threadId = null) {
        try {
            const assistant = this.assistants[assistantKey];
            if (!assistant) {
                throw new Error(`Asistente no encontrado: ${assistantKey}`);
            }

            // Crear thread si no se proporciona
            let currentThreadId = threadId;
            if (!currentThreadId) {
                const threadResult = await this.createThread();
                if (!threadResult.success) {
                    throw new Error(`Error creando thread: ${threadResult.error}`);
                }
                currentThreadId = threadResult.threadId;
            }

            // Agregar mensaje al thread
            await axios.post(`${this.baseURL}/threads/${currentThreadId}/messages`, {
                role: 'user',
                content: message
            }, {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json',
                    'OpenAI-Beta': 'assistants=v2'
                }
            });

            // Ejecutar el asistente
            const runResponse = await axios.post(`${this.baseURL}/threads/${currentThreadId}/runs`, {
                assistant_id: assistant.id
            }, {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json',
                    'OpenAI-Beta': 'assistants=v2'
                }
            });

            const runId = runResponse.data.id;

            // Esperar a que complete la ejecución
            let runStatus = 'queued';
            let attempts = 0;
            const maxAttempts = 30;

            while (runStatus !== 'completed' && runStatus !== 'failed' && attempts < maxAttempts) {
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                const statusResponse = await axios.get(`${this.baseURL}/threads/${currentThreadId}/runs/${runId}`, {
                    headers: {
                        'Authorization': `Bearer ${this.apiKey}`,
                        'OpenAI-Beta': 'assistants=v2'
                    }
                });

                runStatus = statusResponse.data.status;
                attempts++;
            }

            if (runStatus !== 'completed') {
                throw new Error(`El asistente no completó la tarea. Estado: ${runStatus}`);
            }

            // Obtener la respuesta
            const messagesResponse = await axios.get(`${this.baseURL}/threads/${currentThreadId}/messages`, {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'OpenAI-Beta': 'assistants=v2'
                }
            });

            const assistantMessage = messagesResponse.data.data.find(msg => msg.role === 'assistant');
            const responseText = assistantMessage?.content[0]?.text?.value || 'Sin respuesta';

            return {
                success: true,
                response: responseText,
                threadId: currentThreadId,
                runId: runId,
                assistant: {
                    id: assistantKey,
                    titulo: assistant.titulo,
                    categoria: assistant.categoria
                },
                timestamp: new Date().toISOString()
            };

        } catch (error) {
            console.error(`Error con asistente ${assistantKey}:`, error.message);
            return {
                success: false,
                error: error.message,
                assistant: assistantKey,
                timestamp: new Date().toISOString()
            };
        }
    }

    /**
     * Obtiene el mejor asistente para una consulta específica
     */
    getBestAssistantForQuery(query) {
        const queryLower = query.toLowerCase();
        
        // Mapeo de palabras clave a asistentes
        const keywordMapping = {
            'constitución': 'constitucion',
            'tutela': 'tutela',
            'familia': 'familiabot',
            'penal': 'delitos_penales',
            'tributario': 'tributaria',
            'disciplinario': 'derecho_disciplinario',
            'salud': 'salud_legal',
            'corrupción': 'anticorrupcion',
            'documento': 'analisis_documental',
            'resumen': 'resumen_experto',
            'trading': 'trading',
            'powerbi': 'powerbi_mentor',
            'podcast': 'podcastor',
            'educación': 'guillo',
            'vigilancia': 'vigilancia_judicial',
            'traslado': 'traslados_judiciales',
            'evaluación': 'evaluacion_judicial',
            'bochica': 'bochica',
            'consejo': 'consejoexpert',
            'contratación': 'lextech_advisor',
            'jurisprudencia': 'juris_integral',
            'estrategia': 'aejco'
        };

        for (const [keyword, assistantKey] of Object.entries(keywordMapping)) {
            if (queryLower.includes(keyword)) {
                return {
                    recommended: true,
                    assistant: this.assistants[assistantKey],
                    key: assistantKey,
                    reason: `Detectada palabra clave: "${keyword}"`
                };
            }
        }

        // Asistente por defecto
        return {
            recommended: false,
            assistant: this.assistants.asistente_virtual,
            key: 'asistente_virtual',
            reason: 'Asistente general por defecto'
        };
    }
}

module.exports = OpenAIAssistantsManager;
