const request = require('supertest');
const { expect } = require('chai');
const app = require('../app');

describe('GET /', function () {
    it('should return "It works!"', async () => {
        const response = await request(app).get('/');
        expect(response.status).to.be.equal(200);
        expect(response.text).to.be.equal('It works!');
    });
});
