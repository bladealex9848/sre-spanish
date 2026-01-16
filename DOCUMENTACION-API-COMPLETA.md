# 🚀 SmythOS SRE Enhanced - Documentación API Completa

## 📋 Información General

**Base URL**: `https://sre-api.alexanderoviedofadul.dev`  
**Versión**: 1.0.0 Enhanced  
**Protocolo**: HTTPS  
**Formato**: JSON  
**Autenticación**: No requerida para endpoints públicos  

### ✨ Características

- 🤖 **37 Asistentes Especializados** de OpenAI
- 🔗 **10 Proveedores de IA** (OpenAI, Anthropic, Groq, Ollama, etc.)
- 🌐 **API REST** con 20+ endpoints
- 🔍 **Búsqueda web** inteligente
- 🎯 **Sistema de recomendaciones** automático
- ⚖️ **Especialización legal** colombiana

---

## 📊 Endpoints del Sistema

### 1. Estado del Sistema

**Endpoint**: `GET /api/estado`  
**Descripción**: Obtiene el estado completo del sistema, proveedores y asistentes.

#### Respuesta

```json
{
  "exito": true,
  "datos": {
    "version": "1.0.0",
    "estado": "operativo",
    "agentesActivos": 1,
    "proveedoresIA": 10,
    "asistentesEspecializados": 37,
    "categorias": [...],
    "uptime": 1234.56,
    "memoria": {...},
    "timestamp": "2025-08-31T16:17:19.106Z"
  }
}
```

#### Ejemplos de Uso

##### cURL
```bash
curl -X GET "https://sre-api.alexanderoviedofadul.dev/api/estado" \
  -H "Accept: application/json"
```

##### PHP
```php
<?php
$url = "https://sre-api.alexanderoviedofadul.dev/api/estado";

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Accept: application/json'
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode === 200) {
    $data = json_decode($response, true);
    echo "Estado: " . $data['datos']['estado'] . "\n";
    echo "Asistentes: " . $data['datos']['asistentesEspecializados'] . "\n";
} else {
    echo "Error: " . $httpCode . "\n";
}
?>
```

##### Python
```python
import requests
import json

url = "https://sre-api.alexanderoviedofadul.dev/api/estado"

try:
    response = requests.get(url, headers={'Accept': 'application/json'})
    response.raise_for_status()
    
    data = response.json()
    print(f"Estado: {data['datos']['estado']}")
    print(f"Asistentes: {data['datos']['asistentesEspecializados']}")
    print(f"Proveedores IA: {data['datos']['proveedoresIA']}")
    
except requests.exceptions.RequestException as e:
    print(f"Error: {e}")
```

##### React/JavaScript
```javascript
import React, { useState, useEffect } from 'react';

const SystemStatus = () => {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await fetch('https://sre-api.alexanderoviedofadul.dev/api/estado', {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setStatus(data.datos);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
  }, []);

  if (loading) return <div>Cargando estado del sistema...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Estado del Sistema</h2>
      <p>Estado: {status.estado}</p>
      <p>Asistentes Especializados: {status.asistentesEspecializados}</p>
      <p>Proveedores IA: {status.proveedoresIA}</p>
      <p>Uptime: {Math.floor(status.uptime)} segundos</p>
    </div>
  );
};

export default SystemStatus;
```

##### Terminal (usando jq)
```bash
# Estado básico
curl -s "https://sre-api.alexanderoviedofadul.dev/api/estado" | jq '.datos.estado'

# Información de asistentes
curl -s "https://sre-api.alexanderoviedofadul.dev/api/estado" | jq '.datos.asistentesEspecializados'

# Lista de categorías
curl -s "https://sre-api.alexanderoviedofadul.dev/api/estado" | jq '.datos.categorias'

# Información completa formateada
curl -s "https://sre-api.alexanderoviedofadul.dev/api/estado" | jq '{
  estado: .datos.estado,
  version: .datos.version,
  asistentes: .datos.asistentesEspecializados,
  proveedores: .datos.proveedoresIA,
  uptime: .datos.uptime
}'
```

---

### 2. Lista de Proveedores de IA

**Endpoint**: `GET /api/proveedores`  
**Descripción**: Obtiene la lista de todos los proveedores de IA disponibles.

#### Respuesta

```json
{
  "exito": true,
  "datos": [
    {
      "id": "openai",
      "name": "OpenAI",
      "models": ["gpt-5-nano", "gpt-4o"],
      "defaultModel": "gpt-5-nano",
      "status": "disponible",
      "requiresApiKey": true
    },
    {
      "id": "ollama",
      "name": "Ollama",
      "models": ["llama3.2:latest", "qwen2.5:latest", "gemma2:latest"],
      "defaultModel": "llama3.2:latest",
      "status": "disponible",
      "requiresApiKey": false
    }
  ],
  "total": 10
}
```

#### Ejemplos de Uso

##### cURL
```bash
curl -X GET "https://sre-api.alexanderoviedofadul.dev/api/proveedores" \
  -H "Accept: application/json"
```

##### PHP
```php
<?php
$url = "https://sre-api.alexanderoviedofadul.dev/api/proveedores";

$response = file_get_contents($url, false, stream_context_create([
    'http' => [
        'method' => 'GET',
        'header' => 'Accept: application/json'
    ]
]));

$data = json_decode($response, true);

if ($data['exito']) {
    echo "Proveedores disponibles:\n";
    foreach ($data['datos'] as $proveedor) {
        echo "- {$proveedor['name']}: " . count($proveedor['models']) . " modelos\n";
    }
} else {
    echo "Error al obtener proveedores\n";
}
?>
```

##### Python
```python
import requests

def get_providers():
    url = "https://sre-api.alexanderoviedofadul.dev/api/proveedores"
    
    try:
        response = requests.get(url)
        response.raise_for_status()
        
        data = response.json()
        
        if data['exito']:
            print("Proveedores disponibles:")
            for provider in data['datos']:
                print(f"- {provider['name']}: {len(provider['models'])} modelos")
                print(f"  Modelo por defecto: {provider['defaultModel']}")
                print(f"  Requiere API Key: {'Sí' if provider['requiresApiKey'] else 'No'}")
                print()
        
        return data['datos']
        
    except requests.exceptions.RequestException as e:
        print(f"Error: {e}")
        return None

# Uso
providers = get_providers()
```

##### React/JavaScript
```javascript
import React, { useState, useEffect } from 'react';

const ProvidersList = () => {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const response = await fetch('https://sre-api.alexanderoviedofadul.dev/api/proveedores');
        const data = await response.json();
        
        if (data.exito) {
          setProviders(data.datos);
        }
      } catch (error) {
        console.error('Error fetching providers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProviders();
  }, []);

  if (loading) return <div>Cargando proveedores...</div>;

  return (
    <div>
      <h2>Proveedores de IA Disponibles</h2>
      {providers.map(provider => (
        <div key={provider.id} style={{ margin: '10px 0', padding: '10px', border: '1px solid #ccc' }}>
          <h3>{provider.name}</h3>
          <p>Modelos disponibles: {provider.models.length}</p>
          <p>Modelo por defecto: {provider.defaultModel}</p>
          <p>Requiere API Key: {provider.requiresApiKey ? 'Sí' : 'No'}</p>
          <details>
            <summary>Ver modelos</summary>
            <ul>
              {provider.models.map(model => (
                <li key={model}>{model}</li>
              ))}
            </ul>
          </details>
        </div>
      ))}
    </div>
  );
};

export default ProvidersList;
```

##### Terminal
```bash
# Lista simple de proveedores
curl -s "https://sre-api.alexanderoviedofadul.dev/api/proveedores" | jq '.datos[].name'

# Proveedores con conteo de modelos
curl -s "https://sre-api.alexanderoviedofadul.dev/api/proveedores" | jq '.datos[] | {name: .name, models: (.models | length), requiresApiKey: .requiresApiKey}'

# Solo proveedores que no requieren API Key
curl -s "https://sre-api.alexanderoviedofadul.dev/api/proveedores" | jq '.datos[] | select(.requiresApiKey == false) | .name'
```

---

### 3. Lista de Todos los Modelos

**Endpoint**: `GET /api/modelos`  
**Descripción**: Obtiene todos los modelos disponibles de todos los proveedores.

#### Respuesta

```json
{
  "exito": true,
  "datos": [
    {
      "id": "openai:gpt-5-nano",
      "provider": "openai",
      "providerName": "OpenAI",
      "model": "gpt-5-nano",
      "isDefault": true,
      "requiresApiKey": true
    },
    {
      "id": "ollama:llama3.2:latest",
      "provider": "ollama",
      "providerName": "Ollama",
      "model": "llama3.2:latest",
      "isDefault": true,
      "requiresApiKey": false
    }
  ],
  "total": 25
}
```

#### Ejemplos de Uso

##### cURL
```bash
curl -X GET "https://sre-api.alexanderoviedofadul.dev/api/modelos" \
  -H "Accept: application/json"
```

