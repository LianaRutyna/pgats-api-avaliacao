// Express app setup
const express = require('express');
const app = express();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routers
const authRouter = require('./controllers/authController');
const itemsRouter = require('./controllers/itemsController');
const checkoutRouter = require('./controllers/checkoutController');

app.use('/auth', authRouter);
app.use('/items', itemsRouter);
app.use('/checkout', checkoutRouter);

module.exports = app;
