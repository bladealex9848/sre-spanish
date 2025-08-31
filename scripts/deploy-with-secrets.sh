#!/bin/bash

# 🚀 SmythOS SRE - Script de Despliegue con Credenciales Seguras
# Este script despliega la aplicación con manejo seguro de credenciales

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para logging
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}"
}

info() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')] INFO: $1${NC}"
}

# Banner
echo -e "${BLUE}"
cat << "EOF"
╔═══════════════════════════════════════════════════════════════╗
║              SmythOS SRE - Despliegue Seguro                 ║
║            Manejo Automático de Credenciales                 ║
╚═══════════════════════════════════════════════════════════════╝
EOF
echo -e "${NC}"

# Verificar parámetros
ENVIRONMENT=${1:-production}
FORCE_RESTART=${2:-false}

log "Iniciando despliegue para entorno: $ENVIRONMENT"

# Verificar que estamos en el directorio correcto
if [ ! -f "README-ES.md" ]; then
    error "Este script debe ejecutarse desde el directorio raíz del proyecto"
    exit 1
fi

# Verificar archivo .env
if [ ! -f ".env" ]; then
    error "Archivo .env no encontrado. Ejecuta ./scripts/setup-env.sh primero"
    exit 1
fi

# Cargar variables de entorno
log "Cargando variables de entorno..."
source .env

# Validar credenciales críticas
log "Validando credenciales..."
critical_vars=("JWT_SECRET" "PORT")
missing_vars=()

for var in "${critical_vars[@]}"; do
    if [ -z "${!var}" ]; then
        missing_vars+=("$var")
    fi
done

