const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommentSchema = new Schema(
	{
		text: {
			type: String,
			required: true,
		},
		sender: {
			type: mongoose.Types.ObjectId,
			required: true,
			ref: "User",
		},
		post: {
			type: mongoose.Types.ObjectId,
			required: true,
			ref: "Post",
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Comment", CommentSchema);
