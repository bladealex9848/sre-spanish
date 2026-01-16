import { DocParser, TDocumentParseSettings, TParsedDocument } from '../DocParser.class';
import { readFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

export class TextParser extends DocParser {
    protected supportedMimeTypes: string[] = ['text/plain', 'text/x-plain', 'text/x-txt'];
    protected supportedExtensions: string[] = ['txt'];
    async parse(source: string, params?: TDocumentParseSettings): Promise<TParsedDocument> {
        try {
            let textContent: string = source; // Default to raw source
            let isFilePath = false;

            // Try to treat as a file path, but gracefully fallback to raw content
            try {
                if (this.isLikelyFilePath(source)) {
                    const normalizedPath = path.resolve(source);
                    if (existsSync(normalizedPath)) {
                        textContent = await readFile(normalizedPath, 'utf-8');
                        isFilePath = true;
                    }
                }
            } catch (fileError) {
                // If any file operation fails, we've already defaulted to raw source
                isFilePath = false;
            }

            // Extract title
            let title = 'Untitled';
            if (isFilePath) {
                const fileName = path.basename(source, path.extname(source));
                title = fileName || 'Untitled';
            }

            // Override with params if provided
            if (params?.title) {
                title = params.title;
            }

            // Create content array
            const content =
                textContent.trim().length > 0
                    ? [
                          {
                              type: 'text' as const,
                              data: textContent,
                              text: textContent,
                          },
                      ]
                    : [];

            // Build metadata
            const metadata = {
                uri: isFilePath ? source : '',
                author: params?.author || '',
                date: params?.date || '',
                tags: params?.tags || [],
            };

            return {
                title,
                metadata,
                pages: [
                    {
                        content,
                        metadata: { pageNumber: 1 },
                    },
                ],
            };
        } catch (error) {
            console.error('Text parsing error:', error);
            throw error;
        }
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
                source.endsWith('.txt') || // Text extension
                source.endsWith('.md') || // Markdown extension
                source.endsWith('.log') || // Log files
                source.endsWith('.csv') || // CSV files
                source.endsWith('.json') || // JSON files
                source.endsWith('.xml')) // XML files
        );
    }
}
