const router = require("express").Router();
const MessageModel = require("../models/Message");
const auth = require("../middleware/auth");

// Add message
router.post("/", auth, async (req, res) => {
	try {
		const { conversationId, text } = req.body;
		//  TODO: add image and giphy stuff
		const newMessage = await MessageModel.create({
			sender: req.user.id,
			conversationId,
			text,
		});

		return res.status(200).json({ msg: newMessage });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ err, msg: "Something went wrong" });
	}
});

// Get messages
router.get("/:conversationId", async (req, res) => {
	const { offset = 0, limit = 10 } = req.query;

	try {
		const messages = await MessageModel.find({
			conversationId: req.params.conversationId,
		})
			.populate("sender")
			.sort({ createdAt: "-1" })
			.skip(Number(offset))
			.limit(Number(limit))
			.exec();
		return res.status(200).json({ messages });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ err, msg: "Something went wrong" });
	}
});

module.exports = router;
