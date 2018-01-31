const mongoose = require('mongoose');
const dbConfig = require('../config').db;

let retryCount = 1;

const connections = mongoose.connection;
const logger = console;

connections.on('connecting', () => {
	logger.info('connecting to mongonDB...',  dbConfig.DEV_DB_URL)
})
connections.on('error', (err) => {
	logger.error('Error in connecting mongonDB', dbConfig.DEV_DB_URL, err)
})
connections.on('connected', () => {
	logger.info("mongonDB connected", dbConfig.DEV_DB_URL)
})
connections.once('open', function() {
	logger.info('MongoDB connection opened!', dbConfig.DEV_DB_URL);
});
connections.on('reconnected', function () {
	logger.info('MongoDB reconnected!', dbConfig.DEV_DB_URL);
});
connections.on('disconnected', function() {
	logger.info('MongoDB disconnected!', dbConfig.DEV_DB_URL);
	// auto reconnect
	if (retryCount < 100) {
		mongoose.connect(dbConfig.DEV_DB_URL, { useMongoClient: true });
		retryCount ++;
	}
});
//The `useMongoClient` option is no longer necessary in mongoose 5.x, please remove it.
mongoose.connect(dbConfig.DEV_DB_URL);
