import request from 'supertest';
import { expect } from 'chai';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

import app from '../../server.js';


before((done) => {
    mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    }, (err) => {
      if (err) {
        console.log("Error connecting to database. " + err);
        done(err);
      } else {
        console.log("Connected to Database");
        // Delete all documents from all collections
        mongoose.connection.db.dropDatabase(() => {
          console.log("Database cleared");
          done();
        });
      }
    });
  });

describe('API Routes', () => {

  describe('POST /api/signUp', () => {
    it('should sign up a user', (done) => {
      request(app)
        .post('/api/signUp')
        .send({ email: 'test@example.com', password: 'Password123' })
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.have.property('message', 'user is registered successfully');
          done();
        });
    });

    it('should not sign up a user with an existing email', (done) => {
      request(app)
        .post('/api/signUp')
        .send({ email: 'test@example.com', password: 'Password123' })
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.have.property('message', 'email already exists');
          done();
        });
    });
  });

  describe('POST /api/signIn', () => {
  it('should sign in a user', (done) => {
    request(app)
      .post('/api/signIn')
      .send({ email: 'test@example.com', password: 'Password123' })
      .set('x-access-token', 'eyJhbGciOiJIUzI1NiIsInR')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });
});

  describe('GET /api/homeBoard', () => {
    it('should return home board content', (done) => {
      request(app)
        .get('/api/homeBoard')
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.text).to.equal('Welcome to the home page');
          done();
        });
    });
  });

  describe('GET /api/userBoard', () => {
    it('should return user board content for authenticated user', (done) => {
      // sign up and sign in a user to get a valid token
        request(app)
            .post('/api/signUp')
            .send({ email: 'test@gmail.com', password: 'Password123' })
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                request(app)
                    .post('/api/signIn')
                    .send({ email: 'test@gmail.com', password: 'Password123' })
                    .expect(200)
                    .end((err, res) => {
                        if (err) return done(err);
                        const token = res.body.message.accessToken;
                        request(app)
                            .get('/api/userBoard')
                            .set('x-access-token', token)
                            .expect(200)
                            .end((err, res) => {
                                if (err) return done(err);
                                expect(res.text).to.equal('welcome to the User Board');
                                done();
                            });
                    });
            });
        });
    });


  describe.only('GET /api/supervisorBoard', async () => {
    it('should return supervisor board content for authenticated supervisor', async (done) => {
      // sign up and sign in a user to get a valid token
      await request(app)
      .post('/api/signUp')
      .send({ email: 'test@gmail.com', password: 'Password123' })
      .expect(200)
      .end(async (err, res) => {
          if (err) return done(err);
          await request(app)
              .post('/api/signIn')
              .send({ email: 'test@gmail.com', password: 'Password123' })
              .expect(200)
              .end(async (err, res) => {
                  if (err) return done(err);
                    const result = await mongoose.connection.db.collection('usermodels').updateOne(
                      { email: 'test@gmail.com' },
                      { $set: { 'roles.0': 'ROLE_SUPERVISOR' } }
                    );
                    // You can check the result here if needed
                    console.log(result);

                  const token = res.body.message.accessToken;
                  await request(app)
                      .get('/api/superviserBoard')
                      .set('x-access-token', token)
                      .expect(200)
                      .end((err, res) => {
                          if (err) return done(err);
                          expect(res.text).to.equal('welcome to the User Board');
                          done();
                      });
              });
      });
    });
  });

  describe('GET /api/adminBoard', () => {
    it('should return admin board content for authenticated admin', (done) => {
      const token = 'valid-admin-token'; // Replace with a valid token
      request(app)
        .get('/api/adminBoard')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.have.property('content');
          done();
        });
    });
  });

  describe('PUT /api/updateProfile', () => {
    it('should update user profile', (done) => {
      const token = 'valid-jwt-token'; // Replace with a valid token
      request(app)
        .put('/api/updateProfile')
        .set('Authorization', `Bearer ${token}`)
        .send({ email: 'newemail@example.com' })
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.have.property('message', 'Profile updated successfully');
          done();
        });
    });
  });

  describe('GET /api/getAllUsers', () => {
    it('should return all users for authenticated supervisor', (done) => {
      const token = 'valid-supervisor-token'; // Replace with a valid token
      request(app)
        .get('/api/getAllUsers')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.be.an('array');
          done();
        });
    });
  });

  describe('GET /api/getAllRoles', () => {
    it('should return all roles for authenticated admin', (done) => {
      const token = 'valid-admin-token'; // Replace with a valid token
      request(app)
        .get('/api/getAllRoles')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.be.an('array');
          done();
        });
    });
  });

  describe('GET /api/getAllSupervisors', () => {
    it('should return all supervisors for authenticated admin', (done) => {
      const token = 'valid-admin-token'; // Replace with a valid token
      request(app)
        .get('/api/getAllSupervisors')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.be.an('array');
          done();
        });
    });
  });

  describe('PUT /api/addSupervisor', () => {
    it('should add a supervisor for authenticated admin', (done) => {
      const token = 'valid-admin-token'; // Replace with a valid token
      request(app)
        .put('/api/addSupervisor')
        .set('Authorization', `Bearer ${token}`)
        .send({ userId: 'valid-user-id' }) // Replace with a valid user ID
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.have.property('message', 'Supervisor added successfully');
          done();
        });
    });
  });

  describe('PUT /api/removeSupervisor', () => {
    it('should remove a supervisor for authenticated admin', (done) => {
      const token = 'valid-admin-token'; // Replace with a valid token
      request(app)
        .put('/api/removeSupervisor')
        .set('Authorization', `Bearer ${token}`)
        .send({ userId: 'valid-user-id' }) // Replace with a valid user ID
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.have.property('message', 'Supervisor removed successfully');
          done();
        });
    });
  });

});
