# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This is a production server running multiple services for AI workflow automation and web interface management. The infrastructure is based on Docker containers with automated backup and update systems.

## Architecture

### Core Services

**N8N Workflow Automation** (`/root/n8n/`)
- Docker container running on port 5678 (localhost only)
- Configuration: `docker-compose.yml` with timezone America/Bogota
- Data persistence: `./n8n_data` volume with SQLite database
- Domain: `n8n.alexanderoviedofadul.dev` (HTTPS enabled)
- Encryption key stored in `/root/n8n/n8n_data/config`

**Open-WebUI** (Docker container only)
- Running on port 3001, accessible externally
- Image: `ghcr.io/open-webui/open-webui:main`
- Connected to Ollama at `http://localhost:11434`
- Data volume: `open-webui` (no local files, containerized)

**Ollama LLM Server**
- Local installation at `/usr/local/bin/ollama`
- Models: gemma3n:e4b (7.5GB), qwen3:latest (5.2GB), gemma3:latest (3.3GB)
- Running on localhost:11434

### AI Development Services

**LlamaCoder - AI Code Generator** (`/root/llamacoder/`)
- Next.js application running on port 5177
- Domain: `llamacoder.alexanderoviedofadul.dev` (HTTPS enabled)
- Together AI integration with API key configured
- Database: PostgreSQL (Supabase local)
- Script: `/root/llamacoder/start-llamacoder.sh`
- Configuration: `/root/llamacoder/.env`
- Status: ✅ TOTALMENTE FUNCIONAL

**DeepSite - AI Web Development** (`/root/deepsite/`)
- Running on port 5175 with Ollama integration
- Domain: `deepsite.alexanderoviedofadul.dev` (HTTPS enabled)
- Status: ✅ FUNCIONANDO

**OpenHands - AI Development Assistant** (`/root/openhands/`)
- Uvicorn server running on port 8001
- Domain: `openhands.alexanderoviedofadul.dev` (HTTPS enabled)
- Status: ✅ FUNCIONANDO

**SmythOS SRE Enhanced - Sistema Operativo para IA Agéntica** (`/root/sre-espanol/`)
- Express.js API server running on port 8000
- Domain: `sre-api.alexanderoviedofadul.dev` (HTTPS enabled) - ✅ **100% OPERATIVO**
- Repository: Public GitHub repo (bladealex9848/sre-spanish)
- **37 Asistentes Especializados** de OpenAI completamente integrados
- **9 Proveedores de IA**: OpenAI, Anthropic, Groq, Together AI, DeepInfra, DeepSeek, Mistral, OpenRouter, Ollama
- **OCR Avanzado**: Tesseract + OpenAI Vision (8 formatos soportados)
- **Búsqueda Web Inteligente**: 3 proveedores (Tavily, Google Custom Search, Exa)
- **Documentación Interactiva**: Superior a Swagger UI estándar
- **25+ Endpoints**: Completamente funcionales con ejemplos en 5 lenguajes
- **ACTUALIZACIÓN 31/08/2025**: Interfaz CSS personalizada sin dependencias CDN
- Status: ✅ **PLATAFORMA COMPLETA** - Documentación interactiva de clase mundial

**Jupyter Notebook** (`/root/jupyter/`)
- Interactive development environment on port 8888
- Domain: `jupyter.alexanderoviedofadul.dev` (HTTPS enabled)
- Authentication required
- Status: ✅ FUNCIONANDO

**Justicia 360 - Plataforma SaaS** (`/root/consulta-procesos-ui/`)
- Next.js 15 application for legal case consultation
- Technology: React 19, TypeScript, Tailwind CSS, AI integrations
- Port: 5178 (production mode)
- Domain: `justicia360.tech` (HTTPS enabled) - ✅ **100% OPERATIVO**
- Repository: Private GitHub repo (bladealex9848/consulta-procesos-ui)
- Database: MariaDB local (justicia360_db) - **MIGRADA 28/08/2025**
- Users: 5 usuarios migrados desde BD externa
- Features: Legal case consultation, document analysis, SaaS platform
- **ACTUALIZACIÓN 31/08/2025**: Sincronizados 23 commits desde GitHub
- **Nuevas funcionalidades**: SMTP SSL/TLS, herramientas comunicación, debug Nodemailer
- Status: ✅ **COMPLETAMENTE FUNCIONAL** - Última versión de GitHub aplicada

