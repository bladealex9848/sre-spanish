/**
 * SmythOS SRE - Gestor de Proveedores de Búsqueda Web
 * Integra múltiples APIs de búsqueda: Tavily, Google PSE, Exa
 */

const axios = require('axios');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

class SearchProvidersManager {
    constructor() {
        this.providers = {
            tavily: {
                name: 'Tavily',
                apiKey: process.env.TAVILY_API_KEY,
                baseURL: 'https://api.tavily.com',
                enabled: !!process.env.TAVILY_API_KEY
            },
            google: {
                name: 'Google Custom Search',
                apiKey: process.env.GOOGLE_PSE_API_KEY,
                engineId: process.env.GOOGLE_PSE_ENGINE_ID,
                baseURL: 'https://www.googleapis.com/customsearch/v1',
                enabled: !!(process.env.GOOGLE_PSE_API_KEY && process.env.GOOGLE_PSE_ENGINE_ID)
            },
            exa: {
                name: 'Exa',
                apiKey: process.env.EXA_API_KEY,
                baseURL: 'https://api.exa.ai',
                enabled: !!process.env.EXA_API_KEY
            }
        };
    }

    /**
     * Obtiene la lista de proveedores de búsqueda disponibles
     */
    getAvailableProviders() {
        return Object.entries(this.providers)
            .filter(([key, provider]) => provider.enabled)
            .map(([key, provider]) => ({
                id: key,
                name: provider.name,
                status: 'disponible'
            }));
    }

    /**
     * Búsqueda con Tavily (más completa)
     */
    async searchWithTavily(query, options = {}) {
        const provider = this.providers.tavily;
        if (!provider.enabled) {
            throw new Error('Tavily no está configurado');
        }

        try {
            const response = await axios.post(`${provider.baseURL}/search`, {
                query: query,
                search_depth: options.searchDepth || 'basic',
                include_answer: options.includeAnswer !== false,
                include_images: options.includeImages || false,
                include_raw_content: options.includeRawContent || false,
                max_results: options.maxResults || 5,
                include_domains: options.includeDomains || [],
                exclude_domains: options.excludeDomains || []
            }, {
                headers: {
                    'Authorization': `Bearer ${provider.apiKey}`,
                    'Content-Type': 'application/json'
                }
            });

            return {
                success: true,
                provider: 'tavily',
                query: query,
                results: response.data.results || [],
                answer: response.data.answer || null,
                timestamp: new Date().toISOString()
            };

        } catch (error) {
            return {
                success: false,
                provider: 'tavily',
                error: error.message,
                timestamp: new Date().toISOString()
            };
        }
    }

    /**
     * Búsqueda con Google Custom Search
     */
    async searchWithGoogle(query, options = {}) {
        const provider = this.providers.google;
        if (!provider.enabled) {
            throw new Error('Google Custom Search no está configurado');
        }

        try {
            const params = {
                key: provider.apiKey,
                cx: provider.engineId,
                q: query,
                num: Math.min(options.maxResults || 10, 10), // Google limita a 10
                start: options.start || 1,
                lr: options.language || 'lang_es',
                safe: options.safeSearch || 'medium'
            };

            const response = await axios.get(provider.baseURL, { params });

            const results = (response.data.items || []).map(item => ({
                title: item.title,
                url: item.link,
                content: item.snippet,
                displayLink: item.displayLink,
                formattedUrl: item.formattedUrl
            }));

            return {
                success: true,
                provider: 'google',
                query: query,
                results: results,
                totalResults: response.data.searchInformation?.totalResults || 0,
                searchTime: response.data.searchInformation?.searchTime || 0,
                timestamp: new Date().toISOString()
            };

        } catch (error) {
            return {
                success: false,
                provider: 'google',
                error: error.message,
                timestamp: new Date().toISOString()
            };
        }
    }

    /**
     * Búsqueda con Exa
     */
    async searchWithExa(query, options = {}) {
        const provider = this.providers.exa;
        if (!provider.enabled) {
            throw new Error('Exa no está configurado');
        }

        try {
            const response = await axios.post(`${provider.baseURL}/search`, {
                query: query,
                numResults: options.maxResults || 10,
                includeDomains: options.includeDomains || [],
                excludeDomains: options.excludeDomains || [],
                startCrawlDate: options.startDate || null,
                endCrawlDate: options.endDate || null,
                useAutoprompt: options.useAutoprompt !== false,
                type: options.type || 'neural' // neural, keyword
            }, {
                headers: {
                    'X-API-Key': provider.apiKey,
                    'Content-Type': 'application/json'
                }
            });

            const results = (response.data.results || []).map(result => ({
                title: result.title,
                url: result.url,
                content: result.text || result.summary || '',
                publishedDate: result.publishedDate,
                author: result.author,
                score: result.score
            }));

            return {
                success: true,
                provider: 'exa',
                query: query,
                results: results,
                timestamp: new Date().toISOString()
            };

        } catch (error) {
            return {
                success: false,
                provider: 'exa',
                error: error.message,
                timestamp: new Date().toISOString()
            };
        }
    }

