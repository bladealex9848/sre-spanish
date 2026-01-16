import { Doc } from '@smythos/sdk';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

async function main() {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const pdfFilePath = path.join(__dirname, '../files/bitcoin.pdf');
    const docxFilePath = path.join(__dirname, '../files/bitcoin.docx');
    const txtFilePath = path.join(__dirname, '../files/bitcoin.txt');
    const markdownFilePath = path.join(__dirname, '../files/bitcoin.md');

    //We can use Doc.auto to let the SDK choose a parser automatically
    const parsedDoc = await Doc.auto.parse(pdfFilePath);
    console.log(parsedDoc);

    //or we can explicitly choose a parser

    //PDF
    const parsedPDFDoc = await Doc.pdf.parse(pdfFilePath);
    console.log(parsedPDFDoc);

    //DOCX
    const parsedDocxDoc = await Doc.docx.parse(docxFilePath);
    console.log(parsedDocxDoc);

    //Markdown with custom metadata
    const parsedMarkdownDoc = await Doc.md.parse(markdownFilePath, {
        title: 'Bitcoin',
        author: 'Satoshi Nakamoto',
        date: '2009-01-03',
        tags: ['bitcoin', 'crypto', 'blockchain'],
    });
    console.log(parsedMarkdownDoc);

    //Text with custom metadata
    const parsedTxtDoc = await Doc.text.parse(txtFilePath, {
        title: 'Bitcoin',
        author: 'Satoshi Nakamoto',
        date: '2009-01-03',
        tags: ['bitcoin', 'crypto', 'blockchain'],
    });
    console.log(parsedTxtDoc);

    //Text from a string
    const stringContent = fs.readFileSync(txtFilePath, 'utf8');
    const parsedString = await Doc.text.parse(stringContent, {
        title: 'Bitcoin',
        author: 'Satoshi Nakamoto',
        date: '2009-01-03',
        tags: ['bitcoin', 'crypto', 'blockchain'],
    });
    console.log(parsedString);
}

main();
