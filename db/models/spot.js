module.exports = function (sequelize, DataTypes) {
  var Spot = sequelize.define("Spot", {
    name: DataTypes.STRING,
    price: DataTypes.DECIMAL,
    imageUrl: DataTypes.STRING

  }, {
    classMethods: {
      associate: function (models) {
        Spot.belongsTo(models.Store);
        Spot.belongsTo(models.User);
      }
    }
  });
  return Spot;
}