##### PHP
```php
<?php
function getModels() {
    $url = "https://sre-api.alexanderoviedofadul.dev/api/modelos";
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Accept: application/json']);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    if ($httpCode === 200) {
        $data = json_decode($response, true);
        
        if ($data['exito']) {
            echo "Modelos disponibles por proveedor:\n";
            
            $modelsByProvider = [];
            foreach ($data['datos'] as $model) {
                $modelsByProvider[$model['providerName']][] = $model;
            }
            
            foreach ($modelsByProvider as $providerName => $models) {
                echo "\n{$providerName}:\n";
                foreach ($models as $model) {
                    $default = $model['isDefault'] ? ' (por defecto)' : '';
                    echo "  - {$model['model']}{$default}\n";
                }
            }
        }
    }
}

getModels();
?>
```

##### Python
```python
import requests
from collections import defaultdict

def get_models():
    url = "https://sre-api.alexanderoviedofadul.dev/api/modelos"
    
    try:
        response = requests.get(url)
        response.raise_for_status()
        
        data = response.json()
        
        if data['exito']:
            # Agrupar modelos por proveedor
            models_by_provider = defaultdict(list)
            
            for model in data['datos']:
                models_by_provider[model['providerName']].append(model)
            
            print("Modelos disponibles por proveedor:")
            for provider_name, models in models_by_provider.items():
                print(f"\n{provider_name}:")
                for model in models:
                    default = " (por defecto)" if model['isDefault'] else ""
                    api_key = " [Requiere API Key]" if model['requiresApiKey'] else " [Sin API Key]"
                    print(f"  - {model['model']}{default}{api_key}")
            
            return data['datos']
            
    except requests.exceptions.RequestException as e:
        print(f"Error: {e}")
        return None

# Uso
models = get_models()
```

##### React/JavaScript
```javascript
import React, { useState, useEffect } from 'react';

const ModelsList = () => {
  const [models, setModels] = useState([]);
  const [groupedModels, setGroupedModels] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await fetch('https://sre-api.alexanderoviedofadul.dev/api/modelos');
        const data = await response.json();
        
        if (data.exito) {
          setModels(data.datos);
          
          // Agrupar modelos por proveedor
          const grouped = data.datos.reduce((acc, model) => {
            if (!acc[model.providerName]) {
              acc[model.providerName] = [];
            }
            acc[model.providerName].push(model);
            return acc;
          }, {});
          
          setGroupedModels(grouped);
        }
      } catch (error) {
        console.error('Error fetching models:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchModels();
  }, []);

  if (loading) return <div>Cargando modelos...</div>;

  return (
    <div>
      <h2>Modelos Disponibles ({models.length} total)</h2>
      {Object.entries(groupedModels).map(([providerName, providerModels]) => (
        <div key={providerName} style={{ margin: '20px 0' }}>
          <h3>{providerName} ({providerModels.length} modelos)</h3>
          <ul>
            {providerModels.map(model => (
              <li key={model.id} style={{ margin: '5px 0' }}>
                <strong>{model.model}</strong>
                {model.isDefault && <span style={{ color: 'green' }}> (Por defecto)</span>}
                {model.requiresApiKey && <span style={{ color: 'orange' }}> [API Key requerida]</span>}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default ModelsList;
```

##### Terminal
```bash
# Lista simple de todos los modelos
curl -s "https://sre-api.alexanderoviedofadul.dev/api/modelos" | jq '.datos[].model'

# Modelos agrupados por proveedor
curl -s "https://sre-api.alexanderoviedofadul.dev/api/modelos" | jq 'group_by(.providerName) | .[] | {provider: .[0].providerName, models: [.[].model]}'

# Solo modelos que no requieren API Key
curl -s "https://sre-api.alexanderoviedofadul.dev/api/modelos" | jq '.datos[] | select(.requiresApiKey == false) | {provider: .providerName, model: .model}'

# Modelos por defecto de cada proveedor
curl -s "https://sre-api.alexanderoviedofadul.dev/api/modelos" | jq '.datos[] | select(.isDefault == true) | {provider: .providerName, model: .model}'
```

---

## 🤖 Endpoints de Asistentes Especializados

### 4. Lista de Asistentes Especializados

**Endpoint**: `GET /api/asistentes`
**Descripción**: Obtiene la lista completa de los 37 asistentes especializados disponibles.

#### Respuesta

```json
{
  "exito": true,
  "datos": [
    {
      "id": "constitucion",
      "assistantId": "asst_gpCZlh5HpWgGAjHqbzFaaVpp",
      "titulo": "Experto en Constitución Colombiana",
      "descripcion": "Autoridad en derechos fundamentales y normativa constitucional",
      "categoria": "legal",
      "especialidad": "derecho_constitucional"
    },
    {
      "id": "tutela",
      "assistantId": "asst_xisQZwJ1bbmvXET8YG0eiAmb",
      "titulo": "TutelaBot - Asistente Especializado en Acción de Tutela",
      "descripcion": "Experto en mecanismos constitucionales de protección de derechos",
      "categoria": "legal",
      "especialidad": "tutela"
    }
  ],
  "total": 37
}
```

#### Ejemplos de Uso

##### cURL
```bash
curl -X GET "https://sre-api.alexanderoviedofadul.dev/api/asistentes" \
  -H "Accept: application/json"
```

##### PHP
```php
<?php
function getAssistants() {
    $url = "https://sre-api.alexanderoviedofadul.dev/api/asistentes";

    $response = file_get_contents($url, false, stream_context_create([
        'http' => [
            'method' => 'GET',
            'header' => 'Accept: application/json'
        ]
    ]));

    $data = json_decode($response, true);

    if ($data['exito']) {
        echo "Asistentes especializados disponibles ({$data['total']}):\n\n";

        // Agrupar por categoría
        $assistantsByCategory = [];
        foreach ($data['datos'] as $assistant) {
            $assistantsByCategory[$assistant['categoria']][] = $assistant;
        }

        foreach ($assistantsByCategory as $category => $assistants) {
            echo strtoupper($category) . " (" . count($assistants) . " asistentes):\n";
            foreach ($assistants as $assistant) {
                echo "  - {$assistant['titulo']}\n";
                echo "    ID: {$assistant['id']}\n";
                echo "    Especialidad: {$assistant['especialidad']}\n\n";
            }
        }
    }
}

getAssistants();
?>
```

##### Python
```python
import requests
from collections import defaultdict

def get_assistants():
    url = "https://sre-api.alexanderoviedofadul.dev/api/asistentes"

    try:
        response = requests.get(url)
        response.raise_for_status()

        data = response.json()

        if data['exito']:
            assistants = data['datos']

            # Agrupar por categoría
            assistants_by_category = defaultdict(list)
            for assistant in assistants:
                assistants_by_category[assistant['categoria']].append(assistant)

            print(f"Asistentes especializados disponibles ({data['total']}):\n")

            for category, category_assistants in assistants_by_category.items():
                print(f"{category.upper()} ({len(category_assistants)} asistentes):")
                for assistant in category_assistants:
                    print(f"  - {assistant['titulo']}")
                    print(f"    ID: {assistant['id']}")
                    print(f"    Especialidad: {assistant['especialidad']}")
                    print()

            return assistants

    except requests.exceptions.RequestException as e:
        print(f"Error: {e}")
        return None

# Uso
assistants = get_assistants()
```

##### React/JavaScript
```javascript
import React, { useState, useEffect } from 'react';

const AssistantsList = () => {
  const [assistants, setAssistants] = useState([]);
  const [groupedAssistants, setGroupedAssistants] = useState({});
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssistants = async () => {
      try {
        const response = await fetch('https://sre-api.alexanderoviedofadul.dev/api/asistentes');
        const data = await response.json();

        if (data.exito) {
          setAssistants(data.datos);

          // Agrupar por categoría
          const grouped = data.datos.reduce((acc, assistant) => {
            if (!acc[assistant.categoria]) {
              acc[assistant.categoria] = [];
            }
            acc[assistant.categoria].push(assistant);
            return acc;
          }, {});

          setGroupedAssistants(grouped);
        }
      } catch (error) {
        console.error('Error fetching assistants:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAssistants();
  }, []);

  if (loading) return <div>Cargando asistentes...</div>;

  const categories = Object.keys(groupedAssistants);
  const displayAssistants = selectedCategory === 'all'
    ? assistants
    : groupedAssistants[selectedCategory] || [];

  return (
    <div>
      <h2>Asistentes Especializados ({assistants.length} total)</h2>

      {/* Filtro por categoría */}
      <div style={{ margin: '20px 0' }}>
        <label>Filtrar por categoría: </label>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="all">Todas las categorías</option>
          {categories.map(category => (
            <option key={category} value={category}>
              {category} ({groupedAssistants[category].length})
            </option>
          ))}
        </select>
      </div>

      {/* Lista de asistentes */}
      <div>
        {displayAssistants.map(assistant => (
          <div key={assistant.id} style={{
            margin: '10px 0',
            padding: '15px',
            border: '1px solid #ddd',
            borderRadius: '5px'
          }}>
            <h3>{assistant.titulo}</h3>
            <p><strong>ID:</strong> {assistant.id}</p>
            <p><strong>Categoría:</strong> {assistant.categoria}</p>
            <p><strong>Especialidad:</strong> {assistant.especialidad}</p>
            <p><strong>Descripción:</strong> {assistant.descripcion}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AssistantsList;
```

