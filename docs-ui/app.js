// SmythOS SRE Enhanced - Documentación Interactiva
// JavaScript para funcionalidad completa

const API_BASE = 'https://sre-api.alexanderoviedofadul.dev';

// Estado global de la aplicación
let appState = {
    apiStatus: 'checking',
    systemData: null,
    assistants: [],
    endpoints: []
};

// Inicialización de la aplicación
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

async function initializeApp() {
    console.log('🚀 Inicializando SmythOS SRE Enhanced Docs');
    
    // Verificar estado de la API
    await checkAPIStatus();
    
    // Cargar datos iniciales
    await loadSystemData();
    await loadAssistants();
    await loadEndpoints();
    
    // Configurar eventos
    setupEventListeners();
    
    console.log('✅ Aplicación inicializada correctamente');
}

// Verificar estado de la API
async function checkAPIStatus() {
    try {
        const response = await fetch(`${API_BASE}/api/estado`);
        const data = await response.json();
        
        if (data.exito) {
            appState.apiStatus = 'online';
            appState.systemData = data.datos;
            updateAPIStatus(true, 'API Operativa');
            updateSystemInfo(data.datos);
        } else {
            throw new Error('API response not successful');
        }
    } catch (error) {
        console.error('❌ Error verificando API:', error);
        appState.apiStatus = 'offline';
        updateAPIStatus(false, 'API No Disponible');
    }
}

// Actualizar indicadores de estado de la API
function updateAPIStatus(isOnline, statusText) {
    const statusDots = document.querySelectorAll('.status-dot');
    const statusTexts = document.querySelectorAll('#apiStatusText, #systemStatus');
    
    statusDots.forEach(dot => {
        dot.className = `status-dot ${isOnline ? 'online' : 'offline'}`;
    });
    
    statusTexts.forEach(text => {
        text.textContent = statusText;
        text.className = isOnline ? 'font-medium text-green-600' : 'font-medium text-red-600';
    });
}

// Actualizar información del sistema
function updateSystemInfo(data) {
    if (data.version) {
        const versionEl = document.getElementById('systemVersion');
        if (versionEl) versionEl.textContent = data.version;
    }
    
    if (data.uptime) {
        const uptimeEl = document.getElementById('systemUptime');
        if (uptimeEl) uptimeEl.textContent = formatUptime(data.uptime);
    }
    
    if (data.asistentesEspecializados) {
        const assistantsEl = document.getElementById('assistantsCount');
        if (assistantsEl) assistantsEl.textContent = data.asistentesEspecializados;
    }
    
    if (data.proveedoresIA) {
        const providersEl = document.getElementById('providersCount');
        if (providersEl) providersEl.textContent = data.proveedoresIA;
    }
}

// Formatear tiempo de actividad
function formatUptime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
}

// Cargar datos del sistema
async function loadSystemData() {
    // Ya cargado en checkAPIStatus
}

// Cargar lista de asistentes
async function loadAssistants() {
    try {
        const response = await fetch(`${API_BASE}/api/asistentes`);
        const data = await response.json();
        
        if (data.exito) {
            appState.assistants = data.datos;
            renderAssistants(data.datos);
        }
    } catch (error) {
        console.error('❌ Error cargando asistentes:', error);
    }
}

// Renderizar lista de asistentes
function renderAssistants(assistants) {
    const container = document.getElementById('assistantsList');
    if (!container) return;
    
    container.innerHTML = assistants.map(assistant => `
        <div class="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
            <div class="flex items-start justify-between mb-2">
                <h3 class="font-semibold text-gray-800 text-sm">${assistant.titulo}</h3>
                <span class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">${assistant.categoria}</span>
            </div>
            <p class="text-gray-600 text-xs mb-3">${assistant.descripcion}</p>
            <div class="flex items-center justify-between">
                <span class="text-xs text-gray-500">ID: ${assistant.id}</span>
                <button onclick="testAssistant('${assistant.id}')" 
                        class="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors">
                    Probar
                </button>
            </div>
        </div>
    `).join('');
}

// Cargar endpoints disponibles
async function loadEndpoints() {
    // Endpoints estáticos conocidos
    const endpoints = [
        { method: 'GET', path: '/api/estado', description: 'Estado completo del sistema', category: 'Sistema' },
        { method: 'GET', path: '/api/proveedores', description: 'Lista proveedores de IA', category: 'Sistema' },
        { method: 'GET', path: '/api/modelos', description: 'Todos los modelos disponibles', category: 'Sistema' },
        { method: 'GET', path: '/api/asistentes', description: 'Lista 37 asistentes especializados', category: 'Asistentes' },
        { method: 'GET', path: '/api/asistentes/categorias', description: 'Categorías de asistentes', category: 'Asistentes' },
        { method: 'POST', path: '/api/asistentes/{id}/consulta', description: 'Consultar asistente especializado', category: 'Asistentes' },
        { method: 'POST', path: '/api/asistentes/recomendacion', description: 'Obtener recomendación automática', category: 'Asistentes' },
        { method: 'POST', path: '/api/busqueda', description: 'Búsqueda inteligente', category: 'Búsqueda' },
        { method: 'GET', path: '/api/busqueda/proveedores', description: 'Lista proveedores de búsqueda', category: 'Búsqueda' },
        { method: 'POST', path: '/api/ocr', description: 'Extrae texto de imágenes', category: 'OCR' },
        { method: 'GET', path: '/api/ocr/capacidades', description: 'Información capacidades OCR', category: 'OCR' }
    ];
    
    appState.endpoints = endpoints;
    renderEndpoints(endpoints);
}

