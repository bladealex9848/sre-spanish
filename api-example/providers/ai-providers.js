/**
 * SmythOS SRE - Gestor de Proveedores de IA
 * Maneja múltiples APIs de IA de forma unificada
 */

const axios = require('axios');
require('dotenv').config();

class AIProviderManager {
    constructor() {
        this.providers = {
            openai: {
                name: 'OpenAI',
                baseURL: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1',
                apiKey: process.env.OPENAI_API_KEY,
                models: (process.env.OPENAI_MODELS || 'gpt-5-nano').split(','),
                defaultModel: process.env.OPENAI_API_MODEL || 'gpt-5-nano'
            },
            // Anthropic removido - solo modelos de pago
            // anthropic: {
            //     name: 'Anthropic',
            //     baseURL: 'https://api.anthropic.com/v1',
            //     apiKey: process.env.ANTHROPIC_API_KEY,
            //     models: (process.env.ANTHROPIC_MODELS || 'claude-3-5-sonnet-20241022').split(','),
            //     defaultModel: 'claude-3-5-sonnet-20241022'
            // },
            together: {
                name: 'Together AI',
                baseURL: process.env.TOGETHER_BASE_URL || 'https://api.together.xyz/v1',
                apiKey: process.env.TOGETHER_API_KEY,
                models: (process.env.TOGETHER_MODELS || 'meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo').split(','),
                defaultModel: 'meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo'
            },
            groq: {
                name: 'Groq',
                baseURL: process.env.GROQ_BASE_URL || 'https://api.groq.com/openai/v1',
                apiKey: process.env.GROQ_API_KEY,
                models: (process.env.GROQ_MODELS || 'llama-3.1-70b-versatile').split(','),
                defaultModel: 'llama-3.1-70b-versatile'
            },
            deepinfra: {
                name: 'DeepInfra',
                baseURL: process.env.DEEPINFRA_BASE_URL || 'https://api.deepinfra.com/v1/openai',
                apiKey: process.env.DEEPINFRA_API_KEY,
                models: (process.env.DEEPINFRA_MODELS || 'meta-llama/Meta-Llama-3.1-70B-Instruct').split(','),
                defaultModel: 'meta-llama/Meta-Llama-3.1-70B-Instruct'
            },
            deepseek: {
                name: 'DeepSeek',
                baseURL: process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com/v1',
                apiKey: process.env.DEEPSEEK_API_KEY,
                models: (process.env.DEEPSEEK_MODELS || 'deepseek-chat').split(','),
                defaultModel: 'deepseek-chat'
            },
            mistral: {
                name: 'Mistral',
                baseURL: process.env.MISTRAL_BASE_URL || 'https://api.mistral.ai/v1',
                apiKey: process.env.MISTRAL_API_KEY,
                // Modelo más económico de Mistral
                models: (process.env.MISTRAL_MODELS || 'mistral-small-latest').split(','),
                defaultModel: 'mistral-small-latest'
            },
            openrouter: {
                name: 'OpenRouter',
                baseURL: process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1',
                apiKey: process.env.OPENROUTER_API_KEY,
                // Modelos gratuitos dinámicos (cambian frecuentemente)
                models: (process.env.OPENROUTER_MODELS ||
                    'microsoft/wizardlm-2-8x22b,' +
                    'qwen/qwen-2.5-72b-instruct,' +
                    'meta-llama/llama-3.1-8b-instruct:free,' +
                    'microsoft/dialoGPT-large,' +
                    'mistralai/mistral-7b-instruct:free,' +
                    'google/gemma-7b-it:free'
                ).split(','),
                defaultModel: 'meta-llama/llama-3.1-8b-instruct:free'
            },
            ollama: {
                name: 'Ollama',
                baseURL: process.env.OLLAMA_BASE_URL || 'https://ollama.alexanderoviedofadul.dev',
                apiKey: null, // Ollama no requiere API key
                models: (process.env.OLLAMA_MODELS || 'llama3.2:latest,qwen2.5:latest,gemma2:latest').split(','),
                defaultModel: 'llama3.2:latest'
            }
        };

        this.webSearchProviders = {
            tavily: {
                name: 'Tavily',
                apiKey: process.env.TAVILY_API_KEY,
                baseURL: 'https://api.tavily.com'
            },
            you: {
                name: 'You.com',
                apiKey: process.env.YOU_API_KEY,
                siteUrl: process.env.YOUR_SITE_URL
            }
        };
    }

