const request = require('supertest');
const app = require('../server');

describe('Book Endpoints', () => {
  let authToken;
  let authorId;
  let bookId;
  let studentId;
  let attendantId;

  beforeAll(async () => {
    await request(app)
      .post('/api/attendants')
      .send({
        name: 'Test Attendant',
        staffId: 'TEST001',
        password: 'testpass123'
      });

    const loginRes = await request(app)
      .post('/api/attendants/login')
      .send({
        staffId: 'TEST001',
        password: 'testpass123'
      });

    authToken = loginRes.body.data.token;
    const authorRes = await request(app)
      .post('/api/authors')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ name: 'Test Author', bio: 'Test Bio' });
    authorId = authorRes.body.data.author._id;
    const studentRes = await request(app)
      .post('/api/students')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        name: 'Test Student',
        email: 'test@student.edu',
        studentId: 'TST001'
      });
    studentId = studentRes.body.data.student._id;

    attendantId = loginRes.body.data.attendant.id;
  });

  describe('POST /api/books', () => {
    it('should create a new book', async () => {
      const res = await request(app)
        .post('/api/books')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Test Book',
          isbn: 'ISBN-9781234567890',
          authors: [authorId]
        });

      expect(res.status).toBe(201);
      expect(res.body.status).toBe('success');
      expect(res.body.data.book.title).toBe('Test Book');
      bookId = res.body.data.book._id;
    });

    it('should reject duplicate ISBN', async () => {
      const res = await request(app)
        .post('/api/books')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Another Book',
          isbn: 'ISBN-9781234567890',
          authors: [authorId]
        });

      expect(res.status).toBe(400);
    });
  });

  describe('POST /api/books/:id/borrow', () => {
    it('should borrow a book', async () => {
      const res = await request(app)
        .post(`/api/books/${bookId}/borrow`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          studentId,
          attendantId,
          returnDate: '2026-12-31'
        });

      expect(res.status).toBe(200);
      expect(res.body.data.book.status).toBe('OUT');
      expect(res.body.data.book.borrowedBy).toBeDefined();
    });

    it('should reject borrowing already borrowed book', async () => {
      const res = await request(app)
        .post(`/api/books/${bookId}/borrow`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          studentId,
          attendantId,
          returnDate: '2026-12-31'
        });

      expect(res.status).toBe(400);
    });
  });

  describe('POST /api/books/:id/return', () => {
    it('should return a book', async () => {
      const res = await request(app)
        .post(`/api/books/${bookId}/return`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.book.status).toBe('IN');
      expect(res.body.data.book.borrowedBy).toBeNull();
    });
  });
});
