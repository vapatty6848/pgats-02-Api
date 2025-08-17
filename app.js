
import express from 'express';
import * as userController from './controller/userController.js';
import * as transferController from './controller/transferController.js';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger.json' assert { type: 'json' };

const app = express();
app.use(express.json());

// Rotas de usuário
app.post('/register', userController.register);
app.post('/login', userController.login);
app.get('/users', userController.getUsers);

// Rotas de transferência
app.post('/transfer', transferController.transfer);
app.get('/transfers', transferController.getTransfers);

// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

export default app;
