#!/bin/bash

# Script de despliegue para SmythOS SRE API en Español
# Autor: Alexander Oviedo Fadul

set -e

LOG_FILE="/root/logs/sre-deploy.log"
PROJECT_DIR="/root/sre-espanol"
PORT=8000

# Crear directorio de logs
mkdir -p /root/logs

# Función para logging
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

log "🚀 Iniciando despliegue de SmythOS SRE API en Español"

# Verificar que estamos en el directorio correcto
if [ ! -d "$PROJECT_DIR" ]; then
    log "❌ Error: Directorio del proyecto no encontrado: $PROJECT_DIR"
    exit 1
fi

cd "$PROJECT_DIR"

# Verificar que Node.js esté instalado
if ! command -v node &> /dev/null; then
    log "❌ Error: Node.js no está instalado"
    exit 1
fi

# Verificar que Docker esté instalado
if ! command -v docker &> /dev/null; then
    log "❌ Error: Docker no está instalado"
    exit 1
fi

log "✅ Verificaciones iniciales completadas"

# Instalar dependencias
log "📦 Instalando dependencias..."
cd api-example
npm install
log "✅ Dependencias instaladas"

# Verificar que el puerto esté libre
if netstat -tuln | grep -q ":$PORT "; then
    log "⚠️ Puerto $PORT está en uso, terminando procesos..."
    lsof -ti:$PORT | xargs kill -9 2>/dev/null || true
    sleep 2
fi

# Crear archivo .env si no existe
if [ ! -f ".env" ]; then
    log "📝 Creando archivo .env..."
    cat > .env << EOF
NODE_ENV=production
PORT=$PORT
OPENAI_API_KEY=tu_openai_api_key_aqui
ANTHROPIC_API_KEY=tu_anthropic_api_key_aqui
JWT_SECRET=tu_jwt_secret_super_seguro_$(date +%s)
DATABASE_URL=postgresql://sre_user:sre_password@localhost:5432/sre_db
REDIS_URL=redis://localhost:6379
EOF
    log "✅ Archivo .env creado"
fi

# Opción 1: Despliegue con Docker (recomendado)
if [ "$1" = "docker" ]; then
    log "🐳 Desplegando con Docker..."
    cd ..
    
    # Construir y ejecutar con docker-compose
    docker-compose down 2>/dev/null || true
    docker-compose build
    docker-compose up -d
    
    log "✅ Servicios Docker iniciados"
    
    # Verificar que los servicios estén corriendo
    sleep 10
    if curl -s -o /dev/null -w "%{http_code}" http://localhost:$PORT/api/estado | grep -q "200"; then
        log "✅ API respondiendo correctamente"
    else
        log "⚠️ API no responde, verificando logs..."
        docker-compose logs sre-api
    fi

# Opción 2: Despliegue directo con Node.js
else
    log "📦 Desplegando directamente con Node.js..."
    
    # Iniciar la API en background
    nohup node server.js > "$LOG_FILE" 2>&1 &
    API_PID=$!
    
    # Guardar PID
    echo "$API_PID" > /root/sre-api.pid
    
    log "✅ API iniciada con PID: $API_PID"
    
    # Esperar a que la API se inicie
    sleep 5
    
    # Verificar que la API esté funcionando
    if curl -s -o /dev/null -w "%{http_code}" http://localhost:$PORT/api/estado | grep -q "200"; then
        log "✅ API respondiendo correctamente"
    else
        log "❌ Error: API no responde"
        exit 1
    fi
fi

# Configurar proxy en Caddy
log "🔗 Configurando proxy en Caddy..."

# Crear configuración de Caddy para SRE API
CADDY_CONFIG="/etc/caddy/Caddyfile"
if [ -f "$CADDY_CONFIG" ]; then
    # Backup del Caddyfile actual
    cp "$CADDY_CONFIG" "$CADDY_CONFIG.backup-$(date +%Y%m%d_%H%M%S)"
    
    # Agregar configuración para SRE API
    if ! grep -q "sre-api.alexanderoviedofadul.dev" "$CADDY_CONFIG"; then
        cat >> "$CADDY_CONFIG" << EOF

