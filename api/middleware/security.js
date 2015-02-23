"use strict";
var q = require("q");

module.exports = function inject (db) {

  var Token = db.models.Token;

  function mustBeLoggedIn(req, res, context) {
    return Token.authenticate(req.header('access-token'))
                .then(function (token) {
                  context.continue();
                })
                .catch(function (err) {
                  res.status(401).send("Not Authorized");
                  context.stop();
               });
  }

  function mustBeOwner(req, res, context) {
    Token.authenticate(req.header('access-token'))
      .then(function (token) {
          var ownable = (req.method == "POST") ?  req.body : context.instance;
          if (token.sameOwnerAs(ownable)) {
            context.continue();
          } else {
            res.status(401).send("Not Authorized");
            context.stop();
          }
       })
       .catch(function (err) {
          res.status(401).send("Not Authorized");
          context.stop();
       });
    }

  /*
    This epilogue middleware marks an object as ownable.
    Ownable objects exhibit the following behaviour:
    - can only be created if the persisted object would be assigned 
      to the current user
    - can only be updated if owned by the current user
    - can only be deleted if owned by the current user
  */
  var ownable = {
      update: {
        write: {
          before: mustBeOwner
        }
      },
      create: {
        write: {
          before: mustBeOwner
        }
      },
      delete: {
        write: {
          before: mustBeOwner
        }
      }
  };

  return {
    ownable: ownable,
    mustBeOwner: mustBeOwner
  };
  
};