##### Terminal
```bash
# Lista simple de asistentes
curl -s "https://sre-api.alexanderoviedofadul.dev/api/asistentes" | jq '.datos[].titulo'

# Asistentes por categoría
curl -s "https://sre-api.alexanderoviedofadul.dev/api/asistentes" | jq 'group_by(.categoria) | .[] | {categoria: .[0].categoria, cantidad: length, asistentes: [.[].titulo]}'

# Solo asistentes legales
curl -s "https://sre-api.alexanderoviedofadul.dev/api/asistentes" | jq '.datos[] | select(.categoria == "legal") | {id: .id, titulo: .titulo}'

# Buscar asistente específico
curl -s "https://sre-api.alexanderoviedofadul.dev/api/asistentes" | jq '.datos[] | select(.id == "tutela")'
```

---

### 5. Categorías de Asistentes

**Endpoint**: `GET /api/asistentes/categorias`
**Descripción**: Obtiene las categorías disponibles de asistentes especializados.

#### Respuesta

```json
{
  "exito": true,
  "datos": [
    {
      "categoria": "legal",
      "cantidad": 21
    },
    {
      "categoria": "tecnologia",
      "cantidad": 3
    },
    {
      "categoria": "educacion",
      "cantidad": 3
    }
  ],
  "total": 9
}
```

#### Ejemplos de Uso

##### cURL
```bash
curl -X GET "https://sre-api.alexanderoviedofadul.dev/api/asistentes/categorias" \
  -H "Accept: application/json"
```

##### PHP
```php
<?php
$url = "https://sre-api.alexanderoviedofadul.dev/api/asistentes/categorias";
$response = file_get_contents($url);
$data = json_decode($response, true);

if ($data['exito']) {
    echo "Categorías de asistentes:\n";
    foreach ($data['datos'] as $categoria) {
        echo "- {$categoria['categoria']}: {$categoria['cantidad']} asistentes\n";
    }
}
?>
```

##### Python
```python
import requests

def get_categories():
    url = "https://sre-api.alexanderoviedofadul.dev/api/asistentes/categorias"

    try:
        response = requests.get(url)
        response.raise_for_status()

        data = response.json()

        if data['exito']:
            print("Categorías de asistentes:")
            for category in data['datos']:
                print(f"- {category['categoria']}: {category['cantidad']} asistentes")

            return data['datos']

    except requests.exceptions.RequestException as e:
        print(f"Error: {e}")
        return None

categories = get_categories()
```

##### React/JavaScript
```javascript
import React, { useState, useEffect } from 'react';

const CategoriesList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('https://sre-api.alexanderoviedofadul.dev/api/asistentes/categorias');
        const data = await response.json();

        if (data.exito) {
          setCategories(data.datos);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) return <div>Cargando categorías...</div>;

  return (
    <div>
      <h2>Categorías de Asistentes</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
        {categories.map(category => (
          <div key={category.categoria} style={{
            padding: '15px',
            border: '1px solid #ccc',
            borderRadius: '5px',
            textAlign: 'center'
          }}>
            <h3>{category.categoria}</h3>
            <p>{category.cantidad} asistentes</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoriesList;
```

##### Terminal
```bash
# Lista simple de categorías
curl -s "https://sre-api.alexanderoviedofadul.dev/api/asistentes/categorias" | jq '.datos[].categoria'

# Categorías con cantidad
curl -s "https://sre-api.alexanderoviedofadul.dev/api/asistentes/categorias" | jq '.datos[] | "\(.categoria): \(.cantidad) asistentes"'

# Categoría con más asistentes
curl -s "https://sre-api.alexanderoviedofadul.dev/api/asistentes/categorias" | jq '.datos | max_by(.cantidad)'
```

---

### 6. Asistentes por Categoría

**Endpoint**: `GET /api/asistentes/categoria/{categoria}`
**Descripción**: Obtiene todos los asistentes de una categoría específica.

#### Parámetros de URL

- `categoria` (string): Nombre de la categoría (legal, tecnologia, educacion, etc.)

#### Respuesta

```json
{
  "exito": true,
  "datos": [
    {
      "id": "constitucion",
      "assistantId": "asst_gpCZlh5HpWgGAjHqbzFaaVpp",
      "titulo": "Experto en Constitución Colombiana",
      "descripcion": "Autoridad en derechos fundamentales y normativa constitucional",
      "especialidad": "derecho_constitucional"
    }
  ],
  "categoria": "legal",
  "total": 21
}
```

#### Ejemplos de Uso

##### cURL
```bash
# Asistentes legales
curl -X GET "https://sre-api.alexanderoviedofadul.dev/api/asistentes/categoria/legal" \
  -H "Accept: application/json"

# Asistentes de tecnología
curl -X GET "https://sre-api.alexanderoviedofadul.dev/api/asistentes/categoria/tecnologia" \
  -H "Accept: application/json"
```

##### PHP
```php
<?php
function getAssistantsByCategory($category) {
    $url = "https://sre-api.alexanderoviedofadul.dev/api/asistentes/categoria/" . urlencode($category);

    $response = file_get_contents($url, false, stream_context_create([
        'http' => [
            'method' => 'GET',
            'header' => 'Accept: application/json'
        ]
    ]));

    $data = json_decode($response, true);

    if ($data['exito']) {
        echo "Asistentes de {$data['categoria']} ({$data['total']}):\n";
        foreach ($data['datos'] as $assistant) {
            echo "- {$assistant['titulo']}\n";
            echo "  ID: {$assistant['id']}\n";
            echo "  Especialidad: {$assistant['especialidad']}\n\n";
        }

        return $data['datos'];
    }

    return null;
}

// Ejemplos de uso
$legalAssistants = getAssistantsByCategory('legal');
$techAssistants = getAssistantsByCategory('tecnologia');
?>
```

##### Python
```python
import requests

def get_assistants_by_category(category):
    url = f"https://sre-api.alexanderoviedofadul.dev/api/asistentes/categoria/{category}"

    try:
        response = requests.get(url)
        response.raise_for_status()

        data = response.json()

        if data['exito']:
            print(f"Asistentes de {data['categoria']} ({data['total']}):")
            for assistant in data['datos']:
                print(f"- {assistant['titulo']}")
                print(f"  ID: {assistant['id']}")
                print(f"  Especialidad: {assistant['especialidad']}")
                print()

            return data['datos']

    except requests.exceptions.RequestException as e:
        print(f"Error: {e}")
        return None

# Ejemplos de uso
legal_assistants = get_assistants_by_category('legal')
tech_assistants = get_assistants_by_category('tecnologia')
education_assistants = get_assistants_by_category('educacion')
```

##### React/JavaScript
```javascript
import React, { useState, useEffect } from 'react';

const AssistantsByCategory = ({ category }) => {
  const [assistants, setAssistants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAssistants = async () => {
      if (!category) return;

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`https://sre-api.alexanderoviedofadul.dev/api/asistentes/categoria/${category}`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.exito) {
          setAssistants(data.datos);
        } else {
          setError('Error al obtener asistentes');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAssistants();
  }, [category]);

  if (loading) return <div>Cargando asistentes de {category}...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Asistentes de {category} ({assistants.length})</h2>
      <div>
        {assistants.map(assistant => (
          <div key={assistant.id} style={{
            margin: '10px 0',
            padding: '15px',
            border: '1px solid #ddd',
            borderRadius: '5px'
          }}>
            <h3>{assistant.titulo}</h3>
            <p><strong>ID:</strong> {assistant.id}</p>
            <p><strong>Especialidad:</strong> {assistant.especialidad}</p>
            <p><strong>Descripción:</strong> {assistant.descripcion}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// Componente de ejemplo con selector de categoría
const CategorySelector = () => {
  const [selectedCategory, setSelectedCategory] = useState('legal');
  const categories = ['legal', 'tecnologia', 'educacion', 'comunicacion', 'documentos', 'salud', 'finanzas', 'bienestar', 'general'];

  return (
    <div>
      <div style={{ margin: '20px 0' }}>
        <label>Seleccionar categoría: </label>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>

      <AssistantsByCategory category={selectedCategory} />
    </div>
  );
};

export default CategorySelector;
```

##### Terminal
```bash
# Asistentes legales
curl -s "https://sre-api.alexanderoviedofadul.dev/api/asistentes/categoria/legal" | jq '.datos[].titulo'

# Contar asistentes por categoría
for categoria in legal tecnologia educacion comunicacion documentos; do
  count=$(curl -s "https://sre-api.alexanderoviedofadul.dev/api/asistentes/categoria/$categoria" | jq '.total')
  echo "$categoria: $count asistentes"
done

# Obtener IDs de asistentes legales
curl -s "https://sre-api.alexanderoviedofadul.dev/api/asistentes/categoria/legal" | jq '.datos[].id'
```

---

### 7. Búsqueda de Asistentes

**Endpoint**: `POST /api/asistentes/buscar`
**Descripción**: Busca asistentes por especialidad, título o descripción.

#### Cuerpo de la Petición

```json
{
  "query": "tutela"
}
```

#### Respuesta

```json
{
  "exito": true,
  "datos": [
    {
      "id": "tutela",
      "assistantId": "asst_xisQZwJ1bbmvXET8YG0eiAmb",
      "titulo": "TutelaBot - Asistente Especializado en Acción de Tutela",
      "descripcion": "Experto en mecanismos constitucionales de protección de derechos",
      "categoria": "legal",
      "especialidad": "tutela"
    }
  ],
  "consulta": "tutela",
  "total": 1
}
```

#### Ejemplos de Uso

##### cURL
```bash
curl -X POST "https://sre-api.alexanderoviedofadul.dev/api/asistentes/buscar" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{"query": "tutela"}'

# Buscar asistentes de familia
curl -X POST "https://sre-api.alexanderoviedofadul.dev/api/asistentes/buscar" \
  -H "Content-Type: application/json" \
  -d '{"query": "familia"}'

# Buscar asistentes de documentos
curl -X POST "https://sre-api.alexanderoviedofadul.dev/api/asistentes/buscar" \
  -H "Content-Type: application/json" \
  -d '{"query": "documento"}'
```

##### PHP
```php
<?php
function searchAssistants($query) {
    $url = "https://sre-api.alexanderoviedofadul.dev/api/asistentes/buscar";

    $data = json_encode(['query' => $query]);

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json',
        'Accept: application/json'
    ]);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($httpCode === 200) {
        $result = json_decode($response, true);

        if ($result['exito']) {
            echo "Resultados para '{$result['consulta']}' ({$result['total']} encontrados):\n";

            foreach ($result['datos'] as $assistant) {
                echo "- {$assistant['titulo']}\n";
                echo "  ID: {$assistant['id']}\n";
                echo "  Categoría: {$assistant['categoria']}\n";
                echo "  Especialidad: {$assistant['especialidad']}\n\n";
            }

            return $result['datos'];
        }
    }

    return null;
}

// Ejemplos de uso
$tutelaAssistants = searchAssistants('tutela');
$familyAssistants = searchAssistants('familia');
$documentAssistants = searchAssistants('documento');
?>
```

##### Python
```python
import requests
import json

def search_assistants(query):
    url = "https://sre-api.alexanderoviedofadul.dev/api/asistentes/buscar"

    payload = {"query": query}
    headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }

    try:
        response = requests.post(url, json=payload, headers=headers)
        response.raise_for_status()

        data = response.json()

        if data['exito']:
            print(f"Resultados para '{data['consulta']}' ({data['total']} encontrados):")

            for assistant in data['datos']:
                print(f"- {assistant['titulo']}")
                print(f"  ID: {assistant['id']}")
                print(f"  Categoría: {assistant['categoria']}")
                print(f"  Especialidad: {assistant['especialidad']}")
                print()

            return data['datos']

    except requests.exceptions.RequestException as e:
        print(f"Error: {e}")
        return None

