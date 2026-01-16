import { AccessCandidate } from '@sre/Security/AccessControl/AccessCandidate.class';
import { AccessRequest } from '@sre/Security/AccessControl/AccessRequest.class';
import { ACL } from '@sre/Security/AccessControl/ACL.class';
import { IAccessCandidate, IACL } from '@sre/types/ACL.types';
import { SecureConnector } from '@sre/Security/SecureConnector.class';

export interface CodeInput {
    code: string; // Main code to execute
    dependencies?: string; // Dependencies/imports/packages
    files?: Record<string, string>; // Additional files (filename -> content)
    inputs?: Record<string, any>; // Runtime input parameters
}

export interface CodeConfig {
    runtime: string; // 'nodejs', 'python', 'java', etc.
    timeout?: number; // Execution timeout in milliseconds
    memoryLimit?: number; // Memory allocation in MB
    environment?: Record<string, string>; // Environment variables
    // Platform-specific settings
    platformConfig?: Record<string, any>;
}

export interface CodeExecutionResult {
    output: any; // The execution result/return value
    executionTime: number; // Execution time in milliseconds
    logs?: string[]; // Execution logs
    errors?: string[]; // Error messages
    success: boolean; // Whether execution succeeded
}

export interface CodePreparationResult {
    prepared: boolean; // Whether preparation succeeded
    errors?: string[]; // Preparation errors
    warnings?: string[]; // Preparation warnings
    metadata?: Record<string, any>; // Platform-specific preparation data
}

export interface CodeDeployment {
    id: string; // Deployment identifier
    status: string;
    runtime: string;
    createdAt: Date;
    lastUsed?: Date;
    lastUpdated?: Date;
}

export interface ICodeRequest {
    // Core workflow
    prepare(codeUID: string, input: CodeInput, config: CodeConfig): Promise<CodePreparationResult>;
    deploy(codeUID: string, input: CodeInput, config: CodeConfig): Promise<CodeDeployment>;
    execute(codeUID: string, inputs: Record<string, any>, config: CodeConfig): Promise<CodeExecutionResult>;

    // Execute with existing deployment (for platforms that support it)
    executeDeployment(codeUID: string, deploymentId: string, inputs: Record<string, any>, config: CodeConfig): Promise<CodeExecutionResult>;

    // Deployment management
    listDeployments(codeUID: string, config: CodeConfig): Promise<CodeDeployment[]>;
    getDeployment(codeUID: string, deploymentId: string, config: CodeConfig): Promise<CodeDeployment | null>;
    deleteDeployment(codeUID: string, deploymentId: string, config: CodeConfig): Promise<void>;
}

export abstract class CodeConnector extends SecureConnector {
    public abstract getResourceACL(resourceId: string, candidate: IAccessCandidate): Promise<ACL>;
    // Abstract methods that concrete connectors must implement
    protected abstract prepare(acRequest: AccessRequest, codeUID: string, input: CodeInput, config: CodeConfig): Promise<CodePreparationResult>;
    protected abstract deploy(acRequest: AccessRequest, codeUID: string, input: CodeInput, config: CodeConfig): Promise<CodeDeployment>;
    protected abstract execute(acRequest: AccessRequest, codeUID: string, inputs: Record<string, any>, config: CodeConfig): Promise<CodeExecutionResult>;
    protected abstract executeDeployment(acRequest: AccessRequest, codeUID: string, deploymentId: string, inputs: Record<string, any>, config: CodeConfig): Promise<CodeExecutionResult>;
    protected abstract listDeployments(acRequest: AccessRequest, codeUID: string, config: CodeConfig): Promise<CodeDeployment[]>;
    protected abstract getDeployment(acRequest: AccessRequest, codeUID: string, deploymentId: string, config: CodeConfig): Promise<CodeDeployment | null>;
    protected abstract deleteDeployment(acRequest: AccessRequest, codeUID: string, deploymentId: string, config: CodeConfig): Promise<void>;

    public requester(candidate: AccessCandidate): ICodeRequest {
        return {
            prepare: async (codeUID: string, input: CodeInput, config: CodeConfig) => {
                return await this.prepare(candidate.readRequest, codeUID, input, config);
            },
            deploy: async (codeUID: string, input: CodeInput, config: CodeConfig) => {
                return await this.deploy(candidate.writeRequest, codeUID, input, config);
            },
            execute: async (codeUID: string, inputs: Record<string, any>, config: CodeConfig) => {
                return await this.execute(candidate.readRequest, codeUID, inputs, config);
            },
            executeDeployment: async (codeUID: string, deploymentId: string, inputs: Record<string, any>, config: CodeConfig) => {
                return await this.executeDeployment(candidate.readRequest, codeUID, deploymentId, inputs, config);
            },
            listDeployments: async (codeUID: string, config: CodeConfig) => {
                return await this.listDeployments(candidate.readRequest, codeUID, config);
            },
            getDeployment: async (codeUID: string, deploymentId: string, config: CodeConfig) => {
                return await this.getDeployment(candidate.readRequest, codeUID, deploymentId, config);
            },
            deleteDeployment: async (codeUID: string, deploymentId: string, config: CodeConfig) => {
                await this.deleteDeployment(candidate.writeRequest, codeUID, deploymentId, config);
            },
        } as ICodeRequest;
    }
}
