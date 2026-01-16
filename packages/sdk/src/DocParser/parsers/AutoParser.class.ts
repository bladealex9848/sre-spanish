import { lookup } from 'mime-types';
import { extname } from 'path';
import { Doc, TDocType } from '../Doc.class';
import { DocParser, TDocumentParseSettings, TParsedDocument } from '../DocParser.class';
import { existsSync } from 'fs';
import path from 'path';
import { TextParser } from './TextParser.class';

export class AutoParser extends DocParser {
    constructor() {
        super();
    }

    private isLikelyFilePath(source: string): boolean {
        // Basic heuristics to determine if source looks like a file path
        // This is not perfect but safer than existsSync on raw input
        return (
            source.length < 1000 && // Reasonable path length
            !source.includes('\n') && // File paths shouldn't contain newlines
            !source.includes('\r') && // File paths shouldn't contain carriage returns
            (source.includes('/') || // Unix-style path
                source.includes('\\') || // Windows-style path
                !!source.match(/^[a-zA-Z]:[\\\/]/) || // Windows absolute path
                existsSync(source)) // Check if it actually exists
        );
    }

    async parse(source: string, params?: TDocumentParseSettings): Promise<TParsedDocument> {
        if (!this.isLikelyFilePath(source)) {
            // If the source does not look like a file path, assume it's raw text content
            return new TextParser().parse(source, params);
        }

        const mimeType = lookup(source);
        const extension = extname(source).slice(1);

        let parser: DocParser | undefined;

        const parsers = Object.entries(Doc).filter(([key]) => key !== 'auto') as [TDocType, DocParser][];

        if (mimeType) {
            for (const [, p] of parsers) {
                if (p['supportedMimeTypes'].includes(mimeType)) {
                    parser = p;
                    break;
                }
            }
        }

        if (!parser && extension) {
            for (const [, p] of parsers) {
                if (p['supportedExtensions'].includes(extension)) {
                    parser = p;
                    break;
                }
            }
        }

        if (!parser) {
            // If no specific parser is found, default to TextParser for unknown file types
            return new TextParser().parse(source, params);
        }

        return parser.parse(source, params);
    }
}
