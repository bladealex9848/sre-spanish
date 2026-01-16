import { Readable } from 'stream';

export type StorageMetadata = Record<string, any> | undefined;

export type StorageData = string | Uint8Array | Buffer | Readable;