    /**
     * Obtiene la lista de todos los proveedores disponibles
     */
    getAvailableProviders() {
        const available = [];
        
        for (const [key, provider] of Object.entries(this.providers)) {
            // Ollama no requiere API key, otros proveedores sí
            if (provider.apiKey || key === 'ollama') {
                available.push({
                    id: key,
                    name: provider.name,
                    models: provider.models,
                    defaultModel: provider.defaultModel,
                    status: 'disponible',
                    requiresApiKey: provider.apiKey !== null
                });
            }
        }
        
        return available;
    }

    /**
     * Obtiene todos los modelos disponibles de todos los proveedores
     */
    getAllModels() {
        const models = [];
        
        for (const [providerId, provider] of Object.entries(this.providers)) {
            // Incluir Ollama aunque no tenga API key
            if (provider.apiKey || providerId === 'ollama') {
                provider.models.forEach(model => {
                    models.push({
                        id: `${providerId}:${model}`,
                        provider: providerId,
                        providerName: provider.name,
                        model: model,
                        isDefault: model === provider.defaultModel,
                        requiresApiKey: provider.apiKey !== null
                    });
                });
            }
        }
        
        return models;
    }

    /**
     * Envía un prompt a un proveedor específico
     */
    async sendPrompt(providerId, model, messages, options = {}) {
        const provider = this.providers[providerId];
        
        if (!provider) {
            throw new Error(`Proveedor no encontrado: ${providerId}`);
        }
        
        // Ollama no requiere API key
        if (!provider.apiKey && providerId !== 'ollama') {
            throw new Error(`API Key no configurada para ${provider.name}`);
        }

        try {
            let response;
            
            // Manejar diferentes formatos de API
            switch (providerId) {
                case 'anthropic':
                    response = await this._sendAnthropicRequest(provider, model, messages, options);
                    break;
                case 'cohere':
                    response = await this._sendCohereRequest(provider, model, messages, options);
                    break;
                default:
                    // OpenAI-compatible APIs (OpenAI, Together, Groq, DeepInfra, etc.)
                    response = await this._sendOpenAICompatibleRequest(provider, model, messages, options);
                    break;
            }
            
            return {
                success: true,
                provider: provider.name,
                model: model,
                response: response,
                timestamp: new Date().toISOString()
            };
            
        } catch (error) {
            console.error(`Error con ${provider.name}:`, error.message);
            
            return {
                success: false,
                provider: provider.name,
                model: model,
                error: error.message,
                timestamp: new Date().toISOString()
            };
        }
    }

    /**
     * Envía request a APIs compatibles con OpenAI
     */
    async _sendOpenAICompatibleRequest(provider, model, messages, options) {
        const requestData = {
            model: model,
            messages: messages,
            max_tokens: options.maxTokens || 2000,
            temperature: options.temperature || 0.7,
            stream: options.stream || false
        };

        const headers = {
            'Content-Type': 'application/json'
        };

        // Agregar Authorization solo si hay API key (Ollama no la necesita)
        if (provider.apiKey) {
            headers['Authorization'] = `Bearer ${provider.apiKey}`;
        }

        // Headers específicos para algunos proveedores
        if (provider.name === 'OpenRouter') {
            headers['HTTP-Referer'] = process.env.YOUR_SITE_URL || 'https://marduk.pro';
            headers['X-Title'] = 'SmythOS SRE';
        }

        const response = await axios.post(`${provider.baseURL}/chat/completions`, requestData, {
            headers: headers,
            timeout: 30000
        });

        return response.data.choices[0].message.content;
    }

