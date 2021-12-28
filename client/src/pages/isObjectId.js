const mongoose = require("mongoose");

export const isObjectId = id => mongoose.Types.ObjectId.isValid(id);
