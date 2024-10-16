const knex = require('knex');
const knexConfig = require('../knexfile'); // Import knexfile.js

// Determine the environment: development or production
const environment = process.env.NODE_ENV || 'development'; 
const config = knexConfig[environment];

// Create the Knex instance with the selected environment configuration
const db = knex(config);

// Export the Knex instance for use in your models
module.exports = db;
