const Database = require('better-sqlite3');
const db = new Database('./PetParadiseDatabase.sqlite');
module.exports = db;
