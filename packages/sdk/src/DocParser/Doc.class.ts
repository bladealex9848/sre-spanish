import { DocParser } from './DocParser.class';
import { AutoParser } from './parsers/AutoParser.class';
import { DOCXParser } from './parsers/DOCXParser.class';
import { MarkdownParser } from './parsers/MarkdownParser.class';
import { PDFParser } from './parsers/PDFParser.class';
import { TextParser } from './parsers/TextParser.class';

/**
 * Doc provides an easy way to parse documents of different types.
 * It can automatically choose the best parser for the file based on the file MIME type or file extension.
 * Or let you explicitly choose a parser.
 *
 *
 * @example
 * ```typescript
 * const doc = await Doc.auto.parse('path/to/file.pdf');
 * const doc = await Doc.pdf.parse('path/to/file.pdf');
 * const doc = await Doc.docx.parse('path/to/file.docx');
 * const doc = await Doc.md.parse('path/to/file.md');
 * const doc = await Doc.text.parse('path/to/file.txt');
 * ```
 * @namespace Doc
 */
export const Doc = {
    /**
     * Automatic parser
     *
     * @example
     * ```typescript
     * const doc = await Doc.auto.parse('path/to/file.pdf');
     * ```
     */
    auto: new AutoParser(),
    /**
     * PDF parser
     *
     * @example
     * ```typescript
     * const doc = await Doc.pdf.parse('path/to/file.pdf');
     * ```
     */
    pdf: new PDFParser(),
    /**
     * DOCX parser
     *
     * @example
     * ```typescript
     * const doc = await Doc.docx.parse('path/to/file.docx');
     * ```
     */
    docx: new DOCXParser(),
    /**
     * Markdown parser
     *
     * @example
     * ```typescript
     * const doc = await Doc.md.parse('path/to/file.md');
     * ```
     */
    md: new MarkdownParser(),
    /**
     * Text parser
     *
     * @example
     * ```typescript
     * const doc = await Doc.text.parse('path/to/file.txt');
     * ```
     */
    text: new TextParser(),
};

export type TDocType = keyof typeof Doc;

// Extensible interface for custom providers
export interface IDocParsers {}
// Combined provider type that can be extended
export type TDocParser = TDocType | keyof IDocParsers;

export type TDocParserFactory = {
    [K in TDocParser]: DocParser;
};

// This ensures that Doc is compatible with the factory type,
// which is useful for module augmentation.
const _: TDocParserFactory = Doc;

// Ensure consistent casing
_.md = _.md || new MarkdownParser();
_.text = _.text || new TextParser();
_.pdf = _.pdf || new PDFParser();
_.docx = _.docx || new DOCXParser();
_.auto = _.auto || new AutoParser();