### Infrastructure Services

**Web Servers**
- Apache2: Running for Hestia Control Panel
- Nginx: Running for reverse proxy and static content
- Both services managed by systemd

**PM2 Process Manager**
- Available but currently no processes running
- Node.js runtime available via NVM

**Database Services**

**MariaDB 11.8.2 LTS - Master Principal** (`/etc/mysql/`)
- Production database server running on localhost:3306 (Master Principal - server-id: 1)
- Version: MariaDB 11.8.2 LTS (upgraded from 11.4.7)
- Configuration: `/etc/mysql/mariadb.conf.d/99-security-optimization.cnf`
- Optimized for 31GB RAM server (8GB InnoDB buffer pool)
- SSL enabled, security hardened, binary logging active for replication
- **Architecture Changed:** Converted from Slave to Master Principal (08/04/2025)
- **Databases:** 34 databases total (26 restored from slave backup + 8 original)
- **Replication:** Ready to accept slave connections (user: replication_master)
- Backup location: `/root/backups/mariadb/`
- Hestia Panel integration with user 'hestia_admin'

**phpMyAdmin 5.2.2** (`/var/www/phpmyadmin/`)
- Web administration interface for MariaDB
- Apache virtual host on port 8090 (localhost only)
- Accessible via: `https://phpmyadmin.alexanderoviedofadul.dev`
- Secure configuration with cookie authentication
- Access restricted to localhost and Hestia users

## 🌐 URLs Importantes

### **SmythOS SRE Enhanced**
- **API Base**: https://sre-api.alexanderoviedofadul.dev
- **Documentación Interactiva**: https://sre-api.alexanderoviedofadul.dev/docs-ui/ *(Recomendada)*
- **Swagger UI**: https://sre-api.alexanderoviedofadul.dev/docs
- **ReDoc**: https://sre-api.alexanderoviedofadul.dev/redoc
- **GitHub Pages**: https://bladealex9848.github.io/sre-spanish/
- **Repositorio**: https://github.com/bladealex9848/sre-spanish

### **Justicia 360**
- **Sitio Principal**: https://justicia360.tech/
- **Estado**: Completamente actualizado (31/08/2025)

### **Otros Servicios**
- **N8N**: https://n8n.alexanderoviedofadul.dev/
- **LlamaCoder**: https://llamacoder.alexanderoviedofadul.dev/
- **DeepSite**: https://deepsite.alexanderoviedofadul.dev/
- **OpenHands**: https://openhands.alexanderoviedofadul.dev/
- **Jupyter**: https://jupyter.alexanderoviedofadul.dev/
- **Ollama**: https://ollama.alexanderoviedofadul.dev/

## Common Commands

### Container Management
```bash
# View running containers
docker ps

# Update Open-WebUI (automated monthly)
/root/update-openwebui.sh

# Manual backup Open-WebUI
/root/backup-openwebui.sh

# Start N8N stack
cd /root/n8n && docker-compose up -d

# View N8N logs
cd /root/n8n && docker-compose logs -f
```

### Ollama Management
```bash
# List installed models
ollama list

# Run a model
ollama run gemma3:latest

# Pull new model
ollama pull model_name
```

### AI Development Services Management
```bash
# LlamaCoder management (AI Code Generator)
cd /root/llamacoder && ./start-llamacoder.sh
tail -f /root/logs/llamacoder.log
pkill -f llamacoder

# DeepSite management
cd /root/deepsite && ./start-deepsite.sh
tail -f /root/logs/deepsite.log

# OpenHands management
cd /root/openhands && pm2 start ecosystem.config.js
pm2 logs openhands

# Jupyter management
jupyter notebook --ip=0.0.0.0 --port=8888 --no-browser --allow-root

# Justicia 360 management (SaaS Platform)
bash /root/start-justicia360.sh
tail -f /root/logs/justicia360.log
pkill -f "next.*5178"

# Justicia 360 maintenance
bash /root/backup-justicia360.sh
bash /root/update-justicia360.sh
cd /root/consulta-procesos-ui && npm install  # Fix dependencies

# SmythOS SRE Enhanced management (IA Agéntica Platform)
/root/manage-sre-enhanced.sh start
/root/manage-sre-enhanced.sh restart
/root/manage-sre-enhanced.sh stop
tail -f /root/logs/sre-enhanced.log

# SmythOS SRE Enhanced testing
/root/test-api-completa-final.sh  # Pruebas completas
curl https://sre-api.alexanderoviedofadul.dev/api/estado  # Estado API
curl https://sre-api.alexanderoviedofadul.dev/api/asistentes  # Lista asistentes
```

