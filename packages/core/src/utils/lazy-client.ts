/**
 * Configuration for lazy client error handling
 */
export interface LazyClientConfig {
    /** Custom package name if different from import path */
    packageName?: string;
    /** Custom display name for the package */
    displayName?: string;
    /** Additional installation notes */
    installNotes?: string;
    /** Documentation URL */
    docsUrl?: string;
    /** Disable auto-installation messages */
    silent?: boolean;
}

/**
 * Detects the package manager being used
 */
function detectPackageManager(): string {
    // Check npm_config_user_agent environment variable
    const userAgent = process.env.npm_config_user_agent;
    if (userAgent?.includes('pnpm')) return 'pnpm';
    if (userAgent?.includes('yarn')) return 'yarn';

    // Fallback: check for lock files in cwd (if accessible)
    try {
        const fs = require('fs');
        if (fs.existsSync('pnpm-lock.yaml')) return 'pnpm';
        if (fs.existsSync('yarn.lock')) return 'yarn';
    } catch {
        // Ignore file system errors
    }

    return 'npm';
}

/**
 * Extracts package name from import path
 */
function extractPackageName(importPath: string, config: LazyClientConfig): string {
    if (config.packageName) {
        return config.packageName;
    }

    // Handle scoped packages: @scope/package or @scope/package/subpath
    if (importPath.startsWith('@')) {
        const parts = importPath.split('/');
        return `${parts[0]}/${parts[1]}`;
    }

    // Handle regular packages: package or package/subpath
    return importPath.split('/')[0];
}

/**
 * Creates a helpful error message for missing packages
 */
function createInstallationMessage(importPath: string, originalError: Error, config: LazyClientConfig): Error {
    if (config.silent) {
        return originalError;
    }

    const packageName = extractPackageName(importPath, config);
    const displayName = config.displayName || packageName;
    const packageManager = detectPackageManager();

    let message = `\n🔌 ${displayName} is required but not installed\n\n`;

    message += `Quick install:\n`;
    message += `  ${packageManager} add ${packageName}\n\n`;

    // Add alternative package managers
    if (packageManager !== 'npm') {
        message += `Or with npm:\n  npm install ${packageName}\n\n`;
    }
    if (packageManager !== 'pnpm') {
        message += `Or with pnpm:\n  pnpm add ${packageName}\n\n`;
    }

    if (config.installNotes) {
        message += `📝 Note: ${config.installNotes}\n\n`;
    }

    if (config.docsUrl) {
        message += `📚 Documentation: ${config.docsUrl}\n\n`;
    }

    message += `Original error: ${originalError.message}`;

    const enhancedError = new Error(message);
    enhancedError.name = 'LazyClientImportError';
    enhancedError.stack = originalError.stack;
    return enhancedError;
}

/**
 * Generic lazy loading utility for client libraries
 * Preserves strong typing and requires minimal code changes
 */
export class LazyClient<T = any> {
    private _client: T | null = null;
    private _clientPromise: Promise<T> | null = null;

    constructor(private clientFactory: () => Promise<T>, private config: LazyClientConfig = {}) {}

    /**
     * Creates a proxy that records method calls and executes them when needed
     */
    private createProxy(methodPath: Array<{ method: string; args: any[] }> = []): any {
        const self = this;

        // Create a proxy that can be both called and have properties accessed
        return new Proxy(() => {}, {
            get(target, prop, receiver) {
                if (prop === 'then') {
                    // This is being awaited - execute the method chain and return a thenable
                    const promise = self.executeMethodChain(methodPath);
                    return promise.then.bind(promise);
                }

                if (prop === 'catch') {
                    // Handle .catch() calls
                    const promise = self.executeMethodChain(methodPath);
                    return promise.catch.bind(promise);
                }

                if (prop === 'finally') {
                    // Handle .finally() calls
                    const promise = self.executeMethodChain(methodPath);
                    return promise.finally.bind(promise);
                }

                if (prop === Symbol.toStringTag) {
                    return 'LazyClient';
                }

                if (typeof prop !== 'string') {
                    return undefined;
                }

                // Return a function that extends the method chain
                return (...args: any[]) => {
                    const newPath = [...methodPath, { method: prop, args }];
                    return self.createProxy(newPath);
                };
            },

            apply(target, thisArg, argumentsList) {
                // If called as a function, extend the method chain
                return self.createProxy(methodPath);
            },

            has(target, prop) {
                return true;
            },
        });
    }

    /**
     * Executes the recorded method chain on the actual client
     */
    private async executeMethodChain(methodPath: Array<{ method: string; args: any[] }>): Promise<any> {
        const client = await this.ensureClient();

        let current: any = client;

        // Execute each method call in sequence
        for (const { method, args } of methodPath) {
            if (current && typeof current[method] === 'function') {
                current = current[method].apply(current, args);
            } else if (current && current[method] !== undefined) {
                current = current[method];
            } else {
                throw new Error(`Method or property '${method}' not found`);
            }
        }

        return current;
    }

    /**
     * Ensures the client is loaded and returns it
     */
    private async ensureClient(): Promise<T> {
        if (this._client) {
            return this._client;
        }

        if (!this._clientPromise) {
            this._clientPromise = this.clientFactory().catch((error) => {
                // Reset promise so next attempt will retry
                this._clientPromise = null;
                throw error;
            });
        }

        this._client = await this._clientPromise;
        return this._client;
    }

    /**
     * Returns the proxy that behaves like the actual client
     */
    get client(): T {
        return this.createProxy() as T;
    }

    /**
     * Get the actual client instance (async)
     */
    async getClient(): Promise<T> {
        return this.ensureClient();
    }

    /**
     * Check if the client is already loaded
     */
    get isLoaded(): boolean {
        return this._client !== null;
    }
}

/**
 * Helper function to create a lazy client with dynamic import
 */
export function createLazyClient<T>(importFn: () => Promise<any>, clientFactory: (module: any) => T, config: LazyClientConfig = {}): LazyClient<T> {
    return new LazyClient<T>(async () => {
        try {
            const module = await importFn();
            return clientFactory(module);
        } catch (error) {
            // Try to extract import path from the error or use the configured package name
            const importPath = config.packageName || 'unknown-package';
            throw createInstallationMessage(importPath, error as Error, config);
        }
    }, config);
}

/**
 * Specific helper for common client patterns
 */
// export function createLazyClientFromConstructor<T>(
//     importFn: () => Promise<any>,
//     constructorName: string,
//     config: LazyClientConfig = {},
//     ...args: any[]
// ): LazyClient<T> {
//     return createLazyClient<T>(importFn, (module) => new module[constructorName](...args), config);
// }
export function createLazyClientFromConstructor<T>(packageName: string, constructorName: string, ...args: any[]): LazyClient<T> {
    const importFn = () => import(packageName);
    const config = {
        packageName,
        displayName: constructorName,
        //installNotes: `Install ${packageName} with your package manager`,
        //docsUrl: `https://www.npmjs.com/package/${packageName}`,
    };
    console.log('LazyClient', packageName, constructorName);
    return createLazyClient<T>(importFn, (module) => new module[constructorName](...args), config);
}
