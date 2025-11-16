import mongoose from 'mongoose';
import logger from './logger.js';

export const connect = async (uri, opts = {}) => {
  const defaultOpts = {
    serverSelectionTimeoutMS: 5000,
  };

  try {
    await mongoose.connect(uri, { ...defaultOpts, ...opts });

    logger.info(' MongoDB connected successfully');

    mongoose.connection.on('error', (err) => {
      logger.error(` MongoDB connection error: ${err}`);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn(' MongoDB disconnected');
    });

  } catch (err) {
    logger.error(` MongoDB connection failed: ${err.message}`);
    throw err;
  }
};

export { mongoose };