### Database Management (Master Principal)
```bash
# MariaDB service management
systemctl status mariadb
systemctl restart mariadb
systemctl reload mariadb

# Database administration
mariadb -u root -p
mariadb --version

# Master status and replication management
mariadb -u root -e "SHOW MASTER STATUS;"
mariadb -u root -e "SHOW BINARY LOGS;"
mariadb -u root -e "SHOW PROCESSLIST;" | grep -E "(Binlog|Slave)"

# Create manual backup (Master format for slaves)
mariadb-dump --all-databases --single-transaction --routines --triggers --master-data=1 -u root -p > /root/backups/mariadb/master-backup-$(date +%Y%m%d_%H%M%S).sql

# Standard backup
mariadb-dump --all-databases --single-transaction --routines --triggers -u root -p > /root/backups/mariadb/backup-$(date +%Y%m%d_%H%M%S).sql

# Check database status
mariadb -u root -p -e "SHOW STATUS LIKE 'Uptime%';"
mariadb -u root -p -e "SHOW PROCESSLIST;"
mariadb -u root -e "SELECT COUNT(*) as 'Total Databases' FROM INFORMATION_SCHEMA.SCHEMATA;"

# Replication user management
mariadb -u root -e "SELECT User, Host FROM mysql.user WHERE Repl_slave_priv = 'Y';"

# Configure new slave (use script)
/root/configure-new-slave.sh [server-id] [slave-ip]

# phpMyAdmin access
# Web: https://phpmyadmin.alexanderoviedofadul.dev
# Local: http://localhost:8090

# Hestia Panel database management
/usr/local/hestia/bin/v-list-databases
/usr/local/hestia/bin/v-add-database [user] [database] [dbuser] [password]
```

### Monitoring and Logs
```bash
# Check service status
systemctl status nginx apache2 mariadb

# View backup logs
tail -f /root/logs/backup-openwebui.log

# View update logs  
tail -f /root/logs/update-openwebui.log

# MariaDB logs
tail -f /var/log/mysql/error.log
tail -f /var/log/mysql/slow-query.log
journalctl -u mariadb -f

# PM2 process monitoring
pm2 list
pm2 logs
```

### Backup and Maintenance
```bash
# Manual backup (automated weekly on Sundays at 2 AM)
/root/backup-openwebui.sh

# Check backup files
ls -la /root/backups/

# Restore from backup
docker run --rm -v open-webui:/data -v /root/backups:/backup alpine tar -xzf /backup/open-webui-YYYY-MM-DD.tar.gz -C /data --strip 1
```

## Automated Tasks

**Crontab Schedule:**
- Weekly backups: Sundays at 2:00 AM
- Monthly updates: 1st of each month at 3:00 AM

## Development Workflow

1. **N8N Workflows**: Access via https://n8n.alexanderoviedofadul.dev/
2. **Open-WebUI**: Access via port 3001 on the server
3. **Model Management**: Use `ollama` commands for LLM operations
4. **Process Management**: Use `pm2` for Node.js applications if needed

## Data Locations

