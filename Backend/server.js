const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const express = require('express');
const mongoose = require('mongoose');
const useragent = require('express-useragent');

const indexRouter = require('./routes');
const { mongo_string, port } = require('./configs');
const { sendEmail } = require('./utils/helper');

const blueBg = '\x1b[44m\x1b[97m';
const greenBg = '\x1b[42m\x1b[30m';
const redBg = '\x1b[41m\x1b[97m';
const reset = '\x1b[0m';

console.log(`MongoDB URI: ${mongo_string}`);

mongoose.Promise = global.Promise;
console.log(mongo_string,'erfjoreifjorejoi');

async function startServer() {
  
  try {
    await mongoose.connect(mongo_string, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`${greenBg}MongoDB connected locally${reset}`);
    console.log(`Database name: ${mongoose.connection.db.databaseName}`);

    const app = express();
    app.set('trust proxy', 1);
    app.use(cors());
    app.use(helmet());
    app.use(express.json({ limit: '50mb' }));
    app.use(express.urlencoded({ limit: '50mb', extended: true }));
    app.use(useragent.express());
    app.use(morgan('tiny'));

    app.use('/api', indexRouter);
    app.get('/api/health', (req, res) => {
      const mongoState = mongoose.connection.readyState;
      const states = {
        0: 'disconnected',
        1: 'connected',
        2: 'connecting',
        3: 'disconnecting',
      };
      res.status(200).send({ mongo_db: `MongoDB connection state is ${states[mongoState]}` });
    });

    app.use((req, res) => {
      res.status(404).send({ url: `${req.originalUrl} not found` });
    });

    app.listen(port ?? 8000, () => {
      const serverMessage = `Server started on port ${port ?? 8000}`;
      const separator = '-'.repeat(serverMessage.length);
      console.log(`${blueBg}${separator}${reset}`);
      console.log(`${greenBg}${serverMessage}${reset}`);
      console.log(`${blueBg}${separator}${reset}`);
    });
  } catch (err) {
    console.error(`${redBg}Error connecting to MongoDB:${reset}`, err);
    process.exit(1);
  }
}

startServer();