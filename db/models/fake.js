module.exports = function (sequelize, DataTypes) {
  var Fake = sequelize.define("Fake", {
    fakePropertyOne: DataTypes.STRING,
    fakePropertyTwo: DataTypes.DECIMAL
  }, {
    classMethods: {
      associate: function (models) {
        Fake.belongsTo(models.User);
      }
    }
  });
  return Fake;
}