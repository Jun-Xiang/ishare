const router = require("express").Router();
const auth = require("../middleware/auth");
const PostModel = require("../models/Post");
const fs = require("fs");
const path = require("path");
const FormData = require("form-data");
const axios = require("axios").default;
const CommentModel = require("../models/Comment");
const { isNsfw } = require("../utils/verifyImg");

// get a post
router.get("/:id", auth, async (req, res) => {
	try {
		const post = await PostModel.findById(req.params.id).populate("userId");

		return res.status(200).json({ post });
	} catch (err) {
		return res.status(500).json({ err, msg: "Something went wrong" });
	}
});

// TODO: implement pagination if got time
// get all posts
router.get("/", auth, async (req, res) => {
	try {
		const posts = await PostModel.find({})
			.sort({ createdAt: -1 })
			.populate("userId");
		const commentsCount = await CommentModel.aggregate([
			{
				$group: {
					_id: "$post",
					count: { $sum: 1 },
				},
			},
		]);
		// countDocument
		return res.status(200).json({ posts, commentsCount });
	} catch (err) {
		return res.status(500).json({ err, msg: "Something went wrong" });
	}
});

// create a post
router.post("/", auth, async (req, res) => {
	const { desc, img } = req.body;
	try {
		const form = new FormData();
		img.src = img.src.replace(/^data:([A-Za-z-+\/]+);base64,/, "");
		const imgData = Buffer.from(img.src, "base64");
		form.append("image", imgData, img.filename);

		if (await isNsfw(form))
			return res.status(400).json({
				msg: "Image might contain explicit content, please upload other image or contact the support",
			});
		const filename = Date.now() + img.filename;
		fs.writeFileSync(
			path.resolve(__dirname, "../public", filename),
			img.src,
			"base64"
		);
		const post = await PostModel.create({
			userId: req.user.id,
			desc,
			img: filename,
		});
		return res.status(200).json({ post });
	} catch (err) {
		console.log(err);
		return res.status(500).json({ err, msg: "Something went wrong!" });
	}
});

// like a post
router.put("/like/:id", auth, async (req, res) => {
	const id = req.params.id;
	try {
		const updated = await PostModel.findByIdAndUpdate(
			id,
			{
				$push: {
					likes: req.user.id,
				},
			},
			{ new: true }
		).populate("userId");
		return res.status(200).json({ post: updated });
	} catch (err) {
		console.log(err);
		return res.status(500).json({ err, msg: "Something went wrong" });
	}
});

// unlike a post
router.put("/unlike/:id", auth, async (req, res) => {
	const id = req.params.id;
	try {
		const updated = await PostModel.findByIdAndUpdate(
			id,
			{
				$pull: {
					likes: req.user.id,
				},
			},
			{ new: true }
		).populate("userId");
		return res.status(200).json({ post: updated });
	} catch (err) {
		console.log(err);
		return res.status(500).json({ err, msg: "Something went wrong" });
	}
});

// Delete post
router.delete("/:id", auth, async (req, res) => {
	const id = req.params.id;
	try {
		const deleted = await PostModel.findOneAndDelete({
			_id: id,
			userId: req.user.id,
		});
		return res.status(200).json({ post: deleted });
	} catch (err) {
		return res.status(500).json({ err, msg: "Something went wrong" });
	}
});

module.exports = router;
