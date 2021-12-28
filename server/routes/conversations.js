const router = require("express").Router();
const ConversationModel = require("../models/Conversation");
const LastSeenModel = require("../models/LastSeen");
const MessageModel = require("../models/Message");
const auth = require("../middleware/auth");
const { aggregateConvo, aggregateGroup } = require("../utils/conversation");
const mongoose = require("mongoose");
const { updateConversationUpdatedAt } = require("../socket/db/message");

// new convo
router.post("/", auth, async (req, res) => {
	const members = [req.user.id, req.body.receiverId];
	try {
		const found = await ConversationModel.findOne({
			members,
			isGroup: false,
		});
		if (found)
			return res
				.status(200)
				.json({ msg: "Conversation already exists", convo: found });
		// Create new convo
		const newConversation = await ConversationModel.create({
			members,
			newMsg: Date.now(),
		});
		// Create 2 last seens for users
		// turn into map if is group
		const lastseens = await LastSeenModel.insertMany([
			{
				conversationId: newConversation._id,
				userId: req.user.id,
				lastSeen: Date.now(),
			},
			// remove 1000 so that lastseen is always lower than newMsg
			{
				conversationId: newConversation._id,
				userId: req.body.receiverId,
				lastSeen: Date.now() - 1000,
			},
		]);
		res.status(200).json({
			convo: newConversation,
			msg: "New conversation created",
		});
	} catch (err) {
		console.error(err);
		return res.status(500).json({ err, msg: "Something went wrong" });
	}
});

// new group
router.post("/group", auth, async (req, res) => {
	const members = [...req.body.members, req.user.id];
	try {
		// Create new convo
		const newConversation = await ConversationModel.create({
			groupName: "Group created by " + req.user.username,
			members,
			newMsg: Date.now(),
			isGroup: true,
		});

		const newMessage = await MessageModel.create({
			conversationId: newConversation._id,
			autoMsg: `${req.user.username} created this group`,
		});

		const lastseens = await LastSeenModel.insertMany(
			members.map(m => ({
				conversationId: newConversation._doc._id.toString(),
				userId: m,
				lastSeen: Date.now(),
			}))
		);
		const convo = await ConversationModel.aggregate(
			aggregateGroup(newConversation._doc._id)
		);
		res.status(200).json({
			convo: convo[0],
			msg: "New conversation created",
		});
	} catch (err) {
		console.error(err);
		return res.status(500).json({ err, msg: "Something went wrong" });
	}
});

// join group
router.post("/joingroup/:id", auth, async (req, res) => {
	const id = req.params.id;

	try {
		const updatedGroup = await ConversationModel.findByIdAndUpdate(
			id,
			{
				$push: { members: req.user.id },
			},
			{ new: true }
		);
		return res.status(200).json({ convo: updatedGroup });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ err, msg: "Something went wrong" });
	}
});

// leave group
router.post("/leavegroup/:id", auth, async (req, res) => {
	const id = req.params.id;

	try {
		const updatedGroup = await ConversationModel.findByIdAndUpdate(
			id,
			{
				$pull: { members: req.user.id },
			},
			{ new: true }
		);
		return res.status(200).json({ convo: updatedGroup });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ err, msg: "Something went wrong" });
	}
});

// get one convo
router.get("/:id", auth, async (req, res) => {
	const id = req.params.id;
	try {
		const conversation = await ConversationModel.aggregate([
			{
				$match: { _id: mongoose.Types.ObjectId(id) },
			},
			...aggregateConvo(req.user.id),
		]);
		return res.status(200).json({ convo: conversation[0] });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ err, msg: "Something went wrong" });
	}
});

// get convos of a user
router.get("/", auth, async (req, res) => {
	const { limit = 10, offset = 0 } = req.query;

	try {
		const conversations = await ConversationModel.aggregate([
			{
				$skip: Number(offset),
			},
			{
				$limit: Number(limit),
			},
			...aggregateConvo(req.user.id),
			{
				$sort: { newMsg: -1 },
			},
		]);
		return res.status(200).json({ convos: conversations });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ err, msg: "Something went wrong" });
	}
});

router.put("/:id", async (req, res) => {
	try {
		const convo = await updateConversationUpdatedAt();
		return res.json({ convo });
	} catch (err) {}
});

module.exports = router;
