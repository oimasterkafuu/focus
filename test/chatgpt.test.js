const { expect } = require('chai');
const { fetchSteps } = require('../libs/chatgpt');

describe('Test fetch steps', function () {
    this.timeout(10000);

    let chat;

    before(async function () {
        chat = await fetchSteps('Finish my two-page math homework in 30 minutes');
    });

    it('should return an array of steps', function () {
        expect(chat).to.be.an('array');
        expect(chat.length).to.be.greaterThan(0);
    });
    it(`should return an array in valid format`, function () {
        chat.forEach((step) => {
            expect(step).to.have.all.keys('time', 'detail');
        });
    });
});
