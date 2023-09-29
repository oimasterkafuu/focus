const config = require('../config.json');
const key = config['api-key'];
const server = config['server-url'];

const myHeaders = new Headers();
myHeaders.append('Authorization', `Bearer ${key}`);
myHeaders.append('User-Agent', 'Mozilla/5.0');
myHeaders.append('Content-Type', 'application/json');

async function fetchChatGPT(content) {
    const raw = JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
            {
                role: 'user',
                content
            }
        ]
    });

    const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    try {
        let response = await fetch(server, requestOptions);
        let text = await response.text();
        let result = JSON.parse(text);
        let message = result.choices[0].message.content;
        let parsed = JSON.parse(message);
        return parsed;
    } catch (error) {
        console.log('error', error);
        return null;
    }
}

async function fetchSteps(content) {
    let result =
        await fetchChatGPT(`You are the assistant of the FOCUS app. The user will provide you his/her tasks. You should answer in a json array where each item is in the format {"time": "Time required in minutes", "detail": "Single step task required to complete"}.
Use the user's language to provide the details.
For example, if the user says {{Write an article about flowers}}
You should answer [{"time":"20","detail":"Research flowers"},{"time":"10","detail":"Outline article"},{"time":"10","detail":"Write introduction"},{"time":"30","detail":"Write body"},{"time":"20","detail":"Write conclusion"},{"time":"20","detail":"Proofread article"}] (a valid JSON of several steps, not containing any other character)
Now user says {{${content}}}`);
    return result;
}

module.exports = {
    fetchSteps
};
