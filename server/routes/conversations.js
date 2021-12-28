const router = require("express").Router();
const ConversationModel = require("../models/Conversation");
const LastSeenModel = require("../models/LastSeen");
const MessageModel = require("../models/Message");
const auth = require("../middleware/auth");
const { aggregateConvo, aggregateGroup } = require("../utils/conversation");
const mongoose = require("mongoose");
const FormData = require("form-data");
const fs = require("fs");
const path = require("path");
const { isNsfw } = require("../utils/verifyImg");

// new convo
router.post("/", auth, async (req, res) => {
	const members = [req.user.id, req.body.receiverId];
	try {
		const found = await ConversationModel.findOne({
			members,
			isGroup: false,
		});
		if (found) {
			const convo = await ConversationModel.aggregate([
				{
					$match: {
						_id: found._id,
					},
				},
				...aggregateConvo(req.user.id),
			]);
			return res.status(200).json({
				msg: "Conversation already exists",
				convo: convo[0],
				found: true,
			});
		}
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

		const convo = await ConversationModel.aggregate([
			{
				$match: {
					_id: newConversation._id,
				},
			},
			...aggregateConvo(req.user.id),
		]);
		res.status(200).json({
			convo: convo[0],
			msg: "New conversation created",
			found: false,
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
router.put("/joingroup/:id", auth, async (req, res) => {
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
router.put("/leavegroup/:id", auth, async (req, res) => {
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
				$match: {
					members: { $in: [req.user.id] },
				},
			},
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

router.put("/group/:id", auth, async (req, res) => {
	const id = req.params.id;
	const { name, img } = req.body;
	try {
		const convo = await ConversationModel.findOne({
			members: { $in: [req.user.id] },
			_id: id,
		});
		if (!convo)
			return res.status(404).json({ msg: "Conversation not found" });
		if (!convo.isGroup)
			return res.status(400).json({ msg: "Only group can change name" });
		if (img) {
			const form = new FormData();
			img.src = img.src.replace(/^data:([A-Za-z-+\/]+);base64,/, "");
			const imgData = Buffer.from(img.src, "base64");
			form.append("image", imgData, img.filename);

			if (await isNsfw(form))
				return res.status(400).json({
					msg: "Image might contain explicit content, please upload other image or contact the support",
				});

			if (convo.groupImg !== "group.jpg")
				fs.unlinkSync(
					path.resolve(__dirname, "../public", convo.groupImg)
				);

			const filename = Date.now() + img.filename;
			fs.writeFileSync(
				path.resolve(__dirname, "../public", filename),
				img.src,
				"base64"
			);
			convo.groupImg = filename;
		}

		convo.groupName = name;
		await convo.save();
		const newConvo = await ConversationModel.aggregate([
			{
				$match: { _id: mongoose.Types.ObjectId(id) },
			},
			...aggregateConvo(req.user.id),
		]);
		return res.status(200).json({ convo: newConvo[0] });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ err, msg: "Something went wrong" });
	}
});

module.exports = router;