    /**
     * Envía request a Anthropic Claude
     */
    async _sendAnthropicRequest(provider, model, messages, options) {
        // Convertir formato OpenAI a formato Anthropic
        const systemMessage = messages.find(m => m.role === 'system');
        const userMessages = messages.filter(m => m.role !== 'system');

        const requestData = {
            model: model,
            max_tokens: options.maxTokens || 2000,
            temperature: options.temperature || 0.7,
            messages: userMessages
        };

        if (systemMessage) {
            requestData.system = systemMessage.content;
        }

        const response = await axios.post(`${provider.baseURL}/messages`, requestData, {
            headers: {
                'x-api-key': provider.apiKey,
                'Content-Type': 'application/json',
                'anthropic-version': '2023-06-01'
            },
            timeout: 30000
        });

        return response.data.content[0].text;
    }

    /**
     * Búsqueda web con Tavily
     */
    async searchWeb(query, options = {}) {
        if (!this.webSearchProviders.tavily.apiKey) {
            throw new Error('Tavily API Key no configurada');
        }

        try {
            const response = await axios.post('https://api.tavily.com/search', {
                api_key: this.webSearchProviders.tavily.apiKey,
                query: query,
                search_depth: options.depth || 'basic',
                include_answer: options.includeAnswer !== false,
                include_images: options.includeImages || false,
                include_raw_content: options.includeRawContent || false,
                max_results: options.maxResults || 5
            }, {
                timeout: 15000
            });

            return {
                success: true,
                results: response.data.results,
                answer: response.data.answer,
                query: query,
                timestamp: new Date().toISOString()
            };

        } catch (error) {
            console.error('Error en búsqueda web:', error.message);
            return {
                success: false,
                error: error.message,
                query: query,
                timestamp: new Date().toISOString()
            };
        }
    }

    /**
     * Obtiene el mejor proveedor disponible para una tarea específica
     */
    getBestProvider(task = 'general') {
        const taskProviders = {
            'coding': ['deepseek', 'openai', 'anthropic', 'ollama'],
            'reasoning': ['openai', 'anthropic', 'groq', 'ollama'],
            'creative': ['anthropic', 'openai', 'mistral', 'ollama'],
            'fast': ['groq', 'deepinfra', 'together', 'ollama'],
            'general': ['openai', 'anthropic', 'groq', 'ollama'],
            'local': ['ollama']
        };

        const preferredProviders = taskProviders[task] || taskProviders.general;
        
        for (const providerId of preferredProviders) {
            const provider = this.providers[providerId];
            if (provider && provider.apiKey) {
                return {
                    id: providerId,
                    name: provider.name,
                    model: provider.defaultModel
                };
            }
        }

        // Fallback: primer proveedor disponible
        for (const [id, provider] of Object.entries(this.providers)) {
            if (provider.apiKey) {
                return {
                    id: id,
                    name: provider.name,
                    model: provider.defaultModel
                };
            }
        }

        throw new Error('No hay proveedores de IA disponibles');
    }

    /**
     * Verifica el estado de todos los proveedores
     */
    async checkProvidersHealth() {
        const results = {};
        
        for (const [id, provider] of Object.entries(this.providers)) {
            // Ollama no requiere API key
            if (!provider.apiKey && id !== 'ollama') {
                results[id] = {
                    status: 'no_configured',
                    message: 'API Key no configurada'
                };
                continue;
            }

            try {
                // Test simple con cada proveedor
                const testResult = await this.sendPrompt(id, provider.defaultModel, [
                    { role: 'user', content: 'Responde solo "OK"' }
                ], { maxTokens: 10 });

                results[id] = {
                    status: testResult.success ? 'healthy' : 'error',
                    message: testResult.success ? 'Funcionando correctamente' : testResult.error,
                    model: provider.defaultModel
                };

            } catch (error) {
                results[id] = {
                    status: 'error',
                    message: error.message,
                    model: provider.defaultModel
                };
            }
        }

        return results;
    }
}

module.exports = AIProviderManager;
