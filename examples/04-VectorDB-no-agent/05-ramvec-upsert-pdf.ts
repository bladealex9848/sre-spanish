import { VectorDB, Model, AccessCandidate } from '@smythos/sdk';
import dotenv from 'dotenv';

import { Doc } from '@smythos/sdk';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = path.join(__dirname, '../files/bitcoin.pdf');

dotenv.config();

async function main() {
    //RAMVec is a zero config in memory vector db
    //don't use it for production, you can use it to get started quickly and test your code

    const pinecone = VectorDB.RAMVec('test');

    // This will wipe all the data in 'test' namespace
    await pinecone.purge();

    const parsedDoc = await Doc.pdf.parse(filePath);

    const result = await pinecone.insertDoc('test', parsedDoc, { myEntry: 'My Metadata' });
    console.log(result);
    const searchResult = await pinecone.search('Proof-of-Work', { topK: 5 });
    console.log(searchResult);
    const result2 = await pinecone.insertDoc('test', 'Hello, world! 2');
    console.log('2', result2);

    console.log('done');
}

main();
