# SmythOS - El Sistema Operativo para IA Agéntica

[![Página Principal](https://img.shields.io/badge/_Página_Principal-SmythOS-green?logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAJHSURBVHgBfVNNqBJRFL7jT1IYCeUqcRG+AsGVFLhIJIIHLVq93MRsSgpTWgRudaELBRctBDeB2qpdohsVdSOKok+eBC4UAiNSKX9440PtzYydM9yJqV4eOPfOvff8fd85Q8jFosElHo8fJhIJN71TgTJkj+CjWj6sVqu2KIo7VBCuUCg8VNj9E0iLSyQSuQmOx7VaLS4IAjqKsJ/jx3K5PKlUKg88Ho/p74ok58lkkkXDTCbziuO4rz9BMDvP898Ain04HL7fUVksFp+SyeS93+mn02kODKXHer3OYmbQTalUeoLveI8VbTabNQ36o1wuH0nOdrtdiw4iBTsYDALtdjuhwCsR2mw22e12e1YsFo/+gGC1WvW0MilALpd7Tg3UCo4kY4vFooOEV5SEq/r9/gqSD8GXASVQ6mXqJCgCiIjE7/e7Op3OWa/Xe03fNRhZo1arb7darRcMwxCDwXCN/EeAAw53m832FpJ+xyCIj8dKHA7HOygv7XQ6ryogCAoI4nq9FiViGKl7N7xer03uJe47t9t9KxwO97vdrlyiigYSG43GS7PZfJcG3OGi0+lOpVM0GrVB74+RRGB6Kw+Rz+e7HovF7sDVBC+CwSC2GNsogH4mcou0Wq0KymP0ej25BDKfz09SqdSzUCj00Wg03gfjc8xqMplwJ3D+wrLsgewvYySBQOAAhufxaDT6QIcHp0sEB348Hldms1k5m80eUh8NuUAkdqrV6iP8gRAKHbBTl8ulUfC196+UiSPpdPppPp9/sy/jL4yPfDIO4aFTAAAAAElFTkSuQmCC&logoWidth=14)](https://smythos.com)
[![Discord](https://img.shields.io/badge/Discord-Únete_al_Chat-5865F2?style=flat-square&logo=discord&logoColor=white)](https://discord.gg/smythos)
[![](https://img.shields.io/badge/📄_Licencia_Código-MIT-green)](https://github.com/SmythOS/sre/blob/main/LICENSE)

Todo lo que necesitas para construir, desplegar y gestionar agentes de IA inteligentes a escala. SmythOS está diseñado con una filosofía inspirada en los kernels de sistemas operativos, asegurando una base robusta y escalable para agentes de IA.

[Documentación SDK](https://smythos.github.io/sre/sdk/) | [Documentación SRE Core](https://smythos.github.io/sre/core/) | [Ejemplos de Código](examples)

## Por qué existe SmythOS

1. Desplegar agentes de IA listos para producción no debería sentirse como ciencia espacial.
2. La autonomía y el control pueden, y deben, coexistir.
3. La seguridad no es un complemento; está integrada.
4. La próxima Internet de Agentes debe mantenerse abierta y accesible para todos.

## Principios de Diseño

SmythOS proporciona un **Sistema Operativo completo para IA Agéntica**. Así como los sistemas operativos tradicionales gestionan recursos y proporcionan APIs para aplicaciones, SmythOS gestiona recursos de IA y proporciona un SDK unificado que funciona desde desarrollo hasta producción.

### Abstracción Unificada de Recursos

SmythOS proporciona una **interfaz unificada para todos los recursos**, asegurando consistencia y simplicidad en toda tu plataforma de IA. Ya sea que estés almacenando un archivo localmente, en S3, o cualquier otro proveedor de almacenamiento, no necesitas preocuparte por los detalles de implementación subyacentes.

Este principio se aplica a **todos los servicios** - no solo almacenamiento. Ya sea que trabajes con VectorDBs, caché (Redis, RAM), LLMs (OpenAI, Anthropic), o cualquier otro recurso, la interfaz permanece consistente entre proveedores.

**Beneficios Clave:**

- **Diseño Centrado en Agentes**: Construido específicamente para cargas de trabajo de agentes de IA
- **Amigable para Desarrolladores**: SDK simple que escala desde desarrollo hasta producción
- **Arquitectura Modular**: Sistema de conectores extensible para cualquier infraestructura
- **Listo para Producción**: Escalable, observable y probado en batalla
- **Seguridad Empresarial**: Control de acceso integrado y gestión segura de credenciales

## Inicio Rápido

### Método 1: Usando el CLI (Recomendado)

Instala el [CLI](packages/cli/) globalmente y crea un nuevo proyecto:

```bash
npm i -g @smythos/cli
sre create
```

### Método 2: Instalación Directa del SDK

Agrega el SDK directamente a tu proyecto existente:

```bash
npm install @smythos/sdk
```

## Estructura del Repositorio

Este monorepo contiene tres paquetes principales:

### SRE (Smyth Runtime Environment) - `packages/core`

El **SRE** es el entorno de ejecución central que impulsa SmythOS. Piénsalo como el kernel del sistema operativo de agentes de IA.

**Características:**

- **Arquitectura Modular**: Conectores enchufables para cada servicio
- **Seguridad Primero**: Sistema Candidate/ACL integrado para acceso seguro a recursos
- **Gestión de Recursos**: Gestión inteligente de memoria, almacenamiento y cómputo
- **Orquestación de Agentes**: Gestión completa del ciclo de vida de agentes
- **40+ Componentes**: Componentes listos para producción

**Conectores Soportados:**

- **Almacenamiento**: Local, S3, Google Cloud, Azure
- **LLM**: OpenAI, Anthropic, Google AI, AWS Bedrock, Groq, Perplexity
- **VectorDB**: Pinecone, Milvus, RAMVec
- **Caché**: RAM, Redis
- **Vault**: Archivo JSON, AWS Secrets Manager, HashiCorp

### SDK - `packages/sdk`

El **SDK** proporciona una capa de abstracción limpia y amigable para desarrolladores sobre el runtime SRE.

### CLI - `packages/cli`

El **SRE CLI** te ayuda a comenzar rápidamente con scaffolding y gestión de proyectos.

## Ejemplos de Código

### Ejemplo 1: Cargar y ejecutar un agente desde archivo .smyth

```typescript
async function main() {
    const agentPath = path.resolve(__dirname, 'mi-agente.smyth');

    // Importando el flujo de trabajo del agente
    const agent = Agent.import(agentPath, {
        model: Model.OpenAI('gpt-4o'),
    });

    // consultar al agente y obtener la respuesta completa
    const result = await agent.prompt('Hola, ¿cómo estás?');

    console.log(result);
}
```

### Ejemplo 2: Agente Escritor de Artículos

```typescript
import { Agent, Model } from '@smythos/sdk';

async function main() {
    // Crear un agente inteligente
    const agent = new Agent({
        name: 'Escritor de Artículos',
        model: 'gpt-4o',
        behavior: 'Eres un asistente de redacción. El usuario proporcionará un tema y tienes que escribir un artículo sobre él y almacenarlo.',
    });

    // Agregar una habilidad personalizada
    agent.addSkill({
        id: 'AgentWriter_001',
        name: 'EscribirYAlmacenarArticulo',
        description: 'Escribe un artículo sobre un tema dado y lo almacena',
        process: async ({ topic }) => {
            // VectorDB - Buscar contexto relevante
            const vec = agent.vectordb.Pinecone({
                namespace: 'miEspacioDeNombres',
                indexName: 'demo-vec',
                pineconeApiKey: process.env.PINECONE_API_KEY,
                embeddings: Model.OpenAI('text-embedding-3-large'),
            });

            const searchResult = await vec.search(topic, {
                topK: 10,
                includeMetadata: true,
            });
            const context = searchResult.map((e) => e?.metadata?.text).join('\n');

            // LLM - Generar el artículo
            const llm = agent.llm.OpenAI('gpt-4o-mini');
            const result = await llm.prompt(`Escribe un artículo sobre ${topic} usando el siguiente contexto: ${context}`);

            // Almacenamiento - Guardar el artículo
            const storage = agent.storage.S3({
                /*... Configuración S3 ...*/
            });
            const uri = await storage.write('articulo.txt', result);

            return `El artículo ha sido generado y almacenado. URI interno: ${uri}`;
        },
    });

    // Usar el agente
    const result = await agent.prompt('Escribe un artículo sobre árboles de Sakura');
    console.log(result);
}

main().catch(console.error);
```

## Características Clave

| Característica | Descripción |
|----------------|-------------|
| **Centrado en Agentes** | Construido específicamente para cargas de trabajo de agentes de IA |
| **Seguro por Defecto** | Seguridad de nivel empresarial con aislamiento de datos |
| **Alto Rendimiento** | Optimizado para operaciones de IA de alto rendimiento |
| **Modular** | Intercambia cualquier componente sin romper tu sistema |
| **Observable** | Herramientas integradas de monitoreo, logging y debugging |
| **Nativo en la Nube** | Funciona en cualquier lugar - local, nube, edge o híbrido |
| **Escalable** | Desde desarrollo hasta producción empresarial |

## Licencia

Este proyecto está licenciado bajo la [Licencia MIT](LICENSE).

---

/smɪθ oʊ ɛs/

Monta la llama. Evita el drama.