- N8N data: `/root/n8n/n8n_data/` (workflows, config, database)
- Open-WebUI data: Docker volume `open-webui` (user data, conversations)
- MariaDB data: `/var/lib/mysql/` (databases, logs, binary logs)
- MariaDB config: `/etc/mysql/mariadb.conf.d/` (configuration files)
- MariaDB master docs: `/root/master-principal-documentation.md` (master configuration guide)
- MariaDB slave script: `/root/configure-new-slave.sh` (automated slave setup)
- phpMyAdmin: `/var/www/phpmyadmin/` (web interface files)
- Justicia 360: `/root/consulta-procesos-ui/` (Next.js application, config, assets)
- Justicia 360 backups: `/root/backups/justicia360/` (automated backups, 7-day retention)
- Justicia 360 BD migration: `/root/backups/bd-migration/` (backup BD externa, 28/08/2025)
- Justicia 360 local DB: MariaDB `justicia360_db` (18 tables, 5 users migrated)
- Backups: `/root/backups/` (tar.gz files, 7-day retention)
- MariaDB backups: `/root/backups/mariadb/` (SQL dumps, automated daily)
- Logs: `/root/logs/` (backup and update logs)
- MariaDB logs: `/var/log/mysql/` (error.log, slow-query.log, binary logs for replication)
- Justicia 360 logs: `/root/logs/justicia360.log` (application logs, errors, startup info)
- Caddy logs: `/var/log/caddy/justicia360.log` (domain-specific access logs)
- Hestia backups: `/root/hst_backups/` (system configuration backups)

## Security Notes

- N8N runs on localhost only, accessed via domain with HTTPS
- Open-WebUI exposed on port 3001 for external access
- MariaDB Master Principal: SSL enabled, replication user configured securely
- phpMyAdmin accessible only through HTTPS proxy, cookie authentication
- Database root access restricted, Hestia integration user created
- Binary logging enabled for replication and point-in-time recovery
- **Replication Security:** User 'replication_master' with restricted privileges
- **Master Configuration:** Ready to accept encrypted slave connections
- Encryption key for N8N stored in config file
- Regular automated backups with 7-day retention policy

## Implementation Documentation Repository

**N8N Implementations Documentation** (`/root/n8n-implementations-docs/`)

This repository contains comprehensive documentation for N8N implementations across different platforms and servers:

### Repository Structure
- **Multiple Platform Implementations**: CentOS 7, Oracle Cloud, Ubuntu VPS
- **Comprehensive Guides**: Installation, configuration, troubleshooting, and maintenance
- **Application Documentation**: Open-WebUI, Evolution API, Supabase, Jupyter, and more
- **Automation Scripts**: Backup, update, and deployment scripts
- **Workflow Collections**: Ready-to-use N8N workflows in JSON format

### Key Documentation Files
- `README.md`: Complete server overview with service details
- `PLAN_DE_IMPLEMENTACION_VPS.md`: VPS implementation roadmap and current status
- `docs/`: Detailed guides for each service and implementation
- `workflows/`: N8N workflow templates and examples
- `scripts/`: Automation and deployment scripts

### Implementation Status Tracking
- **Oracle Cloud Server**: 149.130.179.38 (Ubuntu 24.04.2 LTS ARM64)
- **CentOS 7 Server**: 190.8.178.74 (Consulta Procesos API)
- **Current VPS**: 82.25.92.96 (Ubuntu 24.04.2 LTS x86_64)

### Common Commands for Documentation Repository
```bash
# Navigate to documentation
cd /root/n8n-implementations-docs

# Update documentation from GitHub
git pull origin main

# View implementation guides
ls docs/
cat docs/COMANDOS_GESTION_CENTOS7.md
cat docs/Open-WebUI/GUIA_IMPLEMENTACION.md

# Access workflow templates
ls workflows/
cat workflows/Youtube/Content_AI_Agent.json

# Review implementation scripts
ls docs/scripts/
cat docs/scripts/actualizar-n8n.sh
```

### Documentation Usage Guidelines
1. **Reference First**: Always check existing documentation before implementing new services
2. **Update After Changes**: Document any new implementations or modifications
3. **Follow Patterns**: Use established naming conventions and directory structures
4. **Cross-Platform Notes**: Document differences between implementations (Oracle vs VPS vs CentOS)

