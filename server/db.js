const { Client } = require('pg');

const client = new Client({
    user: 'postgres',
    password: '2507',
    host: 'localhost',
    port: 5432,
    database: 'cryptoLearn'
});

client.connect()
    .then(() => console.log('Connected to the database'))
    .catch(error => console.error('Error connecting to the database:', error));

module.exports = client;