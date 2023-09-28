const { expect } = require('chai');
const { fetchChatGPT } = require('../libs/chatgpt');

describe('Test fetch steps', function () {
    this.timeout(10000);

    let chat;

    before(async function () {
        chat = await fetchChatGPT('Finish my two-page math homework in 30 minutes');
    });

    it('should return an array of steps', async function () {
        await expect(chat).to.be.an('array');
    });
    it('should return an array of steps with length > 0', async function () {
        await expect(chat.length).to.be.greaterThan(0);
    });
    it(`should return an array that every item is made of {"time": "Time required in minutes", "detail": "Single step task required to complete"}`, async function () {
        await chat.forEach((step) => {
            expect(step).to.have.all.keys('time', 'detail');
        });
    });
});
