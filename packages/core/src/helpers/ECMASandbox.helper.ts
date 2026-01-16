import 'ses';




export function runJs(code: string) {
    // Call lockdown to secure the environment
    lockdown();
    try {
        // Endow the compartment with necessary APIs
        const compartment = new Compartment({
            globals: {
                // add necessary globals here
                setTimeout: harden(setTimeout),
                clearTimeout: harden(clearTimeout),
                setInterval: harden(setInterval),
                clearInterval: harden(clearInterval),
                console: harden(console),
                Promise: harden(Promise),
                fetch: harden(fetch),
            },
            __options__: true, // temporary migration affordance
        });
        const result = compartment.evaluate(code);
        return result;
    } catch (error) {
        console.error(error);
        throw error;
    }

}

function getParametersString(parameters: string[], inputs: Record<string, any>) {
    let params = [];
    for (const parameter of parameters) {
        if (typeof inputs[parameter] === 'string') {
            params.push(`'${inputs[parameter]}'`);
        } else {
            params.push(`${inputs[parameter]}`);
        }
    }
    return params.join(',');
}

export function generateExecutableCode(code: string, parameters: string[], inputs: Record<string, any>) {
    const executableCode = `
    (async () => {
        ${code}
        const result = await main(${getParametersString(parameters, inputs)});
        return result;
    })();
    `
    return executableCode;
}
