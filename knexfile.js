// Update with your config settings.
const path = require('path');
/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
  development: {
    client: 'mysql2',
    connection: {
      host: 'localhost',
      user: 'mysql',
      password: 'root',
      database: 'comicstore',
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: path.join(__dirname, 'src/migrations'),
    },
  },
  production: {
    client: 'mysql2',
    connection: {
      host: 'your_production_host',
      user: 'your_production_username',
      password: 'your_production_password',
      database: 'your_production_database',
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: path.join(__dirname, 'src/migrations'),
    },
  },
};