# SmythOS SRE API en Español
sre-api.alexanderoviedofadul.dev {
    reverse_proxy localhost:$PORT {
        flush_interval -1
        header_up X-Real-IP {remote}
        header_up X-Forwarded-For {remote}
        header_up X-Forwarded-Proto {scheme}
        header_up Host {host}
    }
    
    # Headers de seguridad
    header {
        X-Frame-Options "DENY"
        X-Content-Type-Options "nosniff"
        X-XSS-Protection "1; mode=block"
        Strict-Transport-Security "max-age=31536000; includeSubDomains"
        Referrer-Policy "strict-origin-when-cross-origin"
    }
    
    # Logging específico
    log {
        output file /var/log/caddy/sre-api.log
        format json
        level INFO
    }
}
EOF
        
        # Recargar Caddy
        systemctl reload caddy
        log "✅ Configuración de Caddy actualizada"
    else
        log "ℹ️ Configuración de Caddy ya existe"
    fi
else
    log "⚠️ Archivo Caddyfile no encontrado"
fi

# Crear script de gestión
log "📝 Creando scripts de gestión..."

cat > /root/manage-sre-api.sh << 'EOF'
#!/bin/bash

case "$1" in
    start)
        echo "🚀 Iniciando SmythOS SRE API..."
        cd /root/sre-espanol/api-example
        nohup node server.js > /root/logs/sre-deploy.log 2>&1 &
        echo $! > /root/sre-api.pid
        echo "✅ API iniciada"
        ;;
    stop)
        echo "🛑 Deteniendo SmythOS SRE API..."
        if [ -f /root/sre-api.pid ]; then
            kill $(cat /root/sre-api.pid) 2>/dev/null || true
            rm -f /root/sre-api.pid
        fi
        pkill -f "node server.js" || true
        echo "✅ API detenida"
        ;;
    restart)
        $0 stop
        sleep 2
        $0 start
        ;;
    status)
        if curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/api/estado | grep -q "200"; then
            echo "✅ SmythOS SRE API está funcionando"
            curl -s http://localhost:8000/api/estado | jq .
        else
            echo "❌ SmythOS SRE API no responde"
        fi
        ;;
    logs)
        tail -f /root/logs/sre-deploy.log
        ;;
    *)
        echo "Uso: $0 {start|stop|restart|status|logs}"
        exit 1
        ;;
esac
EOF

chmod +x /root/manage-sre-api.sh

log "🎉 Despliegue completado exitosamente!"

echo ""
echo "╔══════════════════════════════════════════════════════════════════════════════╗"
echo "║                    🎉 SMYTHOS SRE API DESPLEGADA                            ║"
echo "╠══════════════════════════════════════════════════════════════════════════════╣"
echo "║                                                                              ║"
echo "║  📋 INFORMACIÓN DEL SERVICIO:                                               ║"
echo "║                                                                              ║"
echo "║  🌐 URL Local: http://localhost:$PORT                                        ║"
echo "║  🌐 URL Pública: https://sre-api.alexanderoviedofadul.dev                   ║"
echo "║  📊 Estado: http://localhost:$PORT/api/estado                                ║"
echo "║  📚 Documentación: Ver README-ES.md y ANALISIS-PROYECTO.md                  ║"
echo "║                                                                              ║"
echo "║  🔧 COMANDOS DE GESTIÓN:                                                     ║"
echo "║                                                                              ║"
echo "║  Estado:    ./manage-sre-api.sh status                                      ║"
echo "║  Iniciar:   ./manage-sre-api.sh start                                       ║"
echo "║  Detener:   ./manage-sre-api.sh stop                                        ║"
echo "║  Reiniciar: ./manage-sre-api.sh restart                                     ║"
echo "║  Logs:      ./manage-sre-api.sh logs                                        ║"
echo "║                                                                              ║"
echo "║  📊 ENDPOINTS PRINCIPALES:                                                   ║"
echo "║                                                                              ║"
echo "║  GET  /api/agentes           - Listar agentes                               ║"
echo "║  POST /api/agentes/crear     - Crear nuevo agente                           ║"
echo "║  POST /api/agentes/:id/prompt - Ejecutar prompt                             ║"
echo "║  POST /api/agentes/:id/chat/iniciar - Iniciar chat                          ║"
echo "║  GET  /api/modelos           - Listar modelos disponibles                   ║"
echo "║  GET  /api/estado            - Estado del sistema                           ║"
echo "║                                                                              ║"
echo "║  🔄 PRÓXIMOS PASOS:                                                          ║"
echo "║                                                                              ║"
echo "║  1. Configurar API keys en .env                                             ║"
echo "║  2. Probar endpoints con Postman/curl                                       ║"
echo "║  3. Desarrollar frontend dashboard                                          ║"
echo "║  4. Implementar autenticación JWT                                           ║"
echo "║                                                                              ║"
echo "╚══════════════════════════════════════════════════════════════════════════════╝"
echo ""

log "📝 Despliegue documentado en: $LOG_FILE"
