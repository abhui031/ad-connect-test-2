module.exports = function (sequelize, DataTypes) {
  var SocialProfile = sequelize.define("SocialProfile", {
    social_id: DataTypes.INTEGER,
    email: DataTypes.DECIMAL,
    username: DataTypes.STRING,
    provider: DataTypes.STRING
  }, {
    classMethods: {
      associate: function (models) {
        SocialProfile.belongsTo(models.User);
      },

      buildForProvider: function(provider, options) {
        var profile = SocialProfile['buildFor' + provider](options);
        return profile;
      },

      buildForFacebook: function(options) {
        profile.social_id = options.id;
        profile.email = options.email;
        profile.username = options.email;
        profile.provider = "facebook";
        return profile;
      },

      findOrCreateForAuth: function(options) {
        return SocialProfile
          .findOrCreate({
            where: {
              social_id: options.id,
              email: options.email,
              username: options.email || options.username,
              provider: options.provider
            }
          })
      }
    }
  });
  return SocialProfile;
}
