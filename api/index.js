var epilogue = require('epilogue');
var rest = require('./rest-service').Factory;
var middleware = require('./middleware');
var q = require('q');

function generateRoutes(db) {
  var router = require('express').Router();

  // CRUD routes
  // Using epilogue for rapid development

  epilogue.initialize({
    app: router,
    sequelize: db.sequelize
  });
  var security = middleware.security(db);

  var users = epilogue.resource({
      model: db.models.User,
      endpoints: ['/users', '/users/:id'],
      include: [db.models.Store]
  });
  users.use(middleware.indestructible);
  users.update.write.before(security.mustBeOwner);

  var stores = epilogue.resource({
      model: db.models.Store,
      endpoints: ['/stores', '/stores/:id']
  });
  stores.use(security.ownable);

  var spots = epilogue.resource({
      model: db.models.Spot,
      endpoints: ['/spots', '/spots:id']
  });
  spots.use(security.ownable);

  // Routes built using proprietary code
  // Auth Routes
  router.post('/tokens', function (req, res) {
    var credentials = req.body.credentials;
    if (credentials) {
      // pass the credentials object to the model and let it do it's thing
      db.models.User.authenticate(credentials)
                    .then(rest.sendData(req, res, 201))
                    .catch(rest.sendError(req, res));
    } else {
      return res.status(400)
                .send({ message: "Request body should contain credentials." });
    }
  });


  return router;
}

module.exports = generateRoutes;
