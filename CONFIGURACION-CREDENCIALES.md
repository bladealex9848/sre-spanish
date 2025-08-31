# 🔐 Configuración de Credenciales - SmythOS SRE

## 📋 **Resumen**

Este documento describe la configuración segura de credenciales para SmythOS SRE en un repositorio privado, permitiendo el uso libre de API keys y configuraciones sensibles.

## 🔒 **Ventajas del Repositorio Privado**

### ✅ **Beneficios de Seguridad**
- **Credenciales seguras**: API keys pueden incluirse en archivos de configuración
- **Configuraciones empresariales**: Datos sensibles protegidos
- **Control de acceso**: Solo colaboradores autorizados
- **Historial protegido**: Commits con credenciales no son públicos

### 🛡️ **Mejores Prácticas Implementadas**
- Variables de entorno para producción
- Archivos `.env` para desarrollo local
- Separación de configuraciones por ambiente
- Documentación automática sin exponer secretos

## 🔧 **Configuración de Variables de Entorno**

### **Archivo `.env` (Desarrollo Local)**
```bash
# API Keys - LLM Providers
OPENAI_API_KEY=sk-proj-tu_openai_api_key_aqui
ANTHROPIC_API_KEY=sk-ant-tu_anthropic_api_key_aqui
GOOGLE_AI_API_KEY=tu_google_ai_api_key_aqui

# Base de Datos
DATABASE_URL=postgresql://sre_user:password_seguro@localhost:5432/sre_db
REDIS_URL=redis://localhost:6379

# Configuración de Aplicación
NODE_ENV=development
PORT=8000
JWT_SECRET=tu_jwt_secret_super_seguro_aqui

# Configuración de Logging
LOG_LEVEL=debug
LOG_FILE=/root/logs/sre-api.log

# Configuración de SmythOS
SMYTHOS_WORKSPACE_PATH=/root/sre-espanol/workspace
SMYTHOS_AGENTS_PATH=/root/sre-espanol/agents-data
SMYTHOS_CACHE_TTL=3600

# Configuración de Seguridad
CORS_ORIGIN=https://sre-api.alexanderoviedofadul.dev
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX=100
```

### **Variables de Entorno de Producción**
```bash
# Configuración para servidor de producción
export NODE_ENV=production
export PORT=8000
export DATABASE_URL="postgresql://sre_prod:$SECURE_PASSWORD@localhost:5432/sre_production"

# API Keys (usar secrets manager en producción)
export OPENAI_API_KEY="$OPENAI_SECRET"
export ANTHROPIC_API_KEY="$ANTHROPIC_SECRET"

# Configuración de seguridad
export JWT_SECRET="$JWT_PRODUCTION_SECRET"
export CORS_ORIGIN="https://sre-api.alexanderoviedofadul.dev"
```

## 🚀 **Configuración de GitHub Secrets**

### **Secrets del Repositorio**
Para configurar en GitHub → Settings → Secrets and variables → Actions:

```yaml
# API Keys
OPENAI_API_KEY: "sk-proj-..."
ANTHROPIC_API_KEY: "sk-ant-..."
GOOGLE_AI_API_KEY: "..."

# Base de Datos
DATABASE_URL: "postgresql://..."
REDIS_URL: "redis://..."

# Configuración de Aplicación
JWT_SECRET: "..."
CORS_ORIGIN: "https://sre-api.alexanderoviedofadul.dev"

# Configuración de Despliegue
DEPLOY_HOST: "82.25.92.96"
DEPLOY_USER: "root"
DEPLOY_PATH: "/root/sre-espanol"
```

## 📁 **Estructura de Configuración**

```
sre-spanish/
├── .env.example              # Plantilla de variables
├── .env                      # Variables locales (git ignored)
├── config/
│   ├── development.js        # Configuración desarrollo
│   ├── production.js         # Configuración producción
│   └── secrets.example.json  # Plantilla de secretos
├── scripts/
│   ├── setup-env.sh         # Script configuración inicial
│   └── deploy-with-secrets.sh # Despliegue con secretos
└── docs/
    └── CONFIGURACION-CREDENCIALES.md
```

## 🔄 **Flujo de Configuración Automática**

### **1. Configuración Inicial**
```bash
# Clonar repositorio privado
git clone https://github.com/bladealex9848/sre-spanish.git
cd sre-spanish

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales reales

# Ejecutar configuración automática
./scripts/setup-env.sh
```

### **2. Despliegue Automatizado**
```bash
# Despliegue con credenciales seguras
./scripts/deploy-with-secrets.sh production

# O usando el script principal
./deploy-sre.sh --with-secrets
```

## 🛠️ **Configuración por Ambiente**

### **Desarrollo Local**
- Usar archivo `.env` local
- Base de datos SQLite para pruebas
- Logging detallado habilitado
- CORS permisivo para desarrollo

### **Staging/Testing**
- Variables de entorno del sistema
- Base de datos PostgreSQL compartida
- Logging moderado
- CORS restrictivo

### **Producción**
- Secrets manager (GitHub Secrets)
- Base de datos PostgreSQL dedicada
- Logging optimizado
- Máxima seguridad CORS

## 🔍 **Validación de Configuración**

### **Script de Validación**
```bash
#!/bin/bash
# validate-config.sh

echo "🔍 Validando configuración de SmythOS SRE..."

# Verificar variables requeridas
required_vars=(
    "OPENAI_API_KEY"
    "DATABASE_URL"
    "JWT_SECRET"
    "PORT"
)

for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ]; then
        echo "❌ Variable requerida no configurada: $var"
        exit 1
    else
        echo "✅ $var configurada"
    fi
done

echo "🎉 Configuración válida!"
```

## 📊 **Monitoreo de Credenciales**

### **Alertas de Seguridad**
- Rotación automática de API keys
- Monitoreo de uso de credenciales
- Alertas por acceso no autorizado
- Logs de auditoría de configuración

### **Mejores Prácticas de Rotación**
- API keys: Cada 90 días
- JWT secrets: Cada 30 días
- Database passwords: Cada 180 días
- Certificados SSL: Renovación automática

## 🚨 **Procedimientos de Emergencia**

### **En Caso de Compromiso**
1. **Revocar credenciales** inmediatamente
2. **Rotar todas las API keys**
3. **Cambiar passwords de base de datos**
4. **Revisar logs de acceso**
5. **Notificar al equipo de seguridad**

### **Recuperación de Acceso**
1. Verificar identidad del solicitante
2. Generar nuevas credenciales
3. Actualizar configuración
4. Probar conectividad
5. Documentar el incidente

---

**📝 Nota**: Este documento se actualiza automáticamente con cada cambio en la configuración del proyecto.
