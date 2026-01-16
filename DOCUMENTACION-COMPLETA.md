# SRE Spanish - Documentación Completa

## Configuración de APIs

Las siguientes APIs están configuradas en el sistema:

### APIs de IA configuradas
- ✅ **37 Asistentes Especializados** en 9 categorías
- ✅ **9 Proveedores de IA** (OpenAI, Anthropic, Groq, Together, etc.)

### Variables de Entorno

Las API keys deben configurarse como variables de entorno:

```env
# APIs de IA (configure sus propias credenciales)
OPENAI_API_KEY=your_openai_api_key_here
ANTHROPIC_API_KEY=your_anthropic_api_key_here
TOGETHER_API_KEY=your_together_api_key_here
GROQ_API_KEY=your_groq_api_key_here
# ... y más APIs

# Búsqueda web
TAVILY_API_KEY=your_tavily_api_key_here
```

> **IMPORTANTE**: Nunca commits API keys reales en el repositorio. Use variables de entorno.

## Arquitectura

Cliente → API REST → Gestor de Proveedores/Asistentes → OpenAI/Otros → Respuesta

