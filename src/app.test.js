const assert = require('assert').strict;
const supertest = require('supertest');

const app = require('./app');
const db = require('./db');
const User = require('./user');

before(async () => {
  await db.commands.drop();
  await db.commands.create();
});

describe('app', function() {
  beforeEach(async () => {
    await db.commands.dropTables();
    await db.commands.createTables();
  });

  it('POST /register', async () => {
    await supertest(app)
      .post('/register')
      .send({ username: 'john', password: 'asdfjkl;' })
      .expect(res => {
        assert.strictEqual(res.statusCode, 200);
      });

    await supertest(app)
      .post('/register')
      .send({ username: 'john', password: 'adfkslkj' })
      .expect(res => {
        assert.strictEqual(res.statusCode, 400);
      });

    await supertest(app)
      .post('/register')
      .send({ username: '', password: 'johnjohn' })
      .expect(res => {
        assert.strictEqual(res.statusCode, 400);
      });
    await supertest(app)
      .post('/register')
      .send({ username: 'johnjohn', password: '' })
      .expect(res => {
        assert.strictEqual(res.statusCode, 400);
      });
  });

  it('POST /login', async () => {
    await User.register('john', 'abcdefg');

    await supertest(app)
      .post('/login')
      .send({ username: 'john', password: 'asdfjkl;' })
      .expect(res => {
        assert.strictEqual(res.statusCode, 400);
      });

    await supertest(app)
      .post('/login')
      .send({ username: 'john', password: 'abcdefg' })
      .expect(res => {
        assert.strictEqual(res.statusCode, 200);
      });
  });

  it('GET /data', async () => {
    const u = await User.register('john', 'abcdefg');
    const authToken = u.generateAuthToken();

    await supertest(app)
      .get('/data')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(res => {
        assert.strictEqual(res.statusCode, 200);
        assert.strictEqual(res.body, null);
      });

    await u.update({ data: { what: 'ever' } });
    await supertest(app)
      .get('/data')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(res => {
        assert.strictEqual(res.statusCode, 200);
        assert.deepStrictEqual(res.body, { what: 'ever' });
      });

    await supertest(app)
      .get('/data')
      .set('Authorization', `Bearer whatever`)
      .expect(res => {
        assert.strictEqual(res.statusCode, 400);
      });
  });

  it('PATCH /data', async () => {
    const u = await User.register('john', 'abcdefg');
    const authToken = u.generateAuthToken();

    await u.update({ data: { what: 'ever' } });
    await supertest(app)
      .patch('/data')
      .send({ what: { ever: { it: 'takes' } } })
      .set('Authorization', `Bearer ${authToken}`)
      .expect(res => {
        assert.strictEqual(res.statusCode, 200);
        assert.deepStrictEqual(res.body, { what: { ever: { it: 'takes' } } });
      });
    await u.reload();
    assert.deepStrictEqual(u.data, { what: { ever: { it: 'takes' } } });
  });
});