// Renderizar endpoints
function renderEndpoints(endpoints) {
    const container = document.getElementById('endpointsList');
    if (!container) return;
    
    const groupedEndpoints = endpoints.reduce((groups, endpoint) => {
        const category = endpoint.category;
        if (!groups[category]) groups[category] = [];
        groups[category].push(endpoint);
        return groups;
    }, {});
    
    container.innerHTML = Object.entries(groupedEndpoints).map(([category, endpoints]) => `
        <div class="mb-6">
            <h3 class="text-lg font-semibold text-gray-800 mb-3">${category}</h3>
            <div class="space-y-2">
                ${endpoints.map(endpoint => `
                    <div class="endpoint-card ${endpoint.method.toLowerCase()} bg-white border rounded-lg p-4 hover:shadow-md transition-all">
                        <div class="flex items-center justify-between">
                            <div class="flex items-center space-x-3">
                                <span class="method-badge ${endpoint.method.toLowerCase()} text-white text-xs font-bold px-2 py-1 rounded">
                                    ${endpoint.method}
                                </span>
                                <code class="text-sm font-mono text-gray-700">${endpoint.path}</code>
                            </div>
                            <button onclick="testEndpoint('${endpoint.method}', '${endpoint.path}')" 
                                    class="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded transition-colors">
                                Probar
                            </button>
                        </div>
                        <p class="text-gray-600 text-sm mt-2">${endpoint.description}</p>
                    </div>
                `).join('')}
            </div>
        </div>
    `).join('');
}

// Gestión de pestañas
function showTab(tabName) {
    // Ocultar todas las pestañas
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Desactivar todos los botones
    document.querySelectorAll('.tab-button').forEach(button => {
        button.classList.remove('active');
    });
    
    // Mostrar pestaña seleccionada
    const selectedTab = document.getElementById(tabName);
    if (selectedTab) {
        selectedTab.classList.add('active');
    }
    
    // Activar botón correspondiente
    const selectedButton = document.querySelector(`[onclick="showTab('${tabName}')"]`);
    if (selectedButton) {
        selectedButton.classList.add('active');
    }
}

// Probar API general
async function testAPI() {
    try {
        const response = await fetch(`${API_BASE}/api/estado`);
        const data = await response.json();
        
        if (data.exito) {
            showNotification('✅ API funcionando correctamente', 'success');
        } else {
            showNotification('⚠️ API respondió con errores', 'warning');
        }
    } catch (error) {
        showNotification('❌ Error conectando con la API', 'error');
    }
}

// Probar endpoint específico
async function testEndpoint(method, path) {
    const fullUrl = `${API_BASE}${path}`;
    
    try {
        let response;
        if (method === 'GET') {
            response = await fetch(fullUrl);
        } else {
            // Para métodos POST, usar datos de ejemplo
            const sampleData = getSampleData(path);
            response = await fetch(fullUrl, {
                method: method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(sampleData)
            });
        }
        
        const data = await response.json();
        showEndpointResult(method, path, data);
        
    } catch (error) {
        showNotification(`❌ Error probando ${method} ${path}: ${error.message}`, 'error');
    }
}

// Obtener datos de ejemplo para endpoints POST
function getSampleData(path) {
    const sampleData = {
        '/api/asistentes/recomendacion': { consulta: 'Necesito ayuda con una tutela' },
        '/api/busqueda': { query: 'leyes Colombia 2025', maxResults: 3 },
        '/api/asistentes/{id}/consulta': { mensaje: '¿Cuáles son los requisitos básicos?' }
    };
    
    return sampleData[path] || {};
}

// Mostrar resultado de endpoint
function showEndpointResult(method, path, data) {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    modal.innerHTML = `
        <div class="bg-white rounded-lg p-6 max-w-2xl max-h-96 overflow-auto">
            <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-semibold">${method} ${path}</h3>
                <button onclick="this.closest('.fixed').remove()" class="text-gray-500 hover:text-gray-700">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <pre class="bg-gray-100 p-4 rounded text-sm overflow-auto"><code>${JSON.stringify(data, null, 2)}</code></pre>
        </div>
    `;
    
    document.body.appendChild(modal);
}

