Toy NodeJS API backend

Backend api for literally minimal per-user data persistence functionality.

- POST /register
- POST /login
- GET /data
- PATCH /data

TODO

- Employ jwt expiration header

```
## Development

# Setup database (cf. src/db.js)
$ npm run db -- setup

# Start server
$ npm start

# Testing
$ npm test

# Or develop within container e.g.
$ bash scripts.sh dev-bash
$ bash scripts.sh dev-npm <command>
$ bash scripts.sh dev-npm run console


## Production (cf. https://github.com/hi-ogawa/cloud-run-script)

# Deployment
$ bash run.sh deploy

# View production log
$ bash run.sh logs
```


Environment variables

```
DATABASE_URL=postgres://pguser:pgpass@postgres_dev:5432/dev
TEST_DATABASE_URL=postgres://pguser:pgpass@postgres_dev:5432/test
ROOT_DATABASE_URL=postgres://pguser:pgpass@postgres_dev:5432/pguser # For database creatation/deletion
JWS_SECRET=c0615a0dd280019e0b3f
ALLOW_ORIGIN=...
DATABASE_SSL=...
```


References

- NodeJS libraries
  - https://github.com/expressjs/express
  - https://github.com/sequelize/sequelize
  - https://github.com/dcodeIO/bcrypt.js
  - https://github.com/brianloveswords/node-jws
  - https://github.com/mochajs/mocha/
  - https://github.com/visionmedia/supertest

- Deployment
  - https://github.com/nodejs/docker-node/blob/master/docs/BestPractices.md
  - https://cloud.google.com/run/docs/building/containers
  - https://cloud.google.com/container-registry/pricing
  - https://cloud.google.com/storage/pricing#network-pricing
