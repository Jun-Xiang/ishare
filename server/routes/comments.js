const router = require("express").Router();
const CommentModel = require("../models/Comment");
const auth = require("../middleware/auth");

// Get all comments
router.get("/:id", auth, async (req, res) => {
	const postId = req.params.id;
	try {
		const comments = await CommentModel.find({ post: postId })
			.sort({ createdAt: -1 })
			.populate("sender");
		return res.status(200).json({ comments });
	} catch (err) {
		console.log(err);
		return res.status(500).json({ err, msg: "Something went wrong" });
	}
});

// Create a comment
router.post("/:id", auth, async (req, res) => {
	const postId = req.params.id;
	const { text } = req.body;
	try {
		const comment = await CommentModel.create({
			post: postId,
			sender: req.user.id,
			text,
		});
		await comment.populate("sender");
		return res.status(200).json({ comment });
	} catch (err) {
		console.log(err);
		return res.status(500).json({ err, msg: "Something went wrong" });
	}
});

// Update a comment
router.put("/:id", auth, async (req, res) => {
	const commentId = req.params.id;
	const { text } = req.body;
	try {
		const updated = await CommentModel.findOneAndUpdate(
			{ _id: commentId, sender: req.user.id },
			{ text },
			{ new: true }
		).populate("sender");
		return res.status(200).json({ comment: updated });
	} catch (err) {
		return res.status(500).json({ err, msg: "Something went wrong" });
	}
});

// Delete a comment
router.delete("/:id", auth, async (req, res) => {
	const commentId = req.params.id;
	try {
		const deleted = await CommentModel.findOneAndDelete({
			_id: commentId,
			sender: req.user.id,
		});
		return res.status(200).json({ comment: deleted });
	} catch (err) {
		return res.status(500).json({ err, msg: "Something went wrong" });
	}
});

module.exports = router;
