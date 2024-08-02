import request from 'supertest';
import { expect } from 'chai';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import { app, server } from '../../server.js';

dotenv.config();

// Setup before tests run
before(async function() {
  this.timeout(10000); // Increase timeout if needed

  try {
    // Connect to the database
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to Database");

    // Clear the database
    await mongoose.connection.db.dropDatabase();
    console.log("Database cleared");

    // Sign up users
    await request(app)
      .post('/api/signUp')
      .send({ email: 'user@example.com', password: 'Password123' })
      .expect(200);

    await request(app)
      .post('/api/signUp')
      .send({ email: 'supervisor@example.com', password: 'Password123' })
      .expect(200);

    await request(app)
      .post('/api/signUp')
      .send({ email: 'admin@example.com', password: 'Password123' })
      .expect(200);

    // Update roles
    await mongoose.connection.db.collection('usermodels').updateOne(
      { email: 'supervisor@example.com' },
      { $set: { 'roles.0': 'ROLE_SUPERVISOR' } }
    );

    await mongoose.connection.db.collection('usermodels').updateOne(
      { email: 'admin@example.com' },
      { $set: { 'roles.0': 'ROLE_ADMIN' } }
    );

    console.log("Test setup completed successfully");
  } catch (error) {
    console.error("Error in test setup:", error);
    throw error; // This will cause the tests to fail if setup fails
  }
});

// Close the database connection and server after all tests
after(async function() {
  await mongoose.connection.close();
  server.close();
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


  describe('GET /api/supervisorBoard', () => {
    it('should return supervisor board content for authenticated supervisor', (done) => {
      request(app)
          .post('/api/signIn')
          .send({ email: 'supervisor@example.com', password: 'Password123' })
          .expect(200)
          .end((err, res) => {
              if (err) return done(err);
              const token = res.body.message.accessToken;
              request(app)
                  .get('/api/supervisorBoard')
                  .set('x-access-token', token)
                  .expect(200)
                  .end((err, res) => {
                      if (err) return done(err);
                      expect(res.text).to.equal('welcome to the Supervisor Board');
                      done();
                  });
          });
    });
  });

  describe('GET /api/adminBoard', () => {
    it('should return admin board content for authenticated admin', (done) => {
      request(app)
          .post('/api/signIn')
          .send({ email: 'admin@example.com', password: 'Password123' })
          .expect(200)
          .end((err, res) => {
              if (err) return done(err);
              const token = res.body.message.accessToken;
              request(app)
                  .get('/api/adminBoard')
                  .set('x-access-token', token)
                  .expect(200)
                  .end((err, res) => {
                      if (err) return done(err);
                      expect(res.text).to.equal('welcome to the Admin Board');
                      done();
                  });
          });
    });
  });

  describe('PUT /api/addSupervisor', () => {
    it('should add a supervisor for authenticated admin', (done) => {
      request(app)
          .post('/api/signIn')
          .send({ email: 'admin@example.com', password: 'Password123' })
          .expect(200)
          .end((err, res) => {
              if (err) return done(err);
              const token = res.body.message.accessToken;
              request(app)
                  .put('/api/addSupervisor')
                  .set('x-access-token', token)
                  .send({ email: 'user@example.com' })
                  .expect(200)
                  .end((err, res) => {
                      if (err) return done(err);
                      done();
                  });
          });
    });
  });

  describe('PUT /api/removeSupervisor', () => {
    it('should remove a supervisor for authenticated admin', (done) => {
      request(app)
          .post('/api/signIn')
          .send({ email: 'admin@example.com', password: 'Password123' })
          .expect(200)
          .end((err, res) => {
              if (err) return done(err);
              const token = res.body.message.accessToken;
              request(app)
                  .put('/api/removeSupervisor')
                  .set('x-access-token', token)
                  .send({ email: 'user@example.com' })
                  .expect(200)
                  .end((err, res) => {
                      if (err) return done(err);
                      done();
                  });
          });
  });
});

});
