const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
	{
		username: {
			type: String,
			required: true,
			min: 3,
			unique: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		profilePic: {
			type: String,
			default: "default.jpg",
		},
		coverPic: {
			type: String,
			default: "",
		},
		// in real scenario we would use a new collection instead
		// e.g. Following
		/**
		 * {
		 *  follower,
		 *  following
		 * }
		 */
		followers: {
			type: Array,
			default: [],
		},
		followings: {
			type: Array,
			default: [],
		},
		isAdmin: {
			type: Boolean,
			default: false,
		},
		desc: {
			type: String,
		},
		isActive: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