// Probar asistente específico
async function testAssistant(assistantId) {
    try {
        const response = await fetch(`${API_BASE}/api/asistentes/recomendacion`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ consulta: `Consulta de prueba para ${assistantId}` })
        });
        
        const data = await response.json();
        showEndpointResult('POST', `/api/asistentes/recomendacion`, data);
        
    } catch (error) {
        showNotification(`❌ Error probando asistente ${assistantId}: ${error.message}`, 'error');
    }
}

// Realizar búsqueda web
async function performSearch() {
    const query = document.getElementById('searchQuery').value.trim();
    if (!query) {
        showNotification('⚠️ Por favor ingresa una consulta de búsqueda', 'warning');
        return;
    }
    
    const resultsContainer = document.getElementById('searchResults');
    resultsContainer.innerHTML = '<div class="text-center py-8"><div class="loading-spinner mx-auto"></div><p class="mt-2 text-gray-600">Buscando...</p></div>';
    
    try {
        const response = await fetch(`${API_BASE}/api/busqueda`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ query, maxResults: 5 })
        });
        
        const data = await response.json();
        
        if (data.exito && data.datos.resultados) {
            renderSearchResults(data.datos);
        } else {
            resultsContainer.innerHTML = '<p class="text-gray-600 text-center py-8">No se encontraron resultados</p>';
        }
        
    } catch (error) {
        resultsContainer.innerHTML = '<p class="text-red-600 text-center py-8">Error realizando búsqueda</p>';
        console.error('Error en búsqueda:', error);
    }
}

// Renderizar resultados de búsqueda
function renderSearchResults(data) {
    const container = document.getElementById('searchResults');
    
    let html = '';
    
    if (data.respuesta) {
        html += `
            <div class="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
                <h3 class="font-semibold text-blue-800 mb-2">Respuesta Generada:</h3>
                <p class="text-blue-700">${data.respuesta}</p>
            </div>
        `;
    }
    
    if (data.resultados && data.resultados.length > 0) {
        html += `
            <h3 class="font-semibold text-gray-800 mb-4">Resultados de búsqueda (${data.resultados.length}):</h3>
            <div class="space-y-4">
                ${data.resultados.map(result => `
                    <div class="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <h4 class="font-semibold text-blue-600 hover:text-blue-800">
                            <a href="${result.url}" target="_blank">${result.title}</a>
                        </h4>
                        <p class="text-gray-600 text-sm mt-1">${result.content}</p>
                        <p class="text-gray-400 text-xs mt-2">${result.url}</p>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    container.innerHTML = html || '<p class="text-gray-600 text-center py-8">No se encontraron resultados</p>';
}

// Manejar selección de archivo para OCR
function handleFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const resultsContainer = document.getElementById('ocrResults');
    resultsContainer.innerHTML = '<div class="text-center py-8"><div class="loading-spinner mx-auto"></div><p class="mt-2 text-gray-600">Procesando imagen...</p></div>';
    
    const formData = new FormData();
    formData.append('image', file);
    formData.append('method', 'tesseract');
    
    fetch(`${API_BASE}/api/ocr`, {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.exito) {
            renderOCRResults(data.datos);
        } else {
            resultsContainer.innerHTML = '<p class="text-red-600 text-center py-8">Error procesando imagen</p>';
        }
    })
    .catch(error => {
        resultsContainer.innerHTML = '<p class="text-red-600 text-center py-8">Error procesando imagen</p>';
        console.error('Error OCR:', error);
    });
}

// Renderizar resultados de OCR
function renderOCRResults(data) {
    const container = document.getElementById('ocrResults');
    
    container.innerHTML = `
        <div class="bg-green-50 border-l-4 border-green-400 p-4">
            <h3 class="font-semibold text-green-800 mb-2">Texto Extraído:</h3>
            <div class="bg-white p-4 rounded border">
                <pre class="whitespace-pre-wrap text-sm">${data.texto}</pre>
            </div>
            <div class="mt-4 text-sm text-green-700">
                <p><strong>Método:</strong> ${data.metodo}</p>
                <p><strong>Proveedor:</strong> ${data.proveedor}</p>
                ${data.confianza ? `<p><strong>Confianza:</strong> ${data.confianza}%</p>` : ''}
            </div>
        </div>
    `;
}

// Mostrar notificaciones
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${getNotificationClass(type)}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

// Obtener clase CSS para notificación
function getNotificationClass(type) {
    const classes = {
        success: 'bg-green-500 text-white',
        error: 'bg-red-500 text-white',
        warning: 'bg-yellow-500 text-white',
        info: 'bg-blue-500 text-white'
    };
    return classes[type] || classes.info;
}

// Configurar event listeners
function setupEventListeners() {
    // Enter key en búsqueda
    const searchInput = document.getElementById('searchQuery');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }
}

// Exportar funciones globales
window.showTab = showTab;
window.testAPI = testAPI;
window.testEndpoint = testEndpoint;
window.testAssistant = testAssistant;
window.performSearch = performSearch;
window.handleFileSelect = handleFileSelect;
