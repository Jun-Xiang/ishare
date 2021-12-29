const MessageModel = require("../../models/Message");
const LastSeenModel = require("../../models/LastSeen");

const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

const addMessage = async (sender, conversationId, text, image, gif) => {
	let filename;
	if (image) {
		filename = Date.now() + image.filename;
		fs.writeFileSync(
			path.resolve(__dirname, "../../public", filename),
			image.src
		);
	}
	// Not the best way cuz the image isnt protected
	// TODO: research how to protect image from being accessed by ppl not in conversation
	// prevent text or img if there is gif
	const newMessage = await MessageModel.create({
		sender,
		conversationId,
		text: !gif ? text : null,
		img: !gif ? filename : null,
		gif,
	});
	await newMessage.populate("sender");

	return newMessage;
};

const updateMessage = async (messageId, text, image) => {
	const oldMessage = await MessageModel.findByIdAndUpdate(messageId, {
		text,
		img: image,
	});
	if (oldMessage.img && !image)
		fs.unlinkSync(path.resolve(__dirname, "../../public", oldMessage.img));

	const newMessage = await MessageModel.findById(messageId).populate(
		"sender"
	);
	return newMessage;
};

const deleteMessage = async messageId => {
	const deleted = await MessageModel.findByIdAndDelete(messageId);
	return deleted;
};

const updateLastSeen = async (conversationId, userId) => {
	const lastSeen = await LastSeenModel.findOneAndUpdate(
		{ conversationId, userId },
		{ lastSeen: Date.now() },
		{ new: true }
	);
	return lastSeen;
};

const createAutoMsg = async (conversationId, msg) => {
	return await MessageModel.create({
		conversationId,
		autoMsg: msg,
	});
};

module.exports = {
	addMessage,
	updateLastSeen,
	deleteMessage,
	updateMessage,
	createAutoMsg,
};
