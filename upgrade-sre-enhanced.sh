#!/bin/bash

# Script para actualizar SRE-Spanish con soporte para múltiples proveedores de IA
# Integra todas las APIs configuradas

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Función para logging con colores
log_info() { echo -e "${BLUE}ℹ️  $1${NC}"; }
log_success() { echo -e "${GREEN}✅ $1${NC}"; }
log_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
log_error() { echo -e "${RED}❌ $1${NC}"; }
log_header() { echo -e "${PURPLE}🔍 $1${NC}"; }

echo -e "${CYAN}"
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║              ACTUALIZACIÓN SRE-SPANISH ENHANCED             ║"
echo "║            Integración de Múltiples Proveedores IA          ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# 1. Verificar estado actual
log_header "1. VERIFICANDO ESTADO ACTUAL"
echo "=" * 40

if [ -f "/root/sre-api.pid" ]; then
    PID=$(cat /root/sre-api.pid)
    if ps -p $PID > /dev/null 2>&1; then
        log_info "Servicio actual ejecutándose (PID: $PID)"
        log_info "Deteniendo servicio actual..."
        /root/manage-sre-api.sh stop
        sleep 3
    else
        log_warning "PID obsoleto encontrado, limpiando..."
        rm -f /root/sre-api.pid
    fi
else
    log_info "No hay servicio ejecutándose actualmente"
fi

# 2. Crear backup del servidor actual
log_header "2. CREANDO BACKUP"
echo "=" * 25

BACKUP_DIR="/root/backups/sre-spanish"
mkdir -p $BACKUP_DIR

if [ -f "/root/sre-espanol/api-example/server.js" ]; then
    cp /root/sre-espanol/api-example/server.js $BACKUP_DIR/server-original-$(date +%Y%m%d_%H%M%S).js
    log_success "Backup del servidor original creado"
else
    log_warning "Servidor original no encontrado"
fi

# 3. Verificar dependencias
log_header "3. VERIFICANDO DEPENDENCIAS"
echo "=" * 35

cd /root/sre-espanol/api-example

# Verificar si dotenv y axios están instalados
if npm list dotenv > /dev/null 2>&1; then
    log_success "dotenv ya está instalado"
else
    log_info "Instalando dotenv..."
    npm install dotenv
fi

if npm list axios > /dev/null 2>&1; then
    log_success "axios ya está instalado"
else
    log_info "Instalando axios..."
    npm install axios
fi

# 4. Verificar archivo .env
log_header "4. CONFIGURANDO VARIABLES DE ENTORNO"
echo "=" * 45

if [ -f "/root/sre-espanol/.env" ]; then
    log_success "Archivo .env encontrado"
    
    # Verificar algunas variables clave
    if grep -q "OPENAI_API_KEY" /root/sre-espanol/.env; then
        log_success "OpenAI API Key configurada"
    else
        log_warning "OpenAI API Key no encontrada en .env"
    fi
    
    if grep -q "ANTHROPIC_API_KEY" /root/sre-espanol/.env; then
        log_success "Anthropic API Key configurada"
    else
        log_warning "Anthropic API Key no encontrada en .env"
    fi
    
    # Contar APIs configuradas
    API_COUNT=$(grep -c "_API_KEY=" /root/sre-espanol/.env)
    log_info "APIs configuradas: $API_COUNT"
    
else
    log_error "Archivo .env no encontrado"
    log_error "Por favor, ejecuta primero la configuración de credenciales"
    exit 1
fi

# 5. Verificar gestor de proveedores
log_header "5. VERIFICANDO GESTOR DE PROVEEDORES"
echo "=" * 45

if [ -f "/root/sre-espanol/api-example/providers/ai-providers.js" ]; then
    log_success "Gestor de proveedores encontrado"
else
    log_error "Gestor de proveedores no encontrado"
    exit 1
fi

# 6. Actualizar script de gestión
log_header "6. ACTUALIZANDO SCRIPT DE GESTIÓN"
echo "=" * 42

cat > /root/manage-sre-enhanced.sh << 'EOF'
#!/bin/bash

case "$1" in
    start)
        echo "🚀 Iniciando SmythOS SRE Enhanced..."
        cd /root/sre-espanol/api-example
        nohup node server-enhanced.js > /root/logs/sre-enhanced.log 2>&1 &
        echo $! > /root/sre-enhanced.pid
        echo "✅ SRE Enhanced iniciado"
        ;;
    stop)
        echo "🛑 Deteniendo SmythOS SRE Enhanced..."
        if [ -f /root/sre-enhanced.pid ]; then
            kill $(cat /root/sre-enhanced.pid) 2>/dev/null || true
            rm -f /root/sre-enhanced.pid
        fi
        pkill -f "node server-enhanced.js" || true
        echo "✅ SRE Enhanced detenido"
        ;;
    restart)
        $0 stop
        sleep 3
        $0 start
        ;;
    status)
        if curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/api/estado | grep -q "200"; then
            echo "✅ SmythOS SRE Enhanced está funcionando"
            curl -s http://localhost:8000/api/estado | jq .
        else
            echo "❌ SmythOS SRE Enhanced no responde"
        fi
        ;;
    providers)
        echo "🤖 Proveedores de IA disponibles:"
        curl -s http://localhost:8000/api/proveedores | jq '.datos[] | {id: .id, name: .name, models: .models | length}'
        ;;
    models)
        echo "🧠 Modelos disponibles:"
        curl -s http://localhost:8000/api/modelos | jq '.datos[] | {provider: .providerName, model: .model}'
        ;;
    test)
        echo "🧪 Probando conectividad de proveedores..."
        curl -s -X POST http://localhost:8000/api/proveedores/test | jq .
        ;;
    logs)
        tail -f /root/logs/sre-enhanced.log
        ;;
    *)
        echo "Uso: $0 {start|stop|restart|status|providers|models|test|logs}"
        exit 1
        ;;
