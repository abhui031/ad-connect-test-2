module.exports = function (sequelize, DataTypes) {

  var Token = sequelize.define("Token", {
  	secret: DataTypes.STRING
  	// we can make them expire later ^.^
  }, {
  	classMethods: {

      authenticate: function (secret) {
        return Token.find({ where: { secret: secret } });
      },

  		associate: function (models) {
  			Token.belongsTo(models.User);
  		}
  	},

    instanceMethods: {

      sameOwnerAs: function (ownable) {
        if (ownable.Model && ownable.Model.tableName == "Users") {
          return (ownable.id == this.UserId); 
        } else {
          return (ownable.UserId == this.UserId);
        }
      }

    }

  });

  var generateSecretHook = function (token, options, done) {
  	require('crypto').randomBytes(48, function(ex, buf) {
  		token.set('secret', buf.toString('hex'));
      done();
	  });
  };

  Token.beforeCreate(generateSecretHook);

  return Token;
};
