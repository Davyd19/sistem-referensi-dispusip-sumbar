const { Sequelize } = require('sequelize');
const config = require('../config/database');

const dbConfig = config.development;

// Connect without database first to drop/create
const sequelize = new Sequelize({
  host: dbConfig.host,
  username: dbConfig.username,
  password: dbConfig.password,
  dialect: dbConfig.dialect,
  logging: console.log
});

async function resetDatabase() {
  try {
    console.log('🔄 Dropping database...');
    await sequelize.query(`DROP DATABASE IF EXISTS \`${dbConfig.database}\``);
    console.log('✅ Database dropped');

    console.log('🔄 Creating database...');
    await sequelize.query(`CREATE DATABASE \`${dbConfig.database}\``);
    console.log('✅ Database created');

    await sequelize.close();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

resetDatabase();
