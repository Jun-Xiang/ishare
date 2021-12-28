const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// TODO: if got time then do the imgs
const PostSchema = new Schema(
	{
		userId: {
			type: mongoose.Types.ObjectId,
			required: true,
			ref: "User",
		},
		desc: {
			type: String,
			max: 500,
		},
		// imgs: {
		// 	type: Array,
		// 	default: [],
		// },
		img: {
			type: String,
		},
		likes: {
			type: Array,
			default: [],
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);
