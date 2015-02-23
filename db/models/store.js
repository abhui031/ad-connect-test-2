module.exports = function (sequelize, DataTypes) {
  var Store = sequelize.define("Store", {
    name: DataTypes.STRING,
    address: DataTypes.STRING
  }, {
    classMethods: {
      associate: function (models) {
        Store.belongsTo(models.User);
        Store.hasMany(models.Spot);
      }
    }
  })
  return Store;
};
