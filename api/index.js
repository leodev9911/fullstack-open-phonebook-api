const logger = require('./utils/logger');
const config = require('./utils/config');
const app = require('./app');

const PORT = config.PORT || 8080;
app.listen(PORT, () => {
    logger.info(`App running in the port http://localhost:${PORT}/`);
});
