const readline = require('readline');

function generatePayload(type, depth) {
    const baseKey = type === 'translate' ? '%1$s' : '@e';
    const keyName = type === 'translate' ? 'translate' : 'selector';

    let payload = `{ "${keyName}": "${baseKey}"`;

    for (let i = 0; i < depth; i++) {
        payload += `,"with":[{ "${keyName}": "${baseKey}"`;
    }

    // close the nested objects and arrays in reverse order
    for (let i = 0; i < depth; i++) {
        payload += `}]`;
    }

    payload += ` }`; // close the initial object
    return payload.replace(/\s+/g, '');
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('Type (translate / selector): ', (typeInput) => {
    const type = typeInput.trim().toLowerCase();
    if (type !== 'translate' && type !== 'selector') {
        console.log('Invalid type. Must be "translate" or "selector".');
        rl.close();
        return;
    }

    rl.question('How many layers deep? ', (depthInput) => {
        const depth = parseInt(depthInput);
        if (isNaN(depth) || depth < 1) {
            console.log('Enter a valid positive number.');
            rl.close();
            return;
        }

        const payload = generatePayload(type, depth);
        console.log('\nGenerated JSON:\n');
        console.log(payload);
        rl.close();
    });
});