    /**
     * Búsqueda inteligente que usa múltiples proveedores
     */
    async smartSearch(query, options = {}) {
        const preferredProvider = options.provider || 'tavily';
        const fallbackProviders = ['google', 'exa'].filter(p => p !== preferredProvider);

        // Intentar con el proveedor preferido
        try {
            let result;
            switch (preferredProvider) {
                case 'tavily':
                    result = await this.searchWithTavily(query, options);
                    break;
                case 'google':
                    result = await this.searchWithGoogle(query, options);
                    break;
                case 'exa':
                    result = await this.searchWithExa(query, options);
                    break;
                default:
                    throw new Error(`Proveedor desconocido: ${preferredProvider}`);
            }

            if (result.success && result.results.length > 0) {
                return result;
            }
        } catch (error) {
            console.warn(`Error con proveedor ${preferredProvider}:`, error.message);
        }

        // Intentar con proveedores de respaldo
        for (const fallbackProvider of fallbackProviders) {
            if (!this.providers[fallbackProvider].enabled) continue;

            try {
                let result;
                switch (fallbackProvider) {
                    case 'tavily':
                        result = await this.searchWithTavily(query, options);
                        break;
                    case 'google':
                        result = await this.searchWithGoogle(query, options);
                        break;
                    case 'exa':
                        result = await this.searchWithExa(query, options);
                        break;
                }

                if (result.success && result.results.length > 0) {
                    return result;
                }
            } catch (error) {
                console.warn(`Error con proveedor de respaldo ${fallbackProvider}:`, error.message);
            }
        }

        // Si todos fallan
        return {
            success: false,
            error: 'Todos los proveedores de búsqueda fallaron',
            query: query,
            timestamp: new Date().toISOString()
        };
    }

    /**
     * Búsqueda combinada que agrega resultados de múltiples proveedores
     */
    async combinedSearch(query, options = {}) {
        const enabledProviders = Object.entries(this.providers)
            .filter(([key, provider]) => provider.enabled)
            .map(([key]) => key);

        const maxResultsPerProvider = Math.ceil((options.maxResults || 10) / enabledProviders.length);

        const searchPromises = enabledProviders.map(async (providerId) => {
            try {
                switch (providerId) {
                    case 'tavily':
                        return await this.searchWithTavily(query, { ...options, maxResults: maxResultsPerProvider });
                    case 'google':
                        return await this.searchWithGoogle(query, { ...options, maxResults: maxResultsPerProvider });
                    case 'exa':
                        return await this.searchWithExa(query, { ...options, maxResults: maxResultsPerProvider });
                }
            } catch (error) {
                return {
                    success: false,
                    provider: providerId,
                    error: error.message
                };
            }
        });

        const results = await Promise.allSettled(searchPromises);
        
        const combinedResults = [];
        const errors = [];
        let answer = null;

        results.forEach((result) => {
            if (result.status === 'fulfilled' && result.value.success) {
                const searchResult = result.value;
                combinedResults.push(...searchResult.results);
                
                // Usar la respuesta de Tavily si está disponible
                if (searchResult.provider === 'tavily' && searchResult.answer) {
                    answer = searchResult.answer;
                }
            } else if (result.status === 'fulfilled') {
                errors.push(result.value.error);
            } else {
                errors.push(result.reason.message);
            }
        });

        // Eliminar duplicados por URL
        const uniqueResults = combinedResults.filter((result, index, self) => 
            index === self.findIndex(r => r.url === result.url)
        );

        // Ordenar por relevancia si hay scores
        uniqueResults.sort((a, b) => (b.score || 0) - (a.score || 0));

        return {
            success: uniqueResults.length > 0,
            provider: 'combined',
            query: query,
            results: uniqueResults.slice(0, options.maxResults || 10),
            answer: answer,
            providersUsed: enabledProviders,
            errors: errors.length > 0 ? errors : null,
            timestamp: new Date().toISOString()
        };
    }

    /**
     * Prueba la conectividad de todos los proveedores
     */
    async testProviders() {
        const results = {};

        for (const [providerId, provider] of Object.entries(this.providers)) {
            if (!provider.enabled) {
                results[providerId] = {
                    status: 'disabled',
                    message: 'Proveedor no configurado'
                };
                continue;
            }

            try {
                let testResult;
                switch (providerId) {
                    case 'tavily':
                        testResult = await this.searchWithTavily('test query', { maxResults: 1 });
                        break;
                    case 'google':
                        testResult = await this.searchWithGoogle('test query', { maxResults: 1 });
                        break;
                    case 'exa':
                        testResult = await this.searchWithExa('test query', { maxResults: 1 });
                        break;
                }

                results[providerId] = {
                    status: testResult.success ? 'healthy' : 'error',
                    message: testResult.success ? 'Funcionando correctamente' : testResult.error
                };

            } catch (error) {
                results[providerId] = {
                    status: 'error',
                    message: error.message
                };
            }
        }

        return results;
    }
}

module.exports = SearchProvidersManager;
