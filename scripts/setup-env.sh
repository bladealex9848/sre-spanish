#!/bin/bash

# 🔧 SmythOS SRE - Script de Configuración Automática de Entorno
# Este script configura automáticamente el entorno de desarrollo/producción

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
║                    SmythOS SRE - Setup                       ║
║              Configuración Automática de Entorno             ║
╚═══════════════════════════════════════════════════════════════╝
EOF
echo -e "${NC}"

# Verificar si estamos en el directorio correcto
if [ ! -f "README-ES.md" ]; then
    error "Este script debe ejecutarse desde el directorio raíz del proyecto"
    exit 1
fi

# Detectar entorno
ENVIRONMENT=${1:-development}
log "Configurando entorno: $ENVIRONMENT"

# Crear directorios necesarios
log "Creando estructura de directorios..."
mkdir -p logs
mkdir -p workspace
mkdir -p agents-data/storage
mkdir -p agents-data/cache
mkdir -p config
mkdir -p backups

# Configurar archivo .env
if [ ! -f ".env" ]; then
    log "Creando archivo .env desde plantilla..."
    cp .env.example .env
    
    # Generar JWT secret aleatorio
    JWT_SECRET=$(openssl rand -base64 32 2>/dev/null || head -c 32 /dev/urandom | base64)
    sed -i "s/tu_jwt_secret_super_seguro_aqui_min_32_caracteres/$JWT_SECRET/" .env
    
    # Generar session secret aleatorio
    SESSION_SECRET=$(openssl rand -base64 24 2>/dev/null || head -c 24 /dev/urandom | base64)
    sed -i "s/tu_session_secret_aqui/$SESSION_SECRET/" .env
    
    info "Archivo .env creado. Por favor, configura tus API keys antes de continuar."
else
    warn "Archivo .env ya existe, saltando creación..."
fi

# Configurar según el entorno
case $ENVIRONMENT in
    "development")
        log "Configurando entorno de desarrollo..."
        sed -i 's/NODE_ENV=.*/NODE_ENV=development/' .env
        sed -i 's/LOG_LEVEL=.*/LOG_LEVEL=debug/' .env
        sed -i 's/ENABLE_DEBUG=.*/ENABLE_DEBUG=true/' .env
        ;;
    "production")
        log "Configurando entorno de producción..."
        sed -i 's/NODE_ENV=.*/NODE_ENV=production/' .env
        sed -i 's/LOG_LEVEL=.*/LOG_LEVEL=info/' .env
        sed -i 's/ENABLE_DEBUG=.*/ENABLE_DEBUG=false/' .env
        ;;
    "staging")
        log "Configurando entorno de staging..."
        sed -i 's/NODE_ENV=.*/NODE_ENV=staging/' .env
        sed -i 's/LOG_LEVEL=.*/LOG_LEVEL=info/' .env
        sed -i 's/ENABLE_DEBUG=.*/ENABLE_DEBUG=true/' .env
        ;;
esac

# Instalar dependencias de Node.js
if [ -d "api-example" ]; then
    log "Instalando dependencias de Node.js..."
    cd api-example
    if [ -f "package.json" ]; then
        npm install
        log "Dependencias instaladas correctamente"
    fi
    cd ..
fi

# Configurar permisos
log "Configurando permisos de archivos..."
chmod +x scripts/*.sh 2>/dev/null || true
chmod +x deploy-sre.sh 2>/dev/null || true
chmod 755 logs workspace agents-data 2>/dev/null || true

# Crear archivo de configuración de desarrollo
cat > config/development.js << 'EOF'
module.exports = {
  port: process.env.PORT || 8000,
  database: {
    url: process.env.DATABASE_URL || 'sqlite:./dev.db'
  },
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379'
  },
  logging: {
    level: 'debug',
    file: './logs/sre-dev.log'
  },
  smythos: {
    workspacePath: './workspace',
    agentsPath: './agents-data',
    cacheTimeout: 3600
  }
};
EOF

# Crear archivo de configuración de producción
cat > config/production.js << 'EOF'
module.exports = {
  port: process.env.PORT || 8000,
  database: {
    url: process.env.DATABASE_URL
  },
  redis: {
    url: process.env.REDIS_URL
  },
  logging: {
    level: 'info',
    file: '/root/logs/sre-api.log'
  },
  smythos: {
    workspacePath: process.env.SMYTHOS_WORKSPACE_PATH || '/root/sre-espanol/workspace',
    agentsPath: process.env.SMYTHOS_AGENTS_PATH || '/root/sre-espanol/agents-data',
    cacheTimeout: parseInt(process.env.SMYTHOS_CACHE_TTL) || 3600
  }
};
EOF

# Validar configuración
log "Validando configuración..."
source .env

required_vars=("JWT_SECRET" "PORT")
missing_vars=()

for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ]; then
        missing_vars+=("$var")
    fi
done

if [ ${#missing_vars[@]} -eq 0 ]; then
    log "✅ Configuración básica válida"
else
    warn "Variables faltantes: ${missing_vars[*]}"
    info "Por favor, configura estas variables en el archivo .env"
fi

# Crear script de inicio
cat > start-sre.sh << 'EOF'
#!/bin/bash
# Script de inicio para SmythOS SRE

source .env
cd api-example
npm start
EOF

chmod +x start-sre.sh

# Crear script de monitoreo
cat > scripts/monitor.sh << 'EOF'
#!/bin/bash
# Script de monitoreo para SmythOS SRE

while true; do
    if ! pgrep -f "node.*server.js" > /dev/null; then
        echo "$(date): Servicio caído, reiniciando..."
        ./start-sre.sh &
    fi
    sleep 30
done
EOF

chmod +x scripts/monitor.sh

# Resumen final
echo -e "${GREEN}"
cat << "EOF"
╔═══════════════════════════════════════════════════════════════╗
║                    ✅ CONFIGURACIÓN COMPLETA                  ║
╚═══════════════════════════════════════════════════════════════╝
EOF
echo -e "${NC}"

log "🎉 Configuración completada exitosamente!"
info "📁 Directorios creados: logs, workspace, agents-data, config, backups"
info "⚙️  Archivos de configuración generados"
info "🔐 Secrets generados automáticamente"

echo -e "\n${YELLOW}📋 PRÓXIMOS PASOS:${NC}"
echo "1. Edita el archivo .env con tus API keys reales"
echo "2. Ejecuta: ./start-sre.sh para iniciar el servicio"
echo "3. Visita: http://localhost:8000/api/estado para verificar"

echo -e "\n${BLUE}🔧 COMANDOS ÚTILES:${NC}"
echo "• ./start-sre.sh                 - Iniciar servicio"
echo "• ./scripts/monitor.sh           - Monitoreo automático"
echo "• ./deploy-sre.sh               - Despliegue completo"
echo "• tail -f logs/sre-api.log      - Ver logs en tiempo real"

log "🚀 SmythOS SRE listo para usar!"
