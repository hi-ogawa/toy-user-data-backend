const assert = require('assert').strict;
const db = require('./db');

before(async () => {
  await db.commands.drop();
  await db.commands.create();
});

describe('db.commands', () => {
  it('checkConnection', async () => {
    assert.strictEqual(await db.commands.checkConnection(), true)
  });
});
