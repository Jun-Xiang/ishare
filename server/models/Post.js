const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// TODO: finish this schema
const PostSchema = new Schema(
	{
		userId: {
			type: mongoose.Types.ObjectId,
			required: true,
		},
		desc: {
			type: String,
			max: 500,
		},
		imgs: {
			type: Array,
			default: [],
		},
		likes: {
			type: Array,
			default: [],
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);
