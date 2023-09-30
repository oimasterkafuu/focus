const { expect } = require('chai');
const { fetchSteps, fetchHints } = require('../libs/chatgpt');

describe('Test fetch steps', function () {
    this.timeout(10000);
    let chat;
    before(async () => {
        chat = await fetchSteps('Finish my two-page math homework in 30 minutes');
    });
    it('should return an array of steps', () => {
        expect(chat).to.be.an('array');
        expect(chat.length).to.be.greaterThan(0);
    });
    it(`should return an array in valid format`, () => {
        chat.forEach((step) => {
            expect(step).to.have.all.keys('time', 'detail');
        });
    });
});

describe('Test fetch hints', function () {
    this.timeout(10000);
    let chat;
    before(async () => {
        chat = await fetchHints('Finish my homework');
    });
    it('should return an array of details', () => {
        expect(chat).to.be.an('array');
    });
    it(`should return at least 5 items`, () => {
        expect(chat.length).to.be.at.least(5);
    });
});
