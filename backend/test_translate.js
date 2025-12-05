const fetch = require('node-fetch');

async function test() {
    try {
        const response = await fetch('http://localhost:4000/api/translate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: 'Hello', target: 'es' })
        });
        const data = await response.json();
        console.log(JSON.stringify(data, null, 2));
    } catch (e) {
        console.error(e);
    }
}

test();
