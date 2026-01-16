# 🚀 SmythOS SRE Enhanced

**Sistema Operativo para IA Agéntica con 37 Asistentes Especializados**

[![Estado](https://img.shields.io/badge/Estado-Operativo-green)](http://localhost:8000/api/estado)
[![Asistentes](https://img.shields.io/badge/Asistentes-37-blue)](http://localhost:8000/api/asistentes)
[![Proveedores](https://img.shields.io/badge/Proveedores_IA-9-orange)](http://localhost:8000/api/proveedores)
[![Versión](https://img.shields.io/badge/Versión-1.0.0_Enhanced-purple)](https://github.com/bladealex9848/sre-spanish)

## 📋 Descripción

**SmythOS SRE Enhanced** es una plataforma completa que integra múltiples proveedores de IA y 37 asistentes especializados de OpenAI, diseñada específicamente para consultas legales, análisis de documentos, y asistencia especializada en múltiples dominios.

### ✨ Características Principales

- 🤖 **37 Asistentes Especializados** de OpenAI en 9 categorías
- 🔗 **9 Proveedores de IA** (OpenAI, Anthropic, Groq, Together, Ollama, OpenRouter, Mistral, etc.)
- 🌐 **API REST robusta** con 25+ endpoints
- 🔍 **Búsqueda web inteligente** con 3 proveedores (Tavily, Google, Exa)
- 📷 **OCR Avanzado** con Tesseract + OpenAI Vision
- 📚 **Documentación Interactiva** (Swagger UI + ReDoc + OpenAPI)
- 🎯 **Sistema de recomendaciones** automático
- ⚖️ **Especialización legal** colombiana
- 📊 **Gestión avanzada** de agentes y conversaciones

## 🆕 Nuevas Funcionalidades Integradas

### 📷 OCR (Reconocimiento Óptico de Caracteres)
- **Tesseract**: OCR local gratuito con soporte para español e inglés
- **OpenAI Vision**: OCR de alta precisión con GPT-4o
- **Formatos soportados**: JPG, PNG, GIF, BMP, TIFF, WEBP, PDF
- **Procesamiento por lotes**: Múltiples imágenes simultáneamente
- **Interfaz Visual**: Drag & drop en documentación interactiva

### 🔍 Búsqueda Web Inteligente
- **Tavily**: Búsqueda especializada con respuestas generadas
- **Google Custom Search**: Resultados de Google con API oficial
- **Exa**: Búsqueda neural avanzada
- **Búsqueda combinada**: Agrega resultados de múltiples proveedores
- **Interfaz Integrada**: Búsqueda en vivo desde la documentación

### 📚 Documentación Interactiva de Clase Mundial
- **Documentación Personalizada** (`/docs-ui/`): **Interfaz superior a Swagger UI**
- **Swagger UI** (`/docs`): Interfaz estándar OpenAPI
- **ReDoc** (`/redoc`): Documentación estática elegante
- **OpenAPI 3.0** (`/api-docs.json`): Especificación completa
- **6 Pestañas Organizadas**: Resumen, Endpoints, Asistentes, Búsqueda, OCR, Ejemplos
- **CSS Personalizado**: Sin dependencias CDN externas
- **Responsive Design**: Optimizado para móviles y desktop

### 🤖 Ollama Integrado
- **Sin API Key**: Acceso directo a modelos locales
- **8 Modelos disponibles**: Llama, Qwen, Gemma, CodeLlama, Mistral, etc.
- **Dominio dedicado**: `https://ollama.alexanderoviedofadul.dev`
- **Integración completa**: Disponible en todos los endpoints

### 🎨 Interfaz de Usuario Mejorada
- **CSS Personalizado**: Sistema completo sin dependencias externas
- **Componentes Modernos**: Cards, botones, formularios con efectos visuales
- **Animaciones CSS**: Transiciones suaves y efectos hover
- **Estados Interactivos**: Loading, focus, hover, active states
- **Paleta Profesional**: Gradientes y colores consistentes

## 🏗️ Arquitectura

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Cliente       │───▶│   API REST       │───▶│   Proveedores   │
│   (curl/web)    │    │   Express.js     │    │   IA Multiple   │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌──────────────────┐
                       │   37 Asistentes  │
                       │   Especializados │
                       └──────────────────┘
```

## 🤖 Asistentes Especializados

### 📊 Por Categoría

| Categoría | Cantidad | Ejemplos |
|-----------|----------|----------|
| **Legal** | 21 | Constitución, Tutela, Familia, JURIS-INTEGRAL |
| **Tecnología** | 3 | Transformación Digital, PowerBI, MardukIA |
| **Educación** | 3 | Profesor Synapse, Guillo, Ética Educativa |
| **Comunicación** | 3 | Copywriting, Lingüística, Podcastor |
| **Documentos** | 3 | Análisis Documental, Resumen Experto |
| **Otros** | 4 | Salud, Finanzas, Bienestar, General |

### 🎯 Destacados

- **🏛️ Constitución Colombiana**: Experto en derechos fundamentales
- **⚖️ TutelaBot**: Especialista en acciones de tutela
- **👨‍👩‍👧‍👦 FamiliaBot**: Derecho de familia colombiano
- **📊 JURIS-INTEGRAL**: Jurisprudencia con metodología magistrada
- **🏛️ ConsejoExpert**: Consejos Seccionales de la Judicatura

## 🌐 Acceso Público

### 🔗 URL Principal
```
https://sre-api.alexanderoviedofadul.dev
```

### 📚 Documentación Interactiva
- **🎨 Documentación Personalizada**: https://sre-api.alexanderoviedofadul.dev/docs-ui/ *(Recomendada)*
- **Swagger UI**: https://sre-api.alexanderoviedofadul.dev/docs
- **ReDoc**: https://sre-api.alexanderoviedofadul.dev/redoc
- **OpenAPI JSON**: https://sre-api.alexanderoviedofadul.dev/api-docs.json

> **💡 Nota**: La documentación personalizada (`/docs-ui/`) ofrece una experiencia superior con interfaz moderna, pruebas en vivo, búsqueda web integrada y OCR visual.

### 🧪 Prueba Rápida
```bash
# Estado del sistema
curl https://sre-api.alexanderoviedofadul.dev/api/estado

# Lista de asistentes
curl https://sre-api.alexanderoviedofadul.dev/api/asistentes

# Recomendación automática
curl -X POST https://sre-api.alexanderoviedofadul.dev/api/asistentes/recomendacion \
  -H "Content-Type: application/json" \
  -d '{"consulta": "Necesito ayuda con una tutela"}'
```

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js 18+
- NPM o Yarn
- API Keys configuradas

### Instalación

```bash
# Clonar repositorio
git clone https://github.com/bladealex9848/sre-spanish.git
cd sre-spanish

# Instalar dependencias
cd api-example
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus API keys

# Iniciar servidor
npm start
```

### Uso Básico

```bash
# Estado del sistema
curl http://localhost:8000/api/estado

# Listar asistentes
curl http://localhost:8000/api/asistentes

# Consultar asistente especializado
curl -X POST http://localhost:8000/api/asistentes/tutela/consulta \
  -H "Content-Type: application/json" \
  -d '{"mensaje": "¿Cómo presentar una tutela?"}'
```

## 📚 Documentación

### 🔗 Endpoints Principales

#### 📊 Sistema (4 endpoints)
| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/api/estado` | GET | Estado completo del sistema |
| `/api/proveedores` | GET | Lista proveedores de IA |
| `/api/modelos` | GET | Todos los modelos disponibles |
| `/api/proveedores/test` | POST | Prueba conectividad APIs |

#### 🤖 Asistentes (6 endpoints)
| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/api/asistentes` | GET | Lista 37 asistentes especializados |
| `/api/asistentes/categorias` | GET | Categorías de asistentes |
| `/api/asistentes/categoria/{cat}` | GET | Asistentes por categoría |
| `/api/asistentes/buscar` | POST | Buscar asistentes |
| `/api/asistentes/{id}/consulta` | POST | Consultar asistente especializado |
| `/api/asistentes/recomendacion` | POST | Obtener recomendación automática |

#### 🔍 Búsqueda Web (4 endpoints)
| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/api/busqueda` | POST | Búsqueda inteligente (3 proveedores) |
| `/api/busqueda/combinada` | POST | Búsqueda combinada múltiple |
| `/api/busqueda/proveedores` | GET | Lista proveedores de búsqueda |
| `/api/busqueda/test` | POST | Prueba proveedores búsqueda |

#### 📷 OCR (3 endpoints)
| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/api/ocr` | POST | Extrae texto de imágenes |
| `/api/ocr/batch` | POST | OCR de múltiples imágenes |
| `/api/ocr/capacidades` | GET | Información capacidades OCR |

#### 📚 Documentación (3 endpoints)
| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/docs` | GET | Swagger UI - Interfaz interactiva |
| `/redoc` | GET | ReDoc - Documentación elegante |
| `/api-docs.json` | GET | Especificación OpenAPI 3.0 |

**Total: 20+ endpoints operativos**

### 💡 Ejemplos de Uso

#### Consulta Legal
```bash
curl -X POST http://localhost:8000/api/asistentes/constitucion/consulta \
  -H "Content-Type: application/json" \
  -d '{"mensaje": "¿Cuáles son los derechos fundamentales?"}'
```

#### Análisis de Documentos
```bash
curl -X POST http://localhost:8000/api/asistentes/analisis_documental/consulta \
  -H "Content-Type: application/json" \
  -d '{"mensaje": "Analiza este contrato..."}'
```

#### Búsqueda Web + IA
```bash
curl -X POST http://localhost:8000/api/busqueda \
  -H "Content-Type: application/json" \
  -d '{"query": "nuevas leyes Colombia 2025"}'
```

## 🛠️ Gestión

### Comandos de Administración

```bash
# Estado del servicio
./manage-sre-enhanced.sh status

# Reiniciar servicio
./manage-sre-enhanced.sh restart

# Ver logs
./manage-sre-enhanced.sh logs

# Probar conectividad
./manage-sre-enhanced.sh test

# Pruebas completas
./test-assistants-complete.sh
```

## 🔧 Configuración

### Variables de Entorno

```env
# APIs de IA
OPENAI_API_KEY=tu_openai_key
ANTHROPIC_API_KEY=tu_anthropic_key
GROQ_API_KEY=tu_groq_key
TOGETHER_API_KEY=tu_together_key
# ... más APIs

# Búsqueda web
TAVILY_API_KEY=tu_tavily_key

# Servidor
PORT=8000
NODE_ENV=production
```

### Proveedores Soportados

- **OpenAI**: GPT-4o, GPT-5-nano
- **Anthropic**: Claude 3.5 Sonnet
- **Groq**: Llama 3.1, Mixtral
- **Together AI**: Meta-Llama, Mixtral
- **DeepInfra**: Meta-Llama
- **DeepSeek**: DeepSeek-Chat
- **Mistral**: Mistral-Large
- **Cohere**: Command-R
- **OpenRouter**: Múltiples modelos

## 📊 Estado del Proyecto

### ✅ Completado

- [x] **37 asistentes especializados** integrados
- [x] **9 proveedores de IA** configurados (incluyendo Ollama)
- [x] **API REST completa** (25+ endpoints)
- [x] **OCR avanzado** (Tesseract + OpenAI Vision)
- [x] **Búsqueda web inteligente** (3 proveedores)
- [x] **Documentación interactiva** (Swagger UI + ReDoc + Personalizada)
- [x] **Sistema de recomendaciones** automático
- [x] **Dominio público** configurado (HTTPS + CORS)
- [x] **Scripts de gestión** y pruebas automatizadas
- [x] **Documentación completa** con ejemplos en 5 lenguajes
- [x] **Interfaz CSS personalizada** sin dependencias externas
- [x] **Responsive design** optimizado para móviles

### 🔄 En Desarrollo

- [ ] Interfaz web gráfica
- [ ] Base de datos persistente
- [ ] Sistema de autenticación
- [ ] Métricas avanzadas
- [ ] Integración con N8N

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 👨‍💻 Autor

**Alexander Oviedo Fadul**
- GitHub: [@bladealex9848](https://github.com/bladealex9848)
- LinkedIn: [Alexander Oviedo Fadul](https://www.linkedin.com/in/alexander-oviedo-fadul/)
- Website: [marduk.pro](https://marduk.pro)

## 🙏 Agradecimientos

- OpenAI por los asistentes especializados
- Comunidad de SmythOS
- Contribuidores del proyecto

## 🔧 Troubleshooting

### Problemas Comunes y Soluciones

#### **Interfaz de Documentación no se ve correctamente**
```bash
# Problema: CSS no se carga desde CDN
# Solución: Usar documentación personalizada
https://sre-api.alexanderoviedofadul.dev/docs-ui/
```

#### **API no responde**
```bash
# Verificar estado del servicio
curl https://sre-api.alexanderoviedofadul.dev/api/estado

# Reiniciar servicio si es necesario
/root/manage-sre-enhanced.sh restart
```

#### **OCR no funciona**
```bash
# Verificar capacidades disponibles
curl https://sre-api.alexanderoviedofadul.dev/api/ocr/capacidades

# Formatos soportados: JPG, PNG, GIF, BMP, TIFF, WEBP
```

#### **Búsqueda web sin resultados**
```bash
# Verificar proveedores disponibles
curl https://sre-api.alexanderoviedofadul.dev/api/busqueda/proveedores

# Probar conectividad
curl -X POST https://sre-api.alexanderoviedofadul.dev/api/busqueda/test
```

### Logs y Monitoreo
```bash
# Ver logs del servidor
tail -f /root/logs/sre-enhanced.log

# Verificar procesos activos
ps aux | grep -E "(node|sre)" | grep -v grep

# Probar todos los endpoints
/root/test-api-completa-final.sh
```

## 🆕 Actualizaciones Recientes

### 22/10/2025 - Infraestructura WhatsApp Estabilizada
- ✅ **Problema resuelto**: Actualización Baileys 7.0.0-rc.2 → 7.0.0-rc.6
- ✅ **WhatsApp Multi-Instancia**: Todas las instancias operativas
- ✅ **Conectividad**: 100% funcional para integraciones N8N
- ✅ **Estado**: Sistema completamente estable

## 📞 Soporte

- 📧 Email: alexander.oviedo.fadul@gmail.com
- 💬 Issues: [GitHub Issues](https://github.com/bladealex9848/sre-spanish/issues)
- 📖 Documentación: [DOCUMENTACION-COMPLETA.md](DOCUMENTACION-COMPLETA.md)

---

⭐ **¡Dale una estrella si este proyecto te ayuda!** ⭐
