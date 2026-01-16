import { DocParser, TDocumentParseSettings, TParsedDocument, TDocumentContent } from '../DocParser.class';
import { readFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

export class MarkdownParser extends DocParser {
    protected supportedMimeTypes: string[] = ['text/markdown', 'text/x-markdown', 'text/x-md'];
    protected supportedExtensions: string[] = ['md'];
    async parse(source: string, params?: TDocumentParseSettings): Promise<TParsedDocument> {
        try {
            let markdownContent: string = source; // Default to raw source
            let isFilePath = false;

            // Try to treat as a file path, but gracefully fallback to raw content
            try {
                if (this.isLikelyFilePath(source)) {
                    const normalizedPath = path.resolve(source);
                    if (existsSync(normalizedPath)) {
                        markdownContent = await readFile(normalizedPath, 'utf-8');
                        isFilePath = true;
                    }
                }
            } catch (fileError) {
                // If any file operation fails, we've already defaulted to raw source
                isFilePath = false;
            }

            // Extract title from markdown or filepath
            let title = this.extractTitleFromMarkdown(markdownContent);

            if (!title && isFilePath) {
                const fileName = path.basename(source, path.extname(source));
                title = fileName || 'Untitled';
            }

            if (!title) {
                title = 'Untitled';
            }

            // Override with params if provided
            if (params?.title) {
                title = params.title;
            }

            // Parse markdown content into structured format
            const content = this.parseMarkdownContent(markdownContent);

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
            console.error('Markdown parsing error:', error);
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
                source.endsWith('.md') || // Markdown extension
                source.endsWith('.txt') || // Text extension
                source.endsWith('.markdown')) // Markdown extension variant
        );
    }

    private extractTitleFromMarkdown(content: string): string | null {
        const lines = content.split('\n');

        for (const line of lines) {
            const trimmedLine = line.trim();

            // Check for h1 heading (# Title)
            const h1Match = trimmedLine.match(/^#\s+(.+)$/);
            if (h1Match) {
                return h1Match[1].trim();
            }

            // Check for setext-style h1 (underlined with =)
            const nextLineIndex = lines.indexOf(line) + 1;
            if (nextLineIndex < lines.length) {
                const nextLine = lines[nextLineIndex].trim();
                if (nextLine.match(/^=+$/) && trimmedLine.length > 0) {
                    return trimmedLine;
                }
            }
        }

        return null;
    }

    private parseMarkdownContent(content: string): TDocumentContent[] {
        const result: TDocumentContent[] = [];
        const lines = content.split('\n');
        let currentBlock = '';
        let blockType: 'text' | 'heading' | 'code' = 'text';

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const trimmedLine = line.trim();

            // Handle headings
            const headingMatch = trimmedLine.match(/^(#{1,6})\s+(.+)$/);
            if (headingMatch) {
                // Push previous block if exists
                if (currentBlock.trim()) {
                    result.push({
                        type: blockType,
                        data: currentBlock.trim(),
                        text: currentBlock.trim(),
                    });
                }

                // Add heading
                result.push({
                    type: 'heading',
                    data: headingMatch[2],
                    text: headingMatch[2],
                });

                currentBlock = '';
                blockType = 'text';
                continue;
            }

            // Handle setext-style headings
            if (i + 1 < lines.length) {
                const nextLine = lines[i + 1].trim();
                if ((nextLine.match(/^=+$/) || nextLine.match(/^-+$/)) && trimmedLine.length > 0) {
                    // Push previous block if exists
                    if (currentBlock.trim()) {
                        result.push({
                            type: blockType,
                            data: currentBlock.trim(),
                            text: currentBlock.trim(),
                        });
                    }

                    // Add setext heading
                    result.push({
                        type: 'heading',
                        data: trimmedLine,
                        text: trimmedLine,
                    });

                    currentBlock = '';
                    blockType = 'text';
                    i++; // Skip the underline
                    continue;
                }
            }

            // Handle code blocks
            if (trimmedLine.match(/^```/)) {
                // Push previous block if exists
                if (currentBlock.trim()) {
                    result.push({
                        type: blockType,
                        data: currentBlock.trim(),
                        text: currentBlock.trim(),
                    });
                }

                // Start collecting code block
                let codeContent = '';
                let codeStarted = false;

                for (let j = i + 1; j < lines.length; j++) {
                    if (lines[j].trim().match(/^```/)) {
                        // End of code block
                        result.push({
                            type: 'code',
                            data: codeContent,
                            text: codeContent,
                        });
                        i = j;
                        codeStarted = false;
                        break;
                    } else {
                        if (codeStarted) codeContent += '\n';
                        codeContent += lines[j];
                        codeStarted = true;
                    }
                }

                currentBlock = '';
                blockType = 'text';
                continue;
            }

            // Regular content
            if (currentBlock) currentBlock += '\n';
            currentBlock += line;
        }

        // Push final block if exists
        if (currentBlock.trim()) {
            result.push({
                type: blockType,
                data: currentBlock.trim(),
                text: currentBlock.trim(),
            });
        }

        // If no content was parsed, return the original content as text
        if (result.length === 0 && content.trim()) {
            result.push({
                type: 'text',
                data: content,
                text: content,
            });
        }

        return result;
    }
}