### Service Implementation References
- **N8N**: `docs/n8n-info.md`, `docs/actualizacion-n8n.md`
- **Open-WebUI**: `docs/Open-WebUI/` directory
- **Supabase**: `docs/IMPLEMENTACION_SUPABASE.md`
- **Evolution API**: `docs/evolutionapi/README.md`
- **Security**: `docs/seguridad.md`
- **Troubleshooting**: `docs/TROUBLESHOOTING_OPENHANDS.md`

This documentation repository serves as the central knowledge base for all N8N-related implementations and should be consulted for planning, implementation, and maintenance activities.

## Estado Actual de Replicación MariaDB

### Situación Verificada (04/08/2025)

**Servidor Actual (82.25.92.96) - Master Principal:**
- Estado: OPERATIVO como Master Principal (server-id: 1)
- Binary Logs: Activos (mysql-bin.000009, posición 1613)
- Bases de datos: 34 totales (datos más recientes)
- Usuario replicación: 'replication_master' configurado
- Conectividad: Sin slaves conectados actualmente

**Servidor Remoto (190.8.178.74) - DESCONECTADO:**
- Estado: INACCESIBLE (100% pérdida de paquetes, puerto 3306 no responde)
- Datos: Potencialmente desactualizados
- Replicación: INTERRUMPIDA - sin sincronización activa

**Protocolo de Reconexión (CRÍTICO):**

⚠️ **ANTES de restablecer cualquier sincronización, es OBLIGATORIO:**

1. **Verificar datos más actualizados:**
   ```bash
   # Comparar timestamps de últimas modificaciones
   mariadb -u root -e "SELECT table_schema, MAX(update_time) as last_update FROM information_schema.tables WHERE update_time IS NOT NULL GROUP BY table_schema ORDER BY last_update DESC;"
   
   # Verificar actividad reciente en binary logs
   mariadb -u root -e "SHOW MASTER STATUS;"
   mariadb -u root -e "SHOW BINARY LOGS;"
   ```

2. **Respaldar estado actual:**
   ```bash
   # Backup completo con datos de replicación
   mkdir -p /root/backups/mariadb
   mariadb-dump --all-databases --single-transaction --routines --triggers --master-data=1 -u root -p > /root/backups/mariadb/pre-sync-master-backup-$(date +%Y%m%d_%H%M%S).sql
   ```

3. **Evaluar integridad de datos remotos:**
   - Cuando 190.8.178.74 regrese online, NO permitir escrituras automáticas
   - Comparar esquemas y datos antes de decidir dirección de sincronización
   - Establecer este servidor (82.25.92.96) como master definitivo si tiene datos más recientes

**Riesgo de Divergencia:** Los servidores NO se sincronizarán automáticamente al reconectarse. Se requiere intervención manual para evitar inconsistencias de datos.

## Pending Tasks (Next Session)

### High Priority - ACTUALIZADO
1. **Verificación de Datos Pre-Sincronización**
   - ✅ Confirmar que servidor actual (82.25.92.96) tiene datos más recientes
   - ⏳ Crear backup completo del estado actual antes de cualquier sincronización
   - ⏳ Establecer procedimiento de verificación de integridad post-reconexión

2. **Replicación MariaDB Master-Slave (Post-Verificación)**
   - Reconfigurar servidor 190.8.178.74 como slave (cuando regrese online)
   - Implementar MaxScale proxy para failover automático
   - Configurar SSL/TLS para conexiones de replicación seguras
   - Establecer monitoreo de estado de replicación
   - Documentar procedimientos de failover manual y recuperación

### Medium Priority  
2. **Servicios completados exitosamente (7/7 - 100%)**
   - ✅ LlamaCoder: COMPLETADO - API Together AI configurado y funcionando
   - ✅ DeepSite: COMPLETADO - Funcionando con Ollama local
   - ✅ OpenHands: COMPLETADO - Servidor Uvicorn activo
   - ✅ Jupyter: COMPLETADO - Entorno interactivo funcionando
   - ✅ Propuesta Fundetec: COMPLETADO - Gestionado en Hestia Panel
   - ✅ Justicia 360: COMPLETADO - Plataforma SaaS consultas judiciales desplegada
   - ⚠️ Easypanel: ERROR - Problema en imagen Docker oficial (6/7 funcionando)

## Language and Communication Notes

- Hablemos siempre en idioma español