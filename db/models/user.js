var bcrypt = require('bcrypt-nodejs');
var request = require('needle');
var q = require('q');

module.exports = function (sequelize, DataTypes) {

  var User = sequelize.define("User", {
    username: { 
      type: DataTypes.STRING,
      unique: true,
      allowNull: true
    },
    email: { 
      type: DataTypes.STRING,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: DataTypes.STRING,
    verified: DataTypes.BOOLEAN
  }, {

    instanceMethods: {

      /**
        @returns Promise of a newly generated token on this user
      **/
      newToken: function () {
         return this.addToken(sequelize.models.Token.build());
      },

      /**
        @returns Promise of a newly generated social profile on this user
      **/
      newSocialProfile: function (provider, options) {
        var profile = sequelize
                        .models
                        .SocialProfile
                        .buildForProvider(provider, options);
        return this.addSocialProfile(profile);
      }
    },

    classMethods: {

      conditions: {
        userNameOrEmail: function (value) {
          return sequelize.or( { username: value }, { email: value } );
        }
      },
      
      // Checks the credentials object and runs the appropriate class method
      authenticate: function(credentials) {
        switch (credentials.provider) {
          case 'local':
            return User.passwordAuth(credentials.username, credentials.password);
            break;
          case 'facebook':
            return User.facebookAuth(credentials);
            break;
          default:
            return q.reject({ statusCode: 400, message: "Invalid credentials" });
            break;
        }
      },

      /**
        Checks the supplied credentials against the facebook
        web service.
        If they come back positive, findOrCreate's a user for them
        and calls it's newToken method.
        @returns Promise of a new token
      **/
      facebookAuth: function (credentials) {
        // TODO: refactor this. It is smelly!

        var handleFBResult = function (results) {
          // needle makes full message available as first argument
          var status = results[0].statusCode;
          // needle returns parsed body as second argument
          var body = results[1]; 

          if (status != 200) {
            return q.reject({ statusCode: 400, message: "Invalid facebook auth" });
          } else {     
            // check if the social profile exists already,
            // create it if not
            var promise = sequelize
                          .models
                          .SocialProfile
                          .findOrCreateForAuth(body)

            return promise.spread(function (socialProfile, created) {
              // check if a user exists for this profile
              // create it if not
              var userPromise = User.findOrCreate({
                  where: User.conditions.userNameOrEmail(body.email),
                  defaults: { 
                    email: body.email,
                    username: body.email
                  }
              })

              return userPromise.spread(socialProfile.addUser)
                                .spread(function (user) {
                                  return user.newToken(); 
                                });
            });
          }
        };

        var url = 'https://graph.facebook.com/v2.2/me?access_token=' + credentials.accessToken;
        return q.nfcall(request.get, url)
                .then(handleFBResult);

      },

      /**
        Checks the given username and password against the database
        @returns a Promise of an access Token
      **/
      passwordAuth: function (username, password) {
        if(!password) {
          return q.reject({ statusCode: 400, message: "Password must be included" });
        }
        return User
          .find({ where: User.conditions.userNameOrEmail(username) })
          .then(function checkUserPassword (user) {
            return q.nfcall(bcrypt.compare, password, user.password)
              .then(function onResult (result) {
                if (result) {
                  return user.newToken();
                } else {
                  return q.reject({ statusCode: 400, message: "Invalid username or password" });
                }
              });
          });
      },

      // Helper method for initializing module
      associate: function (models) {
        User.hasMany(models.Store);
        User.hasMany(models.Spot);
        User.hasMany(models.Token);
        User.hasMany(models.SocialProfile);
      }
    }
  });

  var hashPasswordHook = function (user, options, done) {
    if (!user.changed('password')) return done();

    bcrypt.hash(user.get('password'), null, null, function (err, hash) {
      if (err) return done(err);
      user.set('password', hash);
      done();
    });
  };

  User.beforeCreate(hashPasswordHook);
  User.beforeUpdate(hashPasswordHook);

  return User;
};
