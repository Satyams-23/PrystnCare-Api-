import config from './config';
import { Server } from 'http';
import app from './app';

import mongoose from 'mongoose';

process.on('uncaughtException', error => {
  // handle uncaughtException error here
  console.log(error); //
  process.exit(1);
});

let server: Server;

async function main() {
  try {
    // Database is connected
    await mongoose.connect(config.database_url as string);

    console.log('Database is connected successfully');

    app.listen(config.port, () => {
      console.log(`Aplication listening on port ${config.port}`);
    });
  } catch (err) {
    console.log('Failed to Cenncect Database', err);
  }

  process.on('unhandledRejection', error => {
    if (server) {
      server.close(() => {
        //
        console.log(error);
        process.exit(1);
      });
    } else {
      process.exit(1);
    }
  });
}

main();

process.on('SIGTERM', () => {
  console.log('SIGTERM is recived');
  if (server) {
    server.close();
  }
});
