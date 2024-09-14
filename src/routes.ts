import { Router } from 'express'; 
import cardsController from './controller/cards.controller'; 
import { authenticateJWT } from './middleware/auth.middleware';
import { login, register } from './controller/auth.controller';
import cardsService from './service/cards.service';

const routes = Router();

routes.get('/inserir-cards', cardsController.buscarCards);
routes.get('/cards', cardsController.findAll);
routes.put('/cards-update/:id', cardsController.update);
routes.delete('/cards-delete/:id', cardsController.delete);
routes.post('/cards-create', cardsController.create);

routes.post('/decks', authenticateJWT, cardsController.createDeck);
routes.get('/decks/:id', cardsController.getDeck);
routes.put('/decks/:id', authenticateJWT, cardsController.updateDeck);

routes.post('/cards-auth-create', authenticateJWT, cardsController.create);
routes.put('/cards-auth-put/:id', authenticateJWT, cardsController.update);

routes.post('/login', login);
routes.post('/register', register);

export { routes };
