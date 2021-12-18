const router = require("express").Router();
const ConversationModel = require("../models/Conversation");
const auth = require("../middleware/auth");

// new convo
router.post("/:id", auth, async (req, res) => {
	const members = [req.user.id, req.params.id];
	try {
		const found = await ConversationModel.findOne({ members });
		if (found)
			return res
				.status(400)
				.json({ msg: "Conversation already exists", convo: found });
		const newConversation = await ConversationModel.create({
			members,
		});
		res.status(200).json({
			convo: newConversation,
			msg: "New conversation created",
		});
	} catch (err) {
		console.error(err);
		return res.status(500).json({ err, msg: "Something went wrong" });
	}
});

// get convos of a user
router.get("/", auth, async (req, res) => {
	try {
		const conversations = await ConversationModel.find({
			members: req.user.id,
		});
		return res.status(200).json({ convos: conversations });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ err, msg: "Something went wrong" });
	}
});

module.exports = router;
