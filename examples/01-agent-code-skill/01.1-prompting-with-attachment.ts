import { Agent, Scope } from '@smythos/sdk';

async function main() {
    const agent = new Agent({
        id: 'image-analyser',

        name: 'Image Analyser',
        behavior: 'You are a image analyser. You are given a image url and you need to analyse the image',
        model: 'gpt-4o',
    });

    const imgSkill = agent.addSkill({
        name: 'ImageAnalyser',
        description: 'Any attachment should be processed by this function',
        process: async ({ image_url }) => {
            console.log(image_url);
            return 'Image analysed';
        },
    });
    imgSkill.in({
        image_url: {
            type: 'Binary',
            description: 'The image url that we will analyze',
        },
    });

    const promptResult = await agent.prompt('Analyze this image please ', {
        files: ['https://www.robuxio.com/wp-content/uploads/2023/05/Trend.png'],
    });
    console.log(promptResult);
}

main();
