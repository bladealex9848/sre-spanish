import { Storage } from '@smythos/sdk';

async function main() {
    const localStorage = Storage.S3({
        region: process.env.AWS_REGION,
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        bucket: process.env.AWS_BUCKET_NAME
    })

    await localStorage.write('test.txt', 'Hello, world!');

    const data = await localStorage.read('test.txt');

    const dataAsString = data.toString();

    console.log(dataAsString);

}

main();