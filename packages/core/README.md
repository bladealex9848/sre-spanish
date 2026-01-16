# Smyth Runtime Environment (SRE) Core

This package contains the **Smyth Runtime Environment (SRE)**, the core of SmythOS. It is responsible for low-level agent orchestration, secure resource management, and providing the foundational services upon which all higher-level agent functionalities are built.

This document provides a technical deep-dive into the SRE's architecture, you only need to read this if you are interested in the internals of SmythOS or if you are planning to [contribute](../../CONTRIBUTING.md) to the SmythOS codebase.
For building applications and agents on top of SmythOS, please refer to the developer-friendly **[@smythos/sdk](../sdk)** package.

---

## 🏗️ Core Architecture

SRE is designed with a philosophy inspired by operating system kernels, establishing a clear separation between the core runtime and the pluggable **Connectors** that interface with external services and infrastructure.

### The SRE Lifecycle & Initialization

The SRE is a singleton that gets initialized via the `SRE.init()` method. This critical step bootstraps the entire environment based on the provided configuration. The `sre.ready()` method then ensures all configured connectors are initialized and operational.

An SRE initialization looks like this:

```typescript
import { SRE } from '@smythos/sre';

// 1. SRE.init() loads the configuration for each subsystem
const sre = SRE.init({
    Vault: { Connector: 'JSONFileVault', Settings: { file: 'vault.json' } },
    Cache: { Connector: 'RAM' },
    Storage: { Connector: 'Local' },
    Log: { Connector: 'ConsoleLog' },
});

// 2. sre.ready() asynchronously initializes all configured connectors
await sre.ready();

console.log('SRE is operational.');
```

### 🛡️ Security Model: The Candidate & ACL System

Security is a foundational, non-negotiable aspect of SRE. Every operation that accesses a resource is governed by the **Candidate/ACL system**. An **Access Candidate** is an object representing the entity (e.g., an agent, a user, an internal process) requesting access.

Connectors use the candidate to scope and isolate resources, preventing data leakage between tenants.

```typescript
// Internally, when an agent requests a resource, this happens:

// 1. An Access Candidate is created for the specific agent
const candidate = AccessCandidate.agent(agentId);

// 2. A handle to the underlying storage connector is retrieved
const storageConnector = ConnectorService.getStorageConnector();

// 3. The connector is scoped to the candidate's context
// The resulting `storage` object is now a sandboxed view for that agent
const storage = storageConnector.user(candidate);

// 4. This write operation is now isolated. Another agent writing to 'data.json'
// will write to a completely different, isolated location.
await storage.write('data.json', content);
```

This design ensures that multi-tenancy and security are enforced at the lowest level of the runtime.

### Subsystem Deep Dive

SRE's functionality is partitioned into several discrete subsystems.

#### 🤖 Agent Manager

The heart of agent execution. It manages the entire agent lifecycle (start, stop, pause), monitors performance, and orchestrates the complex workflows defined within an agent's components.

#### 💾 Memory Manager

Provides intelligent state and context management for agents. It includes:

-   **Cache Service**: A multi-tiered caching system (RAM, Redis) for fast data retrieval.
-   **Runtime Context**: Manages an agent's state during execution.
-   **LLM Context**: Manages conversation history and context windows for LLMs.

#### 🛡️ Security Manager

Handles all security-related primitives.

-   **Vault Service**: Provides a secure connector-based interface for storing and retrieving secrets (e.g., from HashiCorp Vault, AWS Secrets Manager, or a local JSON file).
-   **Account Management**: Manages identity and authentication.
-   **Access Control**: Implements the granular Candidate/ACL permission system.

#### 📥 IO Subsystem

The gateway to the outside world. It provides a set of unified connector interfaces for all input/output operations.

| Service      | Purpose                    | Example Connectors   |
| ------------ | -------------------------- | -------------------- |
| **Storage**  | File & data persistence    | `LocalStorage`, `S3` |
| **VectorDB** | Vector storage & retrieval | `Pinecone`, `Milvus` |
| **Log**      | Activity & debug logging   | `Console`            |
| **NKV**      | Key-value storage          | `Redis`, `RAM`       |

#### 🧠 LLM Manager

A powerful abstraction layer for over 8 different LLM providers. It handles API variations between providers and offers features like smart inference, response caching, and unified usage tracking.

---

<details>
<summary>💻 Code Standards & Best Practices</summary>

### Folder Structure

-   **/subsystems**: Contains the core service definitions and connector interfaces for all major subsystems (IO, AgentManager, MemoryManager, etc.).
-   **/Components**: SmythOS Agent Components.
-   **/utils**: Contains utility functions. Functions in this folder should not depend on other packages of the project outside of /utils/\*. These functions are reusable throughout the code.
-   **/helpers**: Contains general helper classes/objects/structures. Unlike utils, helpers export an object that exposes a collection of functions specific to a given task.
-   **/types**: This folder contains SmythOS-specific type declarations.

### Naming Standards

#### File Naming

Use the following extensions for specific code roles to maintain consistency across the codebase:

-   `.service.ts` for top-level services
-   `.class.ts` for classes and connectors
-   `.utils.ts` for utility collections
-   `.helper.ts` for task-specific helpers
-   `.handler.ts` for event handlers
-   `.mw.ts` for middlewares

#### Declaration Naming

-   **Constants**: Uppercase with underscores (e.g., `MAX_RETRIES`).
-   **Enums and Types**: Start with `T` (e.g., `TAccessLevel`).
-   **Interfaces**: Start with `I` (e.g., `IStorageConnector`).
-   **Classes**: Use PascalCase without a prefix (e.g., `MyAgent`).

</details>
