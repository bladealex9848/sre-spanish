import { DocParser, TDocumentParseSettings } from './DocParser.class';

export class DocInstance {
    constructor(private _parser: DocParser) {}

    async parse(_source: string, _params: TDocumentParseSettings) {
        return await this._parser.parse(_source, _params);
    }
}