esac
EOF

chmod +x /root/manage-sre-enhanced.sh
log_success "Script de gestión mejorado creado"

# 7. Crear directorio de logs si no existe
mkdir -p /root/logs

# 8. Iniciar servidor mejorado
log_header "7. INICIANDO SERVIDOR MEJORADO"
echo "=" * 40

log_info "Iniciando SmythOS SRE Enhanced..."
/root/manage-sre-enhanced.sh start

sleep 5

# 9. Verificar que el servidor está funcionando
log_header "8. VERIFICANDO FUNCIONAMIENTO"
echo "=" * 38

if curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/api/estado | grep -q "200"; then
    log_success "✅ Servidor Enhanced funcionando correctamente"
    
    # Mostrar información del sistema
    echo ""
    log_info "📊 Información del sistema:"
    curl -s http://localhost:8000/api/estado | jq -r '
        .datos | 
        "   - Versión: " + .version,
        "   - Proveedores IA: " + (.proveedoresIA | tostring),
        "   - Agentes activos: " + (.agentesActivos | tostring),
        "   - Uptime: " + (.uptime | tostring) + " segundos"
    '
    
    echo ""
    log_info "🤖 Proveedores disponibles:"
    curl -s http://localhost:8000/api/proveedores | jq -r '.datos[] | "   - " + .name + " (" + (.models | length | tostring) + " modelos)"'
    
else
    log_error "❌ El servidor no está respondiendo"
    log_info "Verificando logs..."
    tail -10 /root/logs/sre-enhanced.log
    exit 1
fi

# 10. Crear script de prueba
log_header "9. CREANDO SCRIPT DE PRUEBA"
echo "=" * 35

cat > /root/test-sre-enhanced.sh << 'EOF'
#!/bin/bash

echo "🧪 PRUEBAS DE SRE-SPANISH ENHANCED"
echo "=================================="

echo ""
echo "1. Estado del sistema:"
curl -s http://localhost:8000/api/estado | jq '.datos | {version, estado, proveedoresIA, agentesActivos}'

echo ""
echo "2. Proveedores disponibles:"
curl -s http://localhost:8000/api/proveedores | jq '.datos[] | {id, name, models: (.models | length)}'

echo ""
echo "3. Agentes configurados:"
curl -s http://localhost:8000/api/agentes | jq '.datos[] | {id, nombre, proveedor, modelo}'

echo ""
echo "4. Prueba de prompt (agente por defecto):"
AGENTE_ID=$(curl -s http://localhost:8000/api/agentes | jq -r '.datos[0].id')
curl -s -X POST http://localhost:8000/api/agentes/$AGENTE_ID/prompt \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Hola, ¿puedes ayudarme con una consulta legal básica?"}' | \
  jq '.datos.respuesta'

echo ""
echo "5. Prueba de búsqueda web:"
curl -s -X POST http://localhost:8000/api/busqueda \
  -H "Content-Type: application/json" \
  -d '{"query": "nuevas leyes Colombia 2025", "maxResults": 3}' | \
  jq '.datos.resultados[0] | {title, url}'

echo ""
echo "✅ Pruebas completadas"
EOF

chmod +x /root/test-sre-enhanced.sh
log_success "Script de prueba creado: /root/test-sre-enhanced.sh"

# 11. Resumen final
echo ""
log_header "ACTUALIZACIÓN COMPLETADA"
echo "=" * 30

log_success "🎉 SmythOS SRE Enhanced está funcionando"
echo ""
echo "📋 Comandos disponibles:"
echo "   - Estado: /root/manage-sre-enhanced.sh status"
echo "   - Proveedores: /root/manage-sre-enhanced.sh providers"
echo "   - Modelos: /root/manage-sre-enhanced.sh models"
echo "   - Prueba conectividad: /root/manage-sre-enhanced.sh test"
echo "   - Logs: /root/manage-sre-enhanced.sh logs"
echo "   - Prueba completa: /root/test-sre-enhanced.sh"

echo ""
echo "🌐 Endpoints nuevos:"
echo "   - GET /api/proveedores - Lista proveedores de IA"
echo "   - GET /api/modelos - Lista todos los modelos"
echo "   - POST /api/proveedores/test - Prueba conectividad"
echo "   - POST /api/busqueda - Búsqueda web con Tavily"
echo "   - POST /api/agentes/:id/prompt - Soporte para búsqueda web"

echo ""
echo "🔑 APIs integradas:"
API_COUNT=$(grep -c "_API_KEY=" /root/sre-espanol/.env)
echo "   - Total de APIs configuradas: $API_COUNT"
echo "   - OpenAI, Anthropic, Together, Groq, DeepInfra, DeepSeek, Mistral, Cohere, OpenRouter"
echo "   - Búsqueda web: Tavily, You.com"

echo ""
log_success "¡Tu SmythOS SRE ahora soporta múltiples proveedores de IA!"

echo ""
echo -e "${CYAN}╔══════════════════════════════════════════════════════════════╗"
echo "║                   ACTUALIZACIÓN EXITOSA                     ║"
echo "╚══════════════════════════════════════════════════════════════╝${NC}"
