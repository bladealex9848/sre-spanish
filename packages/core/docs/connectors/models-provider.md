# ModelsProvider Connectors

The ModelsProvider subsystem manages LLM model configurations and availability.

## Available Connectors

### JSONModelsProvider

**Role**: JSON-based model configuration provider  
**Summary**: Provides model configurations from JSON files. Manages model metadata, capabilities, and provider-specific settings.

| Setting  | Type                     | Required | Default         | Description                                           |
| -------- | ------------------------ | -------- | --------------- | ----------------------------------------------------- |
| `models` | string \| TLLMModelsList | No       | Built-in models | Directory path to models.json or models object        |
| `mode`   | string                   | No       | `"merge"`       | How to handle custom models: `"merge"` or `"replace"` |

**Example Configuration:**

```typescript
import { SRE } from '@smythos/sre';

SRE.init({
    ModelsProvider: {
        Connector: 'JSONModelsProvider',
        Settings: {
            models: './config/models.json',
            mode: 'merge',
        },
    },
});
```

**Configuration Options:**

### Models Setting

-   **String path**: Path to directory containing models.json file
-   **Object**: Direct TLLMModelsList object with model definitions
-   **Undefined**: Uses built-in model configurations

### Mode Setting

-   **`"merge"`**: Combines custom models with built-in models
-   **`"replace"`**: Replaces built-in models entirely with custom ones

**Use Cases:**

-   Custom model configurations
-   Adding organization-specific models
-   Environment-specific model settings
-   Model metadata management

**File Watching:**
When `models` is a directory path, the connector automatically watches for changes and reloads model configurations.
