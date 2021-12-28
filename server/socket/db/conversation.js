const ConversationModel = require("../../models/Conversation");
const { createAutoMsg } = require("./message");
const { aggregateConvo, aggregateGroup } = require("../../utils/conversation");
const mongoose = require("mongoose");

const updateConversationUpdatedAt = async (conversationId, userId) => {
	await ConversationModel.findByIdAndUpdate(conversationId, {
		newMsg: Date.now(),
	});
	const conversation = await ConversationModel.aggregate([
		{
			$match: { _id: mongoose.Types.ObjectId(conversationId) },
		},
		...aggregateConvo(userId),
	]);
	console.log(conversation);
	return conversation[0];
};

const triggerGroupCallStarted = async (conversationId, username) => {
	await ConversationModel.findByIdAndUpdate(conversationId, {
		newMsg: Date.now(),
		onGoingCall: true,
	});
	await createAutoMsg(conversationId, `${username} has started a group call`);

	const conversation = await ConversationModel.aggregate(
		aggregateGroup(conversationId)
	);

	return conversation[0];
};

const triggerGroupCallEnded = async conversationId => {
	await ConversationModel.findByIdAndUpdate(conversationId, {
		newMsg: Date.now(),
		onGoingCall: false,
	});
	await createAutoMsg(conversationId, "Group call has ended");

	const conversation = await ConversationModel.aggregate(
		aggregateGroup(conversationId)
	);

	return conversation[0];
};

module.exports = {
	updateConversationUpdatedAt,
	triggerGroupCallStarted,
	triggerGroupCallEnded,
};
