# SmythOS SRE API - Dockerfile
FROM node:18-alpine

# Información del mantenedor
LABEL maintainer="Alexander Oviedo Fadul <bladealex9848@gmail.com>"
LABEL description="SmythOS SRE API en Español - Sistema Operativo para IA Agéntica"
LABEL version="1.0.0"

# Crear directorio de trabajo
WORKDIR /app

# Instalar dependencias del sistema
RUN apk add --no-cache \
    curl \
    && rm -rf /var/cache/apk/*

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias de Node.js
RUN npm ci --only=production && npm cache clean --force

# Copiar código fuente
COPY . .

# Crear usuario no-root para seguridad
RUN addgroup -g 1001 -S nodejs && \
    adduser -S smythos -u 1001

# Cambiar permisos
RUN chown -R smythos:nodejs /app
USER smythos

# Exponer puerto
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/api/estado || exit 1

# Comando de inicio
CMD ["node", "server.js"]
