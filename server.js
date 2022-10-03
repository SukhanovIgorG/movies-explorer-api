require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./app');
const { mongoDev } = require('./utils/constants');

const { PORT = 3000, MONGO_PROD, NODE_ENV } = process.env;

async function main() {
  await mongoose.connect(
    NODE_ENV === 'production' ? MONGO_PROD : mongoDev,
  );
  await app.listen(PORT);
  console.log(`app listen PORT ${PORT}`);
}

main();
