const request = require('supertest');
const app = require('../../app');
const chai = require('chai');
const sinon = require('sinon');
const expect = chai.expect;

describe('REST Auth API', () => {
  afterEach(() => {
    sinon.restore();
  });

  it('should register a user', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({ username: 'test', password: '123', role: 'user' });
    expect(res.statusCode).to.equal(201);
    expect(res.body).to.have.property('username', 'test');
  });

  it('should login a user', async () => {
    await request(app)
      .post('/auth/register')
      .send({ username: 'login', password: '123', role: 'user' });
    const res = await request(app)
      .post('/auth/login')
      .send({ username: 'login', password: '123' });
    expect(res.statusCode).to.equal(200);
    expect(res.body).to.have.property('token');
  });

  it('should stub a service with sinon', async () => {
    const authService = require('../../services/authService');
    const stub = sinon.stub(authService, 'register').returns({ id: 99, username: 'stub', role: 'user' });
    const res = await request(app)
      .post('/auth/register')
      .send({ username: 'stub', password: '123', role: 'user' });
    expect(res.statusCode).to.equal(201);
    expect(res.body).to.have.property('username', 'stub');
    stub.restore();
  });
});
