const express = require('express');
express.Router();
const userAuth = require('../app/middlewares/userAuth');
const homeController = require('../app/controllers/homeController');
function initRoutes(router) {
  router.get('/api/index', userAuth, homeController().index);
  router.post('/api/register', homeController().register);
  router.get('/api/getuserbyId/:uuid', userAuth, homeController().getUserById);
  router.delete(
    '/api/deleteuserbyid/:uuid',
    userAuth,
    homeController().deleteUserByid,
  );
  router.post('/api/signIn', homeController().signIn);

  router.put(
    '/api/updateuser/:uuid',
    userAuth,
    homeController().updateUserByid,
  );
  router.get('/api/test', userAuth, homeController().test);
}
module.exports = initRoutes;