# Ejemplos de uso
tutela_assistants = search_assistants('tutela')
family_assistants = search_assistants('familia')
constitution_assistants = search_assistants('constitución')
document_assistants = search_assistants('documento')
```

##### React/JavaScript
```javascript
import React, { useState } from 'react';

const AssistantSearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchAssistants = async (searchQuery) => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('https://sre-api.alexanderoviedofadul.dev/api/asistentes/buscar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ query: searchQuery }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.exito) {
        setResults(data.datos);
      } else {
        setError('Error en la búsqueda');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    searchAssistants(query);
  };

  const quickSearches = ['tutela', 'familia', 'constitución', 'documento', 'tributario'];

  return (
    <div>
      <h2>Búsqueda de Asistentes Especializados</h2>

      <form onSubmit={handleSubmit} style={{ margin: '20px 0' }}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar asistentes..."
          style={{ padding: '10px', width: '300px', marginRight: '10px' }}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Buscando...' : 'Buscar'}
        </button>
      </form>

      {/* Búsquedas rápidas */}
      <div style={{ margin: '10px 0' }}>
        <span>Búsquedas rápidas: </span>
        {quickSearches.map(term => (
          <button
            key={term}
            onClick={() => {
              setQuery(term);
              searchAssistants(term);
            }}
            style={{ margin: '0 5px', padding: '5px 10px' }}
          >
            {term}
          </button>
        ))}
      </div>

      {error && <div style={{ color: 'red' }}>Error: {error}</div>}

      {results.length > 0 && (
        <div>
          <h3>Resultados ({results.length})</h3>
          {results.map(assistant => (
            <div key={assistant.id} style={{
              margin: '10px 0',
              padding: '15px',
              border: '1px solid #ddd',
              borderRadius: '5px'
            }}>
              <h4>{assistant.titulo}</h4>
              <p><strong>ID:</strong> {assistant.id}</p>
              <p><strong>Categoría:</strong> {assistant.categoria}</p>
              <p><strong>Especialidad:</strong> {assistant.especialidad}</p>
              <p><strong>Descripción:</strong> {assistant.descripcion}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AssistantSearch;
```

##### Terminal
```bash
# Búsqueda simple
curl -s -X POST "https://sre-api.alexanderoviedofadul.dev/api/asistentes/buscar" \
  -H "Content-Type: application/json" \
  -d '{"query": "tutela"}' | jq '.datos[].titulo'

# Búsquedas múltiples
for term in tutela familia constitución documento tributario; do
  echo "=== Búsqueda: $term ==="
  curl -s -X POST "https://sre-api.alexanderoviedofadul.dev/api/asistentes/buscar" \
    -H "Content-Type: application/json" \
    -d "{\"query\": \"$term\"}" | jq '.datos[] | {id: .id, titulo: .titulo}'
  echo
done
```

---

### 8. Consultar Asistente Especializado

**Endpoint**: `POST /api/asistentes/{id}/consulta`
**Descripción**: Envía una consulta a un asistente especializado específico.

#### Parámetros de URL

- `id` (string): ID del asistente (ej: "tutela", "constitucion", "familiabot")

#### Cuerpo de la Petición

```json
{
  "mensaje": "¿Cuáles son los requisitos para presentar una tutela?",
  "threadId": "thread_abc123" // Opcional, para continuar conversación
}
```

#### Respuesta

```json
{
  "exito": true,
  "datos": {
    "respuesta": "Para presentar una acción de tutela en Colombia, se requieren los siguientes elementos...",
    "threadId": "thread_abc123",
    "asistente": {
      "id": "tutela",
      "titulo": "TutelaBot - Asistente Especializado en Acción de Tutela",
      "categoria": "legal"
    },
    "timestamp": "2025-08-31T16:17:19.106Z"
  }
}
```

#### Ejemplos de Uso

##### cURL
```bash
# Consulta sobre tutela
curl -X POST "https://sre-api.alexanderoviedofadul.dev/api/asistentes/tutela/consulta" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "mensaje": "¿Cuáles son los requisitos para presentar una tutela?"
  }'

# Consulta sobre constitución
curl -X POST "https://sre-api.alexanderoviedofadul.dev/api/asistentes/constitucion/consulta" \
  -H "Content-Type: application/json" \
  -d '{
    "mensaje": "¿Cuáles son los derechos fundamentales en Colombia?"
  }'

# Consulta sobre derecho de familia
curl -X POST "https://sre-api.alexanderoviedofadul.dev/api/asistentes/familiabot/consulta" \
  -H "Content-Type: application/json" \
  -d '{
    "mensaje": "¿Cómo se tramita un divorcio en Colombia?"
  }'
```

##### PHP
```php
<?php
function consultAssistant($assistantId, $message, $threadId = null) {
    $url = "https://sre-api.alexanderoviedofadul.dev/api/asistentes/{$assistantId}/consulta";

    $payload = ['mensaje' => $message];
    if ($threadId) {
        $payload['threadId'] = $threadId;
    }

    $data = json_encode($payload);

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 60); // 60 segundos timeout
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json',
        'Accept: application/json'
    ]);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($httpCode === 200) {
        $result = json_decode($response, true);

        if ($result['exito']) {
            echo "Consulta a {$result['datos']['asistente']['titulo']}:\n";
            echo "Pregunta: {$message}\n";
            echo "Respuesta: {$result['datos']['respuesta']}\n";
            echo "Thread ID: {$result['datos']['threadId']}\n\n";

            return $result['datos'];
        } else {
            echo "Error: {$result['mensaje']}\n";
        }
    } else {
        echo "Error HTTP: {$httpCode}\n";
    }

    return null;
}

// Ejemplos de uso
$tutelaResponse = consultAssistant('tutela', '¿Cuáles son los requisitos para presentar una tutela?');
$constitutionResponse = consultAssistant('constitucion', '¿Cuáles son los derechos fundamentales en Colombia?');
$familyResponse = consultAssistant('familiabot', '¿Cómo se tramita un divorcio en Colombia?');

// Continuar conversación usando threadId
if ($tutelaResponse && isset($tutelaResponse['threadId'])) {
    $followUp = consultAssistant('tutela', '¿Cuánto tiempo tengo para presentarla?', $tutelaResponse['threadId']);
}
?>
```

##### Python
```python
import requests
import json
import time

def consult_assistant(assistant_id, message, thread_id=None):
    url = f"https://sre-api.alexanderoviedofadul.dev/api/asistentes/{assistant_id}/consulta"

    payload = {"mensaje": message}
    if thread_id:
        payload["threadId"] = thread_id

    headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }

    try:
        response = requests.post(url, json=payload, headers=headers, timeout=60)
        response.raise_for_status()

        data = response.json()

        if data['exito']:
            print(f"Consulta a {data['datos']['asistente']['titulo']}:")
            print(f"Pregunta: {message}")
            print(f"Respuesta: {data['datos']['respuesta']}")
            print(f"Thread ID: {data['datos']['threadId']}")
            print()

            return data['datos']
        else:
            print(f"Error: {data.get('mensaje', 'Error desconocido')}")

    except requests.exceptions.RequestException as e:
        print(f"Error: {e}")
        return None

