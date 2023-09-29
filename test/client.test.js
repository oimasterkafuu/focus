const request = require('supertest');
const { expect } = require('chai');
const app = require('../app');

describe('GET /', function () {
    this.timeout(10000);
    let response;
    before(async () => {
        response = await request(app).get('/');
    });
    it('should return "It works!"', () => {
        expect(response.status).to.be.equal(200);
        expect(response.text).to.be.equal('It works!');
    });
});

describe('POST /api/fetchSteps', function () {
    this.timeout(10000);
    let response;
    before(async () => {
        response = await request(app)
            .post('/api/fetchSteps/')
            .send({ task: 'Finish my four-page math homework in an hour' });
    });
    it('should return steps', () => {
        expect(response.status).to.be.equal(200);
        expect(response.body.success).to.be.equal(true);
        console.log(response.body.steps);
    });
});
