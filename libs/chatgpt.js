const config = require('../config');
const { fetchWithCache } = require('./fetch-cache');
const key = config['api-key'];
const server = config['server-url'];

const myHeaders = new Headers();
myHeaders.append('Authorization', `Bearer ${key}`);
myHeaders.append('User-Agent', 'Mozilla/5.0');
myHeaders.append('Content-Type', 'application/json');

async function fetchChatGPT(content) {
    if (!content) return null;

    let raw = JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
            {
                role: 'user',
                content
            }
        ]
    });

    let requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    try {
        let result = await fetchWithCache(server, requestOptions);
        let message = result.choices[0].message.content;
        let parsed = JSON.parse(message);
        return parsed;
    } catch (error) {
        console.log('error', error);
        return null;
    }
}

async function fetchSteps(content) {
    if (!content) return null;

    let result =
        await fetchChatGPT(`You are the assistant of the FOCUS app. The user will provide you his/her task and deadline. You should answer in a json array where each item is in the format {"time": "Time required in minutes", "detail": "Single step task required to complete"}.
Use the user's language to provide the details.
NEVER RETURN ANYTHING ELSE EXCEPT YOUR JSON.
For example, if the user says {{write a 10-page report about climate change}}
You should answer [{"time":"90","detail":"Research climate change facts and sources"},{"time":"30","detail":"Outline report structure and main points"},{"time":"120","detail":"Write report introduction and background"},{"time":"180","detail":"Write report analysis and findings"},{"time":"90","detail":"Write report conclusion and recommendations"},{"time":"30","detail":"Proofread and format report"}]
Now the user says {{${content}}}`);
    return result;
}

async function fetchHints(content, oldHints) {
    if (!content) return null;

    let result =
        await fetchChatGPT(`You are the assistant of the FOCUS app. The user will provide you a vague task. You should answer in a json array where each item is a question to ask the user for more detail. Your questions should not ask for the information the user already provided. The array should have exactly 3 items.
Use the user's language to ask the questions.
${
    oldHints
        ? `You have already provided hints. The previous hints are: ${oldHints}. Only change them if the user has answered them. Otherwise, do not change any character in it.`
        : ''
}
NEVER RETURN ANYTHING ELSE EXCEPT YOUR JSON.
For example, if the user says {{do my homework}} with no previous hints
You should answer ["What subject is your homework?", "How many assignments do you have?", "How much time do you have to finish them?"]
Now the user says {{${content}}}`);
    return result;
}

module.exports = {
    fetchSteps,
    fetchHints
};