# Ejemplos de uso
tutela_response = consult_assistant('tutela', '¿Cuáles son los requisitos para presentar una tutela?')
constitution_response = consult_assistant('constitucion', '¿Cuáles son los derechos fundamentales en Colombia?')
family_response = consult_assistant('familiabot', '¿Cómo se tramita un divorcio en Colombia?')

# Continuar conversación
if tutela_response and 'threadId' in tutela_response:
    follow_up = consult_assistant('tutela', '¿Cuánto tiempo tengo para presentarla?', tutela_response['threadId'])

# Función para múltiples consultas
def multiple_consultations():
    consultations = [
        ('tutela', '¿Qué es una acción de tutela?'),
        ('constitucion', '¿Qué es el debido proceso?'),
        ('familiabot', '¿Qué es la patria potestad?'),
        ('tributaria', '¿Cuáles son las obligaciones tributarias de una empresa?'),
        ('analisis_documental', 'Analiza este contrato de prestación de servicios')
    ]

    results = []
    for assistant_id, question in consultations:
        print(f"Consultando a {assistant_id}...")
        result = consult_assistant(assistant_id, question)
        if result:
            results.append(result)
        time.sleep(2)  # Pausa entre consultas

    return results

# Ejecutar múltiples consultas
# results = multiple_consultations()
```

##### React/JavaScript
```javascript
import React, { useState } from 'react';

const AssistantConsultation = () => {
  const [selectedAssistant, setSelectedAssistant] = useState('tutela');
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState([]);
  const [loading, setLoading] = useState(false);
  const [threadId, setThreadId] = useState(null);

  const assistants = [
    { id: 'tutela', name: 'TutelaBot - Acciones de Tutela' },
    { id: 'constitucion', name: 'Experto en Constitución' },
    { id: 'familiabot', name: 'FamiliaBot - Derecho de Familia' },
    { id: 'tributaria', name: 'Guía Tributaria' },
    { id: 'analisis_documental', name: 'Análisis Documental' },
    { id: 'juris_integral', name: 'JURIS-INTEGRAL' }
  ];

  const consultAssistant = async (assistantId, userMessage, currentThreadId = null) => {
    setLoading(true);

    try {
      const payload = { mensaje: userMessage };
      if (currentThreadId) {
        payload.threadId = currentThreadId;
      }

      const response = await fetch(`https://sre-api.alexanderoviedofadul.dev/api/asistentes/${assistantId}/consulta`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.exito) {
        // Agregar pregunta y respuesta a la conversación
        const newMessages = [
          {
            type: 'user',
            content: userMessage,
            timestamp: new Date().toISOString()
          },
          {
            type: 'assistant',
            content: data.datos.respuesta,
            assistant: data.datos.asistente,
            timestamp: data.datos.timestamp
          }
        ];

        setConversation(prev => [...prev, ...newMessages]);
        setThreadId(data.datos.threadId);
        setMessage('');
      } else {
        throw new Error(data.mensaje || 'Error en la consulta');
      }
    } catch (error) {
      console.error('Error:', error);
      setConversation(prev => [...prev, {
        type: 'error',
        content: `Error: ${error.message}`,
        timestamp: new Date().toISOString()
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      consultAssistant(selectedAssistant, message, threadId);
    }
  };

  const clearConversation = () => {
    setConversation([]);
    setThreadId(null);
  };

  const quickQuestions = {
    tutela: [
      '¿Qué es una acción de tutela?',
      '¿Cuáles son los requisitos para presentar una tutela?',
      '¿Cuánto tiempo tengo para presentar una tutela?'
    ],
    constitucion: [
      '¿Cuáles son los derechos fundamentales?',
      '¿Qué es el debido proceso?',
      '¿Qué es la igualdad ante la ley?'
    ],
    familiabot: [
      '¿Cómo se tramita un divorcio?',
      '¿Qué es la patria potestad?',
      '¿Cómo se establece la custodia?'
    ]
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h2>Consulta a Asistentes Especializados</h2>

      {/* Selector de asistente */}
      <div style={{ margin: '20px 0' }}>
        <label>Seleccionar asistente: </label>
        <select
          value={selectedAssistant}
          onChange={(e) => {
            setSelectedAssistant(e.target.value);
            clearConversation();
          }}
        >
          {assistants.map(assistant => (
            <option key={assistant.id} value={assistant.id}>
              {assistant.name}
            </option>
          ))}
        </select>
        <button onClick={clearConversation} style={{ marginLeft: '10px' }}>
          Nueva Conversación
        </button>
      </div>

      {/* Preguntas rápidas */}
      {quickQuestions[selectedAssistant] && (
        <div style={{ margin: '10px 0' }}>
          <span>Preguntas rápidas: </span>
          {quickQuestions[selectedAssistant].map((question, index) => (
            <button
              key={index}
              onClick={() => setMessage(question)}
              style={{ margin: '2px', padding: '5px 10px', fontSize: '12px' }}
            >
              {question}
            </button>
          ))}
        </div>
      )}

      {/* Conversación */}
      <div style={{
        height: '400px',
        overflowY: 'auto',
        border: '1px solid #ccc',
        padding: '10px',
        marginBottom: '20px',
        backgroundColor: '#f9f9f9'
      }}>
        {conversation.length === 0 ? (
          <p style={{ color: '#666' }}>Inicia una conversación con el asistente seleccionado...</p>
        ) : (
          conversation.map((msg, index) => (
            <div key={index} style={{
              margin: '10px 0',
              padding: '10px',
              backgroundColor: msg.type === 'user' ? '#e3f2fd' : msg.type === 'error' ? '#ffebee' : '#f1f8e9',
              borderRadius: '5px'
            }}>
              <strong>
                {msg.type === 'user' ? 'Tú' : msg.type === 'error' ? 'Error' : msg.assistant?.titulo || 'Asistente'}:
              </strong>
              <p style={{ margin: '5px 0' }}>{msg.content}</p>
              <small style={{ color: '#666' }}>
                {new Date(msg.timestamp).toLocaleString()}
              </small>
            </div>
          ))
        )}
      </div>

      {/* Formulario de consulta */}
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Escribe tu consulta..."
            style={{ flex: 1, padding: '10px' }}
            disabled={loading}
          />
          <button type="submit" disabled={loading || !message.trim()}>
            {loading ? 'Consultando...' : 'Enviar'}
          </button>
        </div>
      </form>

      {threadId && (
        <p style={{ fontSize: '12px', color: '#666', marginTop: '10px' }}>
          Thread ID: {threadId}
        </p>
      )}
    </div>
  );
};

export default AssistantConsultation;
```

##### Terminal
```bash
# Consulta simple
curl -s -X POST "https://sre-api.alexanderoviedofadul.dev/api/asistentes/tutela/consulta" \
  -H "Content-Type: application/json" \
  -d '{"mensaje": "¿Qué es una acción de tutela?"}' | jq '.datos.respuesta'

# Múltiples consultas con diferentes asistentes
declare -A consultas=(
  ["tutela"]="¿Cuáles son los requisitos para presentar una tutela?"
  ["constitucion"]="¿Cuáles son los derechos fundamentales en Colombia?"
  ["familiabot"]="¿Cómo se tramita un divorcio en Colombia?"
  ["tributaria"]="¿Cuáles son las obligaciones tributarias de una empresa?"
)

for asistente in "${!consultas[@]}"; do
  echo "=== Consultando a $asistente ==="
  curl -s -X POST "https://sre-api.alexanderoviedofadul.dev/api/asistentes/$asistente/consulta" \
    -H "Content-Type: application/json" \
    -d "{\"mensaje\": \"${consultas[$asistente]}\"}" | \
    jq -r '.datos | "Asistente: " + .asistente.titulo + "\nRespuesta: " + .respuesta + "\n"'
  echo
done

# Guardar thread ID para continuar conversación
THREAD_ID=$(curl -s -X POST "https://sre-api.alexanderoviedofadul.dev/api/asistentes/tutela/consulta" \
  -H "Content-Type: application/json" \
  -d '{"mensaje": "¿Qué es una tutela?"}' | jq -r '.datos.threadId')

echo "Thread ID: $THREAD_ID"

# Continuar conversación
curl -s -X POST "https://sre-api.alexanderoviedofadul.dev/api/asistentes/tutela/consulta" \
  -H "Content-Type: application/json" \
  -d "{\"mensaje\": \"¿Cuánto tiempo tengo para presentarla?\", \"threadId\": \"$THREAD_ID\"}" | \
  jq -r '.datos.respuesta'
```

---

### 9. Sistema de Recomendaciones

**Endpoint**: `POST /api/asistentes/recomendacion`
**Descripción**: Obtiene una recomendación automática del mejor asistente para una consulta específica.

#### Cuerpo de la Petición

```json
{
  "consulta": "Necesito ayuda con una acción de tutela"
}
```

#### Respuesta

```json
{
  "exito": true,
  "datos": {
    "asistente": {
      "id": "tutela",
      "titulo": "TutelaBot - Asistente Especializado en Acción de Tutela",
      "descripcion": "Experto en mecanismos constitucionales de protección de derechos",
      "categoria": "legal"
    },
    "recomendado": true,
    "razon": "Detectada palabra clave: \"tutela\"",
    "consulta": "Necesito ayuda con una acción de tutela"
  }
}
```

#### Ejemplos de Uso

##### cURL
```bash
# Recomendación para tutela
curl -X POST "https://sre-api.alexanderoviedofadul.dev/api/asistentes/recomendacion" \
  -H "Content-Type: application/json" \
  -d '{"consulta": "Necesito ayuda con una acción de tutela"}'

# Recomendación para familia
curl -X POST "https://sre-api.alexanderoviedofadul.dev/api/asistentes/recomendacion" \
  -H "Content-Type: application/json" \
  -d '{"consulta": "Tengo problemas con mi divorcio"}'

# Recomendación para constitución
curl -X POST "https://sre-api.alexanderoviedofadul.dev/api/asistentes/recomendacion" \
  -H "Content-Type: application/json" \
  -d '{"consulta": "¿Cuáles son mis derechos constitucionales?"}'
```

##### PHP
```php
<?php
function getRecommendation($query) {
    $url = "https://sre-api.alexanderoviedofadul.dev/api/asistentes/recomendacion";

    $data = json_encode(['consulta' => $query]);

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json',
        'Accept: application/json'
    ]);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($httpCode === 200) {
        $result = json_decode($response, true);

        if ($result['exito']) {
            $assistant = $result['datos']['asistente'];
            $recommended = $result['datos']['recomendado'] ? 'Sí' : 'No';

            echo "Consulta: {$result['datos']['consulta']}\n";
            echo "Asistente recomendado: {$assistant['titulo']}\n";
            echo "ID: {$assistant['id']}\n";
            echo "Categoría: {$assistant['categoria']}\n";
            echo "Recomendación específica: {$recommended}\n";
            echo "Razón: {$result['datos']['razon']}\n\n";

            return $result['datos'];
        }
    }

    return null;
}

// Función para obtener recomendación y consultar directamente
function getRecommendationAndConsult($query, $followUpQuestion = null) {
    // Obtener recomendación
    $recommendation = getRecommendation($query);

    if ($recommendation && $recommendation['asistente']) {
        $assistantId = $recommendation['asistente']['id'];
        $question = $followUpQuestion ?: $query;

        echo "Consultando al asistente recomendado...\n";

        // Consultar al asistente recomendado
        $consultUrl = "https://sre-api.alexanderoviedofadul.dev/api/asistentes/{$assistantId}/consulta";

        $consultData = json_encode(['mensaje' => $question]);

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $consultUrl);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $consultData);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_TIMEOUT, 60);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Content-Type: application/json',
            'Accept: application/json'
        ]);

        $consultResponse = curl_exec($ch);
        $consultHttpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($consultHttpCode === 200) {
            $consultResult = json_decode($consultResponse, true);

            if ($consultResult['exito']) {
                echo "Respuesta: {$consultResult['datos']['respuesta']}\n";
                return $consultResult['datos'];
            }
        }
    }

    return null;
}

