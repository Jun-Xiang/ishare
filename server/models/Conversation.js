const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ConversationSchema = new Schema(
	{
		groupName: {
			type: String,
		},
		members: {
			type: Array,
		},
		newMsg: {
			type: Date,
		},
		isGroup: {
			type: Boolean,
			default: false,
		},
		onGoingCall: {
			type: Boolean,
			default: false,
		},
		groupImg: {
			type: String,
			default: "group.jpg",
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Conversation", ConversationSchema);
