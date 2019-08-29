const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL,
    { logging: false, dialectOptions: { ssl: !!process.env.DATABASE_SSL } });

let rootSequalize;
if (process.env.NODE_ENV !== 'production') {
  rootSequalize = new Sequelize(process.env.ROOT_DATABASE_URL,
      { logging: false, dialectOptions: { ssl: !!process.env.DATABASE_SSL } });
}

const commands = {
  async checkConnection() {
    await sequelize.authenticate();
    return true;
  },
  async create() {
    await rootSequalize.queryInterface.createDatabase(sequelize.config.database);
    return true;
    console.log(':: Create database - success\n');
  },
  async drop() {
    await rootSequalize.queryInterface.dropDatabase(sequelize.config.database);
    return true;
    console.log(':: Drop database - success\n');
  },
  async createTables() {
    const modelDefinitions = ['./user'];
    modelDefinitions.forEach(require);
    await sequelize.sync();
    return true;
    console.log(':: Create Tables - success\n');
  },
  async dropTables() {
    await sequelize.drop();
    return true;
    console.log(':: Drop Tables - success\n');
  },
  async setup() {
    await this.drop();
    await this.create();
    await this.createTables();
    console.log(':: Setup Finished');
  },
};

module.exports = { sequelize, commands }

if (require.main === module) {
  const main = async () => {
    await commands[process.argv[2]]();
    process.exit(0);
  };
  main();
}