// Ejemplos de uso
$tutelaRec = getRecommendation('Necesito ayuda con una acción de tutela');
$familyRec = getRecommendation('Tengo problemas con mi divorcio');
$constitutionRec = getRecommendation('¿Cuáles son mis derechos constitucionales?');

// Ejemplo de flujo completo: recomendación + consulta
$fullResponse = getRecommendationAndConsult(
    'Necesito ayuda con una tutela',
    '¿Cuáles son los requisitos para presentar una tutela?'
);
?>
```

##### Python
```python
import requests
import json

def get_recommendation(query):
    url = "https://sre-api.alexanderoviedofadul.dev/api/asistentes/recomendacion"

    payload = {"consulta": query}
    headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }

    try:
        response = requests.post(url, json=payload, headers=headers)
        response.raise_for_status()

        data = response.json()

        if data['exito']:
            assistant = data['datos']['asistente']
            recommended = "Sí" if data['datos']['recomendado'] else "No"

            print(f"Consulta: {data['datos']['consulta']}")
            print(f"Asistente recomendado: {assistant['titulo']}")
            print(f"ID: {assistant['id']}")
            print(f"Categoría: {assistant['categoria']}")
            print(f"Recomendación específica: {recommended}")
            print(f"Razón: {data['datos']['razon']}")
            print()

            return data['datos']

    except requests.exceptions.RequestException as e:
        print(f"Error: {e}")
        return None

def get_recommendation_and_consult(query, follow_up_question=None):
    """Obtiene recomendación y consulta directamente al asistente"""

    # Obtener recomendación
    recommendation = get_recommendation(query)

    if recommendation and recommendation['asistente']:
        assistant_id = recommendation['asistente']['id']
        question = follow_up_question or query

        print("Consultando al asistente recomendado...")

        # Consultar al asistente recomendado
        consult_url = f"https://sre-api.alexanderoviedofadul.dev/api/asistentes/{assistant_id}/consulta"

        consult_payload = {"mensaje": question}

        try:
            consult_response = requests.post(consult_url, json=consult_payload, timeout=60)
            consult_response.raise_for_status()

            consult_data = consult_response.json()

            if consult_data['exito']:
                print(f"Respuesta: {consult_data['datos']['respuesta']}")
                return consult_data['datos']

        except requests.exceptions.RequestException as e:
            print(f"Error en consulta: {e}")

    return None

# Ejemplos de uso
tutela_rec = get_recommendation('Necesito ayuda con una acción de tutela')
family_rec = get_recommendation('Tengo problemas con mi divorcio')
constitution_rec = get_recommendation('¿Cuáles son mis derechos constitucionales?')

# Ejemplo de flujo completo
full_response = get_recommendation_and_consult(
    'Necesito ayuda con una tutela',
    '¿Cuáles son los requisitos para presentar una tutela?'
)

# Función para múltiples recomendaciones
def test_multiple_recommendations():
    test_queries = [
        'Necesito ayuda con una acción de tutela',
        'Tengo problemas con mi divorcio',
        '¿Cuáles son mis derechos constitucionales?',
        'Necesito analizar un documento legal',
        'Tengo dudas sobre mis impuestos',
        'Quiero información sobre PowerBI',
        'Necesito ayuda con educación'
    ]

    results = []
    for query in test_queries:
        print(f"=== Probando: {query} ===")
        result = get_recommendation(query)
        if result:
            results.append(result)
        print()

    return results

# Ejecutar pruebas
# test_results = test_multiple_recommendations()
```

##### React/JavaScript
```javascript
import React, { useState } from 'react';

