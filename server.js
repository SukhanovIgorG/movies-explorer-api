require('dotenv').config();
const mongoose = require('mongoose');

const app = require('./app');

const { PORT = 3000 } = process.env;

async function main() {
  await mongoose.connect('mongodb://localhost:27017/bitfilmsdb');
  await app.listen(PORT);
  // console.log(`App listening on port ${PORT}`);
}

main();
