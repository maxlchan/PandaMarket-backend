const request = require('supertest');
const { expect } = require('chai');
const app = require('../app');
const { ROUTES, RESPONSE } = require('../constants');

describe('auction controller', () => {
  describe('<GET /auctions>', function () {
    this.timeout(10000);

    it('should respond "ok" if client get all auctions info', (done) => {
      request(app)
        .get(ROUTES.AUCTIONS)
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body.result).to.eql(RESPONSE.OK);
          done();
        });
    });
  });

  describe('<PUT /auctions>', function () {
    this.timeout(10000);

    const tokenForRequest =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZmQ5Y2I3NDhjNTIyOGYzNzZmNWZlY2MiLCJlbWFpbCI6ImNvaW40NmNvaW40NkBnbWFpbC5jb20iLCJuYW1lIjoi6rmA7LCs7KSRIiwiaWF0IjoxNjA4Mjc2MTAwfQ.V03RbJqV-Stc1PX3BSIURb9m474X0FKMfNxzDnpl08w';
    const mockAuctionId = '5fdb6eea8fdf7a1730e8e7a8';

    it('should respond with result and updatedAuctionsInfo, when put reserve autions api', (done) => {
      request(app)
        .put(`${ROUTES.AUCTIONS}/${mockAuctionId}${ROUTES.RESERVE}`)
        .set('Authorization', tokenForRequest)
        .expect('Content-Type', /json/)
        .expect(200)
        .end(async (err, res) => {
          if (err) return done(err);
          const { result, updatedAuctionsInfo } = res.body;
          const updatedAuction = updatedAuctionsInfo.find((auction) => {
            return auction._id === mockAuctionId;
          });
          const lastReservedUserId = updatedAuction.reservedUser.slice(-1);

          expect(result).to.eql(RESPONSE.OK);
          expect(lastReservedUserId).to.exist;
          done();
        });
    });

    it('should respond with result ok, when put start autions api', (done) => {
      request(app)
        .put(`${ROUTES.AUCTIONS}/${mockAuctionId}${ROUTES.START}`)
        .set('Authorization', tokenForRequest)
        .expect('Content-Type', /json/)
        .expect(200)
        .end(async (err, res) => {
          if (err) return done(err);
          const { result } = res.body;
          expect(result).to.eql(RESPONSE.OK);
          done();
        });
    });

    it('should respond with result ok, when put finish autions api', (done) => {
      request(app)
        .put(`${ROUTES.AUCTIONS}/${mockAuctionId}${ROUTES.FINISH}`)
        .set('Authorization', tokenForRequest)
        .expect('Content-Type', /json/)
        .expect(200)
        .end(async (err, res) => {
          if (err) return done(err);
          const { result } = res.body;
          expect(result).to.eql(RESPONSE.OK);
          done();
        });
    });
  });
});
