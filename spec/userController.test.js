const jwt = require('jsonwebtoken');
const request = require('supertest');
const { expect } = require('chai');
const app = require('../app');
const { ROUTES, RESPONSE } = require('../constants');

describe('user controller', () => {
  describe('<POST /users/login>', function () {
    this.timeout(10000);

    const userForRequest = {
      name: '김찬중',
      email: 'coin46coin46@gmail.com',
      imageUrl:
        'https://lh3.googleusercontent.com/a-/AOh14Gjw72MJPdh9YEg6pR8ADv303C3C9go-Y0TJfLyI=s96-c',
    };

    it('should respond with token, userInfo if requests login', (done) => {
      request(app)
        .post(`${ROUTES.USERS}${ROUTES.LOGIN}`)
        .send(userForRequest)
        .expect('Content-Type', /json/)
        .expect(200)
        .end(async (err, res) => {
          if (err) return done(err);

          const { userInfo, token } = res.body;
          const secretKey = process.env.JWT_SECRET;
          const decodedUser = jwt.verify(token, secretKey);
          tokenForRequest = token;

          expect(userInfo.name).to.eql(userForRequest.name);
          expect(userInfo.email).to.eql(userForRequest.email);
          expect(userInfo.imageUrl).to.eql(userForRequest.imageUrl);
          expect(userInfo.name).to.eql(decodedUser.name);
          expect(userInfo.email).to.eql(decodedUser.email);
          expect(userInfo._id).to.eql(decodedUser._id);

          done();
        });
    });
  });

  describe('<POST /users/login/token>', function () {
    this.timeout(10000);

    const userForRequest = {
      name: '김찬중',
      email: 'coin46coin46@gmail.com',
      imageUrl:
        'https://lh3.googleusercontent.com/a-/AOh14Gjw72MJPdh9YEg6pR8ADv303C3C9go-Y0TJfLyI=s96-c',
    };
    let tokenForRequest;

    before((done) => {
      request(app)
        .post('/users/login')
        .send(userForRequest)
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          tokenForRequest = res.body.token;
          done();
        });
    });

    after(() => {
      token = '';
    });

    it('should respond with userInfo if user request login only by token', (done) => {
      request(app)
        .post(`${ROUTES.USERS}${ROUTES.LOGIN}${ROUTES.TOKEN}`)
        .set('Authorization', tokenForRequest)
        .expect('Content-Type', /json/)
        .expect(200)
        .end(async (err, res) => {
          if (err) return done(err);
          const { userInfo } = res.body;

          expect(userInfo.name).to.eql(userForRequest.name);
          expect(userInfo.email).to.eql(userForRequest.email);
          expect(userInfo.imageUrl).to.eql(userForRequest.imageUrl);
          done();
        });
    });

    it('should respond errMessage, if token is invalid', (done) => {
      request(app)
        .post(`${ROUTES.USERS}${ROUTES.LOGIN}${ROUTES.TOKEN}`)
        .set('Authorization', 'invalidToken')
        .expect('Content-Type', /json/)
        .expect(401)
        .end(async (err, res) => {
          if (err) return done(err);

          expect(res.body.result).to.eql(RESPONSE.UNAUTHORIZED);
          done();
        });
    });
  });
});
