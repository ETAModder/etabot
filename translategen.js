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

rl.question('How many layers deep? ', (input) => {
    const depth = parseInt(input);
    if (isNaN(depth) || depth < 1) {
        console.log('Enter a valid positive number.');
    } else {
        const payload = generateRecursiveTranslate(depth);
        console.log('\nGenerated JSON:\n');
        console.log(payload);
    }
    rl.close();
});


const payload = generateRecursiveTranslate(10);
console.log(payload);