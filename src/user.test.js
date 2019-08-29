const assert = require('assert').strict;
const jws = require('jws');

const User = require('./user');
const db = require('./db');

before(async () => {
  await db.commands.drop();
  await db.commands.create();
});

describe('User', () => {
  beforeEach(async () => {
    await db.commands.dropTables();
    await db.commands.createTables();
  });

  it('register', async () => {
    const u1 = await User.register('john', 'abcdefg');
    assert.strictEqual(u1.username, 'john');
    assert.strictEqual(u1.encrypted_password.length, 60);
    assert.strictEqual(u1.data, null);

    // Already taken
    const u2 = await User.register('john', 'asdfjkl');
    assert.strictEqual(u2, null);
  });

  it('findAndVerifyByLoginData', async () => {
    const u1 = await User.register('john', 'abcdefg');

    const u2 = await User.findAndVerifyByLoginData('john', 'abcdefg');
    assert.ok(await u1.equals(u2));

    // Wrong password
    const u3 = await User.findAndVerifyByLoginData('john', ';lkjfdsa');
    assert.strictEqual(u3, null);

    // Not found
    const u4 = await User.findAndVerifyByLoginData('johnjohn', 'abcdefg');
    assert.strictEqual(u4, null);
  });

  it('findAndVerifyByAuthToken', async () => {
    const u1 = await User.register('john', 'abcdefg');
    const authToken = u1.generateAuthToken();

    const u2 = await User.findAndVerifyByAuthToken(authToken);
    assert.ok(u1.equals(u2));

    const fakeToken = jws.sign({
      header: { alg: 'HS256' },
      payload: { username: 'asdjfkl' },
      secret: 'asdfjkl;',
    });
    const u3 = await User.findAndVerifyByAuthToken(fakeToken);
    assert.strictEqual(u3, null);
  });

  it('generateAuthToken', async () => {
    const u1 = await User.register('john', 'abcdefg');
    const authToken = u1.generateAuthToken();
    assert.deepStrictEqual(jws.decode(authToken), {
      header: { alg: 'HS256' },
      payload: '{"username":"john"}',
      signature: 'ykToRoECIsmUImbfhKy07uVluXrPWwYKEpyYwBxXSSI'
    });
  });
});