const RecommendationSystem = () => {
  const [query, setQuery] = useState('');
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getRecommendation = async (searchQuery) => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('https://sre-api.alexanderoviedofadul.dev/api/asistentes/recomendacion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ consulta: searchQuery }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.exito) {
        setRecommendation(data.datos);
      } else {
        setError('Error al obtener recomendación');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const consultRecommendedAssistant = async (assistantId, message) => {
    try {
      const response = await fetch(`https://sre-api.alexanderoviedofadul.dev/api/asistentes/${assistantId}/consulta`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ mensaje: message }),
      });

      const data = await response.json();

      if (data.exito) {
        return data.datos.respuesta;
      }
    } catch (error) {
      console.error('Error consulting assistant:', error);
    }

    return null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    getRecommendation(query);
  };

  const sampleQueries = [
    'Necesito ayuda con una acción de tutela',
    'Tengo problemas con mi divorcio',
    '¿Cuáles son mis derechos constitucionales?',
    'Necesito analizar un documento legal',
    'Tengo dudas sobre mis impuestos',
    'Quiero información sobre PowerBI'
  ];

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h2>Sistema de Recomendaciones de Asistentes</h2>

      <form onSubmit={handleSubmit} style={{ margin: '20px 0' }}>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Describe tu consulta..."
            style={{ flex: 1, padding: '10px' }}
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Analizando...' : 'Obtener Recomendación'}
          </button>
        </div>
      </form>

      {/* Consultas de ejemplo */}
      <div style={{ margin: '10px 0' }}>
        <p>Ejemplos de consultas:</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
          {sampleQueries.map((sampleQuery, index) => (
            <button
              key={index}
              onClick={() => {
                setQuery(sampleQuery);
                getRecommendation(sampleQuery);
              }}
              style={{
                padding: '5px 10px',
                fontSize: '12px',
                backgroundColor: '#f0f0f0',
                border: '1px solid #ccc',
                borderRadius: '3px',
                cursor: 'pointer'
              }}
            >
              {sampleQuery}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div style={{ color: 'red', margin: '10px 0' }}>
          Error: {error}
        </div>
      )}

      {recommendation && (
        <div style={{
          margin: '20px 0',
          padding: '20px',
          border: '1px solid #ddd',
          borderRadius: '5px',
          backgroundColor: '#f9f9f9'
        }}>
          <h3>Recomendación</h3>

          <div style={{ margin: '10px 0' }}>
            <strong>Consulta:</strong> {recommendation.consulta}
          </div>

          <div style={{ margin: '10px 0' }}>
            <strong>Asistente Recomendado:</strong> {recommendation.asistente.titulo}
          </div>

          <div style={{ margin: '10px 0' }}>
            <strong>ID:</strong> {recommendation.asistente.id}
          </div>

          <div style={{ margin: '10px 0' }}>
            <strong>Categoría:</strong> {recommendation.asistente.categoria}
          </div>

          <div style={{ margin: '10px 0' }}>
            <strong>Recomendación Específica:</strong> {recommendation.recomendado ? 'Sí' : 'No'}
          </div>

          <div style={{ margin: '10px 0' }}>
            <strong>Razón:</strong> {recommendation.razon}
          </div>

          <div style={{ margin: '15px 0' }}>
            <button
              onClick={() => {
                // Redirigir a consulta con el asistente recomendado
                const assistantId = recommendation.asistente.id;
                console.log(`Consultar asistente: ${assistantId}`);
                // Aquí podrías abrir un modal o navegar a otra página
              }}
              style={{
                padding: '10px 20px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              Consultar a {recommendation.asistente.titulo}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecommendationSystem;
```

##### Terminal
```bash
# Recomendación simple
curl -s -X POST "https://sre-api.alexanderoviedofadul.dev/api/asistentes/recomendacion" \
  -H "Content-Type: application/json" \
  -d '{"consulta": "Necesito ayuda con una tutela"}' | \
  jq '.datos | {asistente: .asistente.titulo, razon: .razon}'

# Múltiples recomendaciones
declare -a consultas=(
  "Necesito ayuda con una acción de tutela"
  "Tengo problemas con mi divorcio"
  "¿Cuáles son mis derechos constitucionales?"
  "Necesito analizar un documento legal"
  "Tengo dudas sobre mis impuestos"
  "Quiero información sobre PowerBI"
)

for consulta in "${consultas[@]}"; do
  echo "=== Consulta: $consulta ==="
  curl -s -X POST "https://sre-api.alexanderoviedofadul.dev/api/asistentes/recomendacion" \
    -H "Content-Type: application/json" \
    -d "{\"consulta\": \"$consulta\"}" | \
    jq -r '.datos | "Recomendado: " + .asistente.titulo + " (Razón: " + .razon + ")"'
  echo
done

# Flujo completo: recomendación + consulta
CONSULTA="Necesito ayuda con una tutela"
echo "=== Obteniendo recomendación para: $CONSULTA ==="

RECOMENDACION=$(curl -s -X POST "https://sre-api.alexanderoviedofadul.dev/api/asistentes/recomendacion" \
  -H "Content-Type: application/json" \
  -d "{\"consulta\": \"$CONSULTA\"}")

ASISTENTE_ID=$(echo "$RECOMENDACION" | jq -r '.datos.asistente.id')
ASISTENTE_TITULO=$(echo "$RECOMENDACION" | jq -r '.datos.asistente.titulo')

echo "Asistente recomendado: $ASISTENTE_TITULO (ID: $ASISTENTE_ID)"

echo "=== Consultando al asistente recomendado ==="
curl -s -X POST "https://sre-api.alexanderoviedofadul.dev/api/asistentes/$ASISTENTE_ID/consulta" \
  -H "Content-Type: application/json" \
  -d '{"mensaje": "¿Cuáles son los requisitos para presentar una tutela?"}' | \
  jq -r '.datos.respuesta'
```

---

## 🔍 Endpoints de Búsqueda Web

### 10. Búsqueda Web Inteligente

**Endpoint**: `POST /api/busqueda`
**Descripción**: Realiza búsquedas web inteligentes usando Tavily API.

#### Cuerpo de la Petición

```json
{
  "query": "nuevas leyes Colombia 2025",
  "maxResults": 5,
  "includeAnswer": true
}
```

#### Respuesta

```json
{
  "exito": true,
  "datos": {
    "resultados": [
      {
        "title": "Nuevas Leyes en Colombia 2025",
        "url": "https://ejemplo.com/leyes-2025",
        "content": "Las nuevas regulaciones incluyen...",
        "score": 0.95
      }
    ],
    "respuesta": "En 2025, Colombia ha implementado nuevas leyes que incluyen...",
    "consulta": "nuevas leyes Colombia 2025"
  },
  "timestamp": "2025-08-31T16:17:19.106Z"
}
```

#### Ejemplos de Uso

##### cURL
```bash
# Búsqueda básica
curl -X POST "https://sre-api.alexanderoviedofadul.dev/api/busqueda" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "nuevas leyes Colombia 2025",
    "maxResults": 5,
    "includeAnswer": true
  }'

# Búsqueda específica legal
curl -X POST "https://sre-api.alexanderoviedofadul.dev/api/busqueda" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "reforma tributaria Colombia 2025",
    "maxResults": 10
  }'
```

##### PHP
```php
<?php
function searchWeb($query, $maxResults = 5, $includeAnswer = true) {
    $url = "https://sre-api.alexanderoviedofadul.dev/api/busqueda";

    $payload = [
        'query' => $query,
        'maxResults' => $maxResults,
        'includeAnswer' => $includeAnswer
    ];

    $data = json_encode($payload);

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json',
        'Accept: application/json'
    ]);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($httpCode === 200) {
        $result = json_decode($response, true);

        if ($result['exito']) {
            echo "Búsqueda: {$result['datos']['consulta']}\n";

            if (isset($result['datos']['respuesta'])) {
                echo "Respuesta: {$result['datos']['respuesta']}\n\n";
            }

            echo "Resultados encontrados:\n";
            foreach ($result['datos']['resultados'] as $index => $resultado) {
                echo ($index + 1) . ". {$resultado['title']}\n";
                echo "   URL: {$resultado['url']}\n";
                echo "   Contenido: " . substr($resultado['content'], 0, 100) . "...\n\n";
            }

            return $result['datos'];
        }
    }

    return null;
}

// Ejemplos de uso
$legalSearch = searchWeb('nuevas leyes Colombia 2025');
$taxSearch = searchWeb('reforma tributaria Colombia 2025', 10);
$tutelaSearch = searchWeb('jurisprudencia tutela Colombia', 5, false);
?>
```

##### Python
```python
import requests

def search_web(query, max_results=5, include_answer=True):
    url = "https://sre-api.alexanderoviedofadul.dev/api/busqueda"

    payload = {
        "query": query,
        "maxResults": max_results,
        "includeAnswer": include_answer
    }

    headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }

    try:
        response = requests.post(url, json=payload, headers=headers)
        response.raise_for_status()

        data = response.json()

        if data['exito']:
            print(f"Búsqueda: {data['datos']['consulta']}")

            if 'respuesta' in data['datos']:
                print(f"Respuesta: {data['datos']['respuesta']}\n")

            print("Resultados encontrados:")
            for i, resultado in enumerate(data['datos']['resultados'], 1):
                print(f"{i}. {resultado['title']}")
                print(f"   URL: {resultado['url']}")
                print(f"   Contenido: {resultado['content'][:100]}...\n")

            return data['datos']

    except requests.exceptions.RequestException as e:
        print(f"Error: {e}")
        return None

# Ejemplos de uso
legal_search = search_web('nuevas leyes Colombia 2025')
tax_search = search_web('reforma tributaria Colombia 2025', 10)
tutela_search = search_web('jurisprudencia tutela Colombia', 5, False)

# Búsqueda combinada con consulta a asistente
def search_and_consult(search_query, assistant_id):
    """Busca información web y luego consulta a un asistente especializado"""

    # Realizar búsqueda web
    search_results = search_web(search_query)

    if search_results:
        # Preparar contexto para el asistente
        context = f"Basándote en esta información reciente: {search_results.get('respuesta', '')}"
        question = f"{context}\n\n¿Puedes explicarme más sobre {search_query}?"

        # Consultar asistente
        consult_url = f"https://sre-api.alexanderoviedofadul.dev/api/asistentes/{assistant_id}/consulta"

        try:
            consult_response = requests.post(consult_url, json={"mensaje": question}, timeout=60)
            consult_data = consult_response.json()

            if consult_data['exito']:
                print(f"\nConsulta al asistente {assistant_id}:")
                print(consult_data['datos']['respuesta'])
                return consult_data['datos']

        except requests.exceptions.RequestException as e:
            print(f"Error consultando asistente: {e}")

    return None

# Ejemplo de búsqueda + consulta
# combined_result = search_and_consult('reforma tributaria Colombia 2025', 'tributaria')
```

##### React/JavaScript
```javascript
import React, { useState } from 'react';

const WebSearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchWeb = async (searchQuery, maxResults = 5, includeAnswer = true) => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('https://sre-api.alexanderoviedofadul.dev/api/busqueda', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          query: searchQuery,
          maxResults,
          includeAnswer
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.exito) {
        setResults(data.datos);
      } else {
        setError('Error en la búsqueda web');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    searchWeb(query);
  };

  const sampleSearches = [
    'nuevas leyes Colombia 2025',
    'reforma tributaria Colombia',
    'jurisprudencia tutela Colombia',
    'derechos fundamentales Colombia',
    'código civil Colombia'
  ];

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h2>Búsqueda Web Inteligente</h2>

      <form onSubmit={handleSubmit} style={{ margin: '20px 0' }}>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar información actualizada..."
            style={{ flex: 1, padding: '10px' }}
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Buscando...' : 'Buscar'}
          </button>
        </div>
      </form>

      {/* Búsquedas de ejemplo */}
      <div style={{ margin: '10px 0' }}>
        <p>Búsquedas sugeridas:</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
          {sampleSearches.map((sampleSearch, index) => (
            <button
              key={index}
              onClick={() => {
                setQuery(sampleSearch);
                searchWeb(sampleSearch);
              }}
              style={{
                padding: '5px 10px',
                fontSize: '12px',
                backgroundColor: '#e3f2fd',
                border: '1px solid #2196f3',
                borderRadius: '3px',
                cursor: 'pointer'
              }}
            >
              {sampleSearch}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div style={{ color: 'red', margin: '10px 0' }}>
          Error: {error}
        </div>
      )}

      {results && (
        <div style={{ margin: '20px 0' }}>
          <h3>Resultados para: "{results.consulta}"</h3>

          {results.respuesta && (
            <div style={{
              margin: '15px 0',
              padding: '15px',
              backgroundColor: '#f0f8ff',
              border: '1px solid #b3d9ff',
              borderRadius: '5px'
            }}>
              <h4>Resumen:</h4>
              <p>{results.respuesta}</p>
            </div>
          )}

          <h4>Fuentes encontradas ({results.resultados.length}):</h4>
          {results.resultados.map((resultado, index) => (
            <div key={index} style={{
              margin: '10px 0',
              padding: '15px',
              border: '1px solid #ddd',
              borderRadius: '5px',
              backgroundColor: '#fafafa'
            }}>
              <h5>
                <a href={resultado.url} target="_blank" rel="noopener noreferrer">
                  {resultado.title}
                </a>
              </h5>
              <p style={{ fontSize: '14px', color: '#666' }}>
                {resultado.url}
              </p>
              <p>{resultado.content}</p>
              {resultado.score && (
                <p style={{ fontSize: '12px', color: '#888' }}>
                  Relevancia: {(resultado.score * 100).toFixed(1)}%
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WebSearch;
```

##### Terminal
```bash
# Búsqueda simple
curl -s -X POST "https://sre-api.alexanderoviedofadul.dev/api/busqueda" \
  -H "Content-Type: application/json" \
  -d '{"query": "nuevas leyes Colombia 2025", "maxResults": 3}' | \
  jq '.datos.resultados[] | {title: .title, url: .url}'

# Búsqueda con respuesta
curl -s -X POST "https://sre-api.alexanderoviedofadul.dev/api/busqueda" \
  -H "Content-Type: application/json" \
  -d '{"query": "reforma tributaria Colombia 2025", "includeAnswer": true}' | \
  jq -r '.datos.respuesta'

# Múltiples búsquedas
declare -a busquedas=(
  "nuevas leyes Colombia 2025"
  "reforma tributaria Colombia"
  "jurisprudencia tutela Colombia"
  "derechos fundamentales Colombia"
)

for busqueda in "${busquedas[@]}"; do
  echo "=== Búsqueda: $busqueda ==="
  curl -s -X POST "https://sre-api.alexanderoviedofadul.dev/api/busqueda" \
    -H "Content-Type: application/json" \
    -d "{\"query\": \"$busqueda\", \"maxResults\": 2}" | \
    jq -r '.datos.resultados[] | "- " + .title + " (" + .url + ")"'
  echo
done
```

---

## 🧪 Endpoints de Pruebas y Diagnóstico

### 11. Prueba de Conectividad de Proveedores

**Endpoint**: `POST /api/proveedores/test`
**Descripción**: Prueba la conectividad y estado de todos los proveedores de IA.

#### Respuesta

```json
{
  "exito": true,
  "datos": {
    "openai": {
      "status": "healthy",
      "message": "Funcionando correctamente",
      "model": "gpt-5-nano"
    },
    "ollama": {
      "status": "healthy",
      "message": "Funcionando correctamente",
      "model": "llama3.2:latest"
    },
    "anthropic": {
      "status": "error",
      "message": "API Key inválida",
      "model": "claude-3-5-sonnet-20241022"
    }
  },
  "timestamp": "2025-08-31T16:17:19.106Z"
}
```

#### Ejemplos de Uso

##### cURL
```bash
curl -X POST "https://sre-api.alexanderoviedofadul.dev/api/proveedores/test" \
  -H "Accept: application/json"
```

##### PHP
```php
<?php
function testProviders() {
    $url = "https://sre-api.alexanderoviedofadul.dev/api/proveedores/test";

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 30);
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Accept: application/json']);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($httpCode === 200) {
        $result = json_decode($response, true);

        if ($result['exito']) {
            echo "Estado de los proveedores de IA:\n\n";

            foreach ($result['datos'] as $provider => $status) {
                $statusIcon = $status['status'] === 'healthy' ? '✅' : '❌';
                echo "{$statusIcon} {$provider}: {$status['message']}\n";
                echo "   Modelo: {$status['model']}\n\n";
            }

            return $result['datos'];
        }
    }

    return null;
}

$providerStatus = testProviders();
?>
```

##### Python
```python
import requests

def test_providers():
    url = "https://sre-api.alexanderoviedofadul.dev/api/proveedores/test"

    try:
        response = requests.post(url, timeout=30)
        response.raise_for_status()

        data = response.json()

        if data['exito']:
            print("Estado de los proveedores de IA:\n")

            for provider, status in data['datos'].items():
                status_icon = "✅" if status['status'] == 'healthy' else "❌"
                print(f"{status_icon} {provider}: {status['message']}")
                print(f"   Modelo: {status['model']}\n")

            return data['datos']

    except requests.exceptions.RequestException as e:
        print(f"Error: {e}")
        return None

provider_status = test_providers()
```

##### Terminal
```bash
# Prueba simple
curl -s -X POST "https://sre-api.alexanderoviedofadul.dev/api/proveedores/test" | \
  jq '.datos | to_entries[] | "\(.key): \(.value.status) - \(.value.message)"'

# Prueba con formato
curl -s -X POST "https://sre-api.alexanderoviedofadul.dev/api/proveedores/test" | \
  jq -r '.datos | to_entries[] | if .value.status == "healthy" then "✅ \(.key): \(.value.message)" else "❌ \(.key): \(.value.message)" end'
```

---

## 📋 Resumen de Todos los Endpoints

### 📊 **Endpoints del Sistema (4)**

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/api/estado` | GET | Estado completo del sistema |
| `/api/proveedores` | GET | Lista de proveedores de IA |
| `/api/modelos` | GET | Todos los modelos disponibles |
| `/api/proveedores/test` | POST | Prueba conectividad de APIs |

### 🤖 **Endpoints de Asistentes (6)**

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/api/asistentes` | GET | Lista de 37 asistentes especializados |
| `/api/asistentes/categorias` | GET | Categorías de asistentes |
| `/api/asistentes/categoria/{cat}` | GET | Asistentes por categoría |
| `/api/asistentes/buscar` | POST | Buscar asistentes |
| `/api/asistentes/{id}/consulta` | POST | Consultar asistente especializado |
| `/api/asistentes/recomendacion` | POST | Obtener recomendación automática |

### 🔍 **Endpoints de Búsqueda (1)**

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/api/busqueda` | POST | Búsqueda web inteligente con Tavily |

### 🎯 **Endpoints de Agentes Personalizados (4)**

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/api/agentes` | GET | Lista agentes personalizados |
| `/api/agentes` | POST | Crear nuevo agente |
| `/api/agentes/{id}` | GET | Obtener agente específico |
| `/api/agentes/{id}/prompt` | POST | Enviar prompt a agente |

---

## 🎯 **Total: 15 Endpoints Operativos**

**Base URL**: `https://sre-api.alexanderoviedofadul.dev`
**Formato**: JSON
**Autenticación**: No requerida
**CORS**: Habilitado
**HTTPS**: Sí
**Rate Limiting**: 100 requests/15 minutos

---

## 🚀 **Casos de Uso Completos**

### **Flujo 1: Consulta Legal Completa**
```bash
# 1. Obtener recomendación
RECOMENDACION=$(curl -s -X POST "https://sre-api.alexanderoviedofadul.dev/api/asistentes/recomendacion" \
  -H "Content-Type: application/json" \
  -d '{"consulta": "Necesito ayuda con una tutela"}')

# 2. Extraer ID del asistente recomendado
ASISTENTE_ID=$(echo "$RECOMENDACION" | jq -r '.datos.asistente.id')

# 3. Consultar al asistente
curl -X POST "https://sre-api.alexanderoviedofadul.dev/api/asistentes/$ASISTENTE_ID/consulta" \
  -H "Content-Type: application/json" \
  -d '{"mensaje": "¿Cuáles son los requisitos para presentar una tutela?"}'
```

### **Flujo 2: Búsqueda + Consulta Especializada**
```bash
# 1. Buscar información actualizada
BUSQUEDA=$(curl -s -X POST "https://sre-api.alexanderoviedofadul.dev/api/busqueda" \
  -H "Content-Type: application/json" \
  -d '{"query": "nuevas leyes tutela Colombia 2025"}')

# 2. Consultar asistente con contexto
curl -X POST "https://sre-api.alexanderoviedofadul.dev/api/asistentes/tutela/consulta" \
  -H "Content-Type: application/json" \
  -d '{"mensaje": "Basándote en las nuevas leyes de 2025, ¿qué cambios hay en las tutelas?"}'
```

---

**Documentación actualizada**: 31 de agosto de 2025
**Versión API**: 1.0.0 Enhanced
**Estado**: Completamente operativo
**Soporte**: https://github.com/bladealex9848/sre-spanish
