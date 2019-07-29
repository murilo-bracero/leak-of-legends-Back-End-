const express = require('express');
const mw = require('./middleware/auth');

const routes = express.Router();
const UserController = require('./controllers/UserController');
const LoginController = require('./controllers/LoginController');

routes.get('/getChamps', UserController.getChamps);
routes.get('/getnews/:page', mw, UserController.getNews);
routes.post('/login', LoginController.login);
routes.post('/signup', UserController.save);
routes.get('/getuser/:username', mw, UserController.findUser);
routes.get('/getuserbyid/:id', mw, UserController.getUserInfo);
routes.put('/addchamp', mw, UserController.addToFavs);
routes.delete('/removechamp', mw, UserController.removeToFavs);
routes.delete('/deleteaccount', mw, UserController.deleteUser);

module.exports = routes;