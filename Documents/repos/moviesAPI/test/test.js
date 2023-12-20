const request = require('supertest');
const { app, db } = require('../app');



describe('Movies API', () => {
  test('GET / should respond with Hello World!!', async () => {
    const res = await request(app)
      .get('/')
      .expect(200)
      .expect('Content-Type', /text/);
    expect(res.text).toEqual('Hello World!!');
  });


  test('GET /movies should respond with a list of movies', async () => {
    const response = await request(app)
      .get('/movies')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(Array.isArray(response.body)).toBeTruthy();
    expect(response.body.length).toBeGreaterThan(0);
    response.body.forEach(movie => {
      expect(movie).toHaveProperty('movies_id');
      expect(movie).toHaveProperty('name');
      expect(movie).toHaveProperty('genre');
      expect(movie).toHaveProperty('releaseYear');
      expect(movie).toHaveProperty('rating');
    });
  });

  test('GET /movies/:id should respond with a single movie', async () => {
    const res = await request(app)
      .get('/movies/2') 
      .expect('Content-Type', /json/)
      .expect(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0]).toHaveProperty('movies_id', 2);
  });

  test('POST /movies should create a new movie', async () => {
    const newMovie = {
      name: 'Thor: Love and Thunder',
      genre: 'Action/Adventure',
      releaseYear: 2022,
      rating: 6.3
    };
    const res = await request(app)
      .post('/movies')
      .send(newMovie)
      .expect(201);
    expect(res.text).toEqual('Created');
  });

  test('PUT /movies/:id should update an existing movie', async () => {
    const updatedMovie = {
      name: 'Doctor Strange in the Multiverse of Madness',
      genre: 'Fantasy/Horror',
      releaseYear: 2022,
      rating: 6.9
    };
    const res = await request(app)
      .put('/movies/97') 
      .send(updatedMovie)
      .expect(200);
    expect(res.text).toEqual('OK');
  });

  test('DELETE /movies/:id should delete an existing movie', async () => {
    const res = await request(app)
      .delete('/movies/97')  
      .expect(200);
    expect(res.text).toEqual('OK');
  });

});

afterAll(done => {
  db.close(done);
});