if [ ${#missing_vars[@]} -ne 0 ]; then
    error "Variables críticas faltantes: ${missing_vars[*]}"
    error "Por favor, configura estas variables en .env"
    exit 1
fi

# Verificar API keys (opcional pero recomendado)
api_keys=("OPENAI_API_KEY" "ANTHROPIC_API_KEY")
missing_apis=()

for var in "${api_keys[@]}"; do
    if [ -z "${!var}" ] || [[ "${!var}" == *"tu_"* ]]; then
        missing_apis+=("$var")
    fi
done

if [ ${#missing_apis[@]} -ne 0 ]; then
    warn "API keys no configuradas: ${missing_apis[*]}"
    warn "Algunas funcionalidades pueden no estar disponibles"
fi

# Crear backup de configuración actual
log "Creando backup de configuración..."
BACKUP_DIR="backups/config-$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"
cp .env "$BACKUP_DIR/" 2>/dev/null || true
cp -r config "$BACKUP_DIR/" 2>/dev/null || true

# Detener servicio existente si está corriendo
log "Verificando servicios existentes..."
if pgrep -f "node.*server.js" > /dev/null; then
    if [ "$FORCE_RESTART" = "true" ]; then
        log "Deteniendo servicio existente..."
        pkill -f "node.*server.js" || true
        sleep 3
    else
        warn "Servicio ya está ejecutándose. Usa 'true' como segundo parámetro para forzar reinicio"
        info "Ejemplo: ./scripts/deploy-with-secrets.sh production true"
        exit 1
    fi
fi

# Instalar/actualizar dependencias
log "Instalando dependencias..."
cd api-example
npm install --production
cd ..

# Configurar permisos de seguridad
log "Configurando permisos de seguridad..."
chmod 600 .env
chmod 755 logs workspace agents-data 2>/dev/null || true
chmod +x scripts/*.sh 2>/dev/null || true

# Configurar variables específicas del entorno
case $ENVIRONMENT in
    "production")
        log "Configurando entorno de producción..."
        export NODE_ENV=production
        export LOG_LEVEL=info
        export ENABLE_DEBUG=false
        ;;
    "staging")
        log "Configurando entorno de staging..."
        export NODE_ENV=staging
        export LOG_LEVEL=info
        export ENABLE_DEBUG=true
        ;;
    "development")
        log "Configurando entorno de desarrollo..."
        export NODE_ENV=development
        export LOG_LEVEL=debug
        export ENABLE_DEBUG=true
        ;;
esac

# Crear archivo de configuración específico del entorno
log "Generando configuración específica del entorno..."
cat > config/current.js << EOF
module.exports = {
  environment: '$ENVIRONMENT',
  port: $PORT,
  database: {
    url: '${DATABASE_URL:-sqlite:./sre.db}'
  },
  redis: {
    url: '${REDIS_URL:-redis://localhost:6379}'
  },
  logging: {
    level: '${LOG_LEVEL:-info}',
    file: '${LOG_FILE:-./logs/sre-api.log}'
  },
  security: {
    jwtSecret: '$JWT_SECRET',
    corsOrigin: '${CORS_ORIGIN:-*}',
    rateLimitWindow: ${RATE_LIMIT_WINDOW:-900000},
    rateLimitMax: ${RATE_LIMIT_MAX:-100}
  },
  smythos: {
    workspacePath: '${SMYTHOS_WORKSPACE_PATH:-./workspace}',
    agentsPath: '${SMYTHOS_AGENTS_PATH:-./agents-data}',
    cacheTimeout: ${SMYTHOS_CACHE_TTL:-3600}
  },
  apis: {
    openai: '${OPENAI_API_KEY:-}',
    anthropic: '${ANTHROPIC_API_KEY:-}',
    google: '${GOOGLE_AI_API_KEY:-}'
  }
};
EOF

chmod 600 config/current.js

# Iniciar servicio
log "Iniciando SmythOS SRE..."
cd api-example

# Crear script de inicio con manejo de errores
cat > start-with-env.js << 'EOF'
const fs = require('fs');
const path = require('path');

// Cargar configuración
const config = require('../config/current.js');

// Configurar variables de entorno desde config
Object.keys(config).forEach(key => {
    if (typeof config[key] === 'object') {
        Object.keys(config[key]).forEach(subKey => {
            const envKey = `${key.toUpperCase()}_${subKey.toUpperCase()}`;
            process.env[envKey] = config[key][subKey];
        });
    } else {
        process.env[key.toUpperCase()] = config[key];
    }
});

// Configurar logging
const logFile = config.logging.file;
const logDir = path.dirname(logFile);
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
}

console.log(`🚀 Iniciando SmythOS SRE en modo ${config.environment}`);
console.log(`📊 Puerto: ${config.port}`);
console.log(`📝 Logs: ${logFile}`);

// Iniciar servidor principal
require('./server.js');
EOF

# Iniciar en background con logging
nohup node start-with-env.js > "../logs/sre-startup.log" 2>&1 &
SERVER_PID=$!

cd ..

# Esperar a que el servidor inicie
log "Esperando inicio del servidor..."
sleep 5

# Verificar que el servidor esté corriendo
if kill -0 $SERVER_PID 2>/dev/null; then
    log "✅ Servidor iniciado correctamente (PID: $SERVER_PID)"
    
    # Probar conectividad
    sleep 2
    if curl -s "http://localhost:$PORT/api/estado" > /dev/null; then
        log "✅ API respondiendo correctamente"
    else
        warn "⚠️  API no responde, verificar logs"
    fi
else
    error "❌ Error al iniciar el servidor"
    cat logs/sre-startup.log
    exit 1
fi

# Crear archivo de estado del despliegue
cat > .deployment-status << EOF
DEPLOYMENT_DATE=$(date)
ENVIRONMENT=$ENVIRONMENT
SERVER_PID=$SERVER_PID
PORT=$PORT
STATUS=ACTIVE
BACKUP_DIR=$BACKUP_DIR
EOF

# Configurar monitoreo automático
if [ "$ENVIRONMENT" = "production" ]; then
    log "Configurando monitoreo automático..."
    (crontab -l 2>/dev/null; echo "*/5 * * * * /bin/bash $(pwd)/scripts/monitor.sh") | crontab -
fi

# Resumen final
echo -e "${GREEN}"
cat << "EOF"
╔═══════════════════════════════════════════════════════════════╗
║                  ✅ DESPLIEGUE COMPLETADO                     ║
╚═══════════════════════════════════════════════════════════════╝
EOF
echo -e "${NC}"

log "🎉 SmythOS SRE desplegado exitosamente!"
info "🌐 URL: http://localhost:$PORT"
info "📊 Estado: http://localhost:$PORT/api/estado"
info "📝 Logs: tail -f logs/sre-api.log"
info "🔍 PID del servidor: $SERVER_PID"

echo -e "\n${YELLOW}📋 COMANDOS ÚTILES:${NC}"
echo "• curl http://localhost:$PORT/api/estado    - Verificar estado"
echo "• tail -f logs/sre-api.log                 - Ver logs"
echo "• kill $SERVER_PID                         - Detener servidor"
echo "• ./scripts/monitor.sh                     - Monitoreo manual"

log "🚀 Despliegue completado con credenciales seguras!"
