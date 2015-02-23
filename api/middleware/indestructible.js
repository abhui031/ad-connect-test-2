
"use strict";

module.exports = {
  delete: {
    auth: function(req, res, context) {
      res.json(403, { error: "sorry, this resource is immutable" });
      context.stop();
    }
  }
};

