const readline = require('readline');

function generateRecursiveTranslate(depth) {
    let payload = `{"translate":"%1$s"`;
    for (let i = 0; i < depth; i++) {
        payload += `,"with":[{"translate":"%1$s"`;
    }
    for (let i = 0; i < depth; i++) {
        payload += `}]`;
    }
    payload += `}`;
    return payload;
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log("how many layers?")
rl.question('|> ', (input) => {
    const depth = parseInt(input);
    if (isNaN(depth) || depth < 1) {
        console.log('enter a valid number');
    } else {
        const payload = generateRecursiveTranslate(depth);
        console.log('\npayload:\n');
        console.log(payload);
    }
    rl.close();
});