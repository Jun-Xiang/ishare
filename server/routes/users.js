const router = require("express").Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const FormData = require("form-data");
const mongoose = require("mongoose");

const auth = require("../middleware/auth");
const { createPasswordHash } = require("../utils/auth");
const UserModel = require("../models/User");
const PostModel = require("../models/Post");
const { isNsfw } = require("../utils/verifyImg");

const validateFile = file => {
	const filetypes = ["jpg", "jpeg", "png", "gif"];
	const fileext = path.extname(file.originalname).toLowerCase().slice(1);
	const valid = filetypes.includes(fileext);
	return valid;
};

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "./public");
	},
	filename: (req, file, cb) => {
		console.log(file.originalname);
		const filename = Date.now() + file.originalname;
		cb(null, filename);
	},
});

const upload = multer({
	storage,
	fileFilter: (req, file, cb) => {
		const validFile = validateFile(file);
		if (validFile) return cb(null, true);
		return cb(new Error("Invalid filetype!"));
	},
});

// Update user
router.put("/", auth, async (req, res) => {
	const reqUser = req.user;
	if (!req.user)
		return res.status(400).json({ msg: "You are not logged in" });

	try {
		const user = await UserModel.findById(reqUser.id);
		if (!user) return res.status(404).json({ msg: "User not found" });
		// ! for project purposes, i won't be doing reset password email stuff, just straight get from body and change it
		let hash;
		if (req.body.password) {
			hash = await createPasswordHash(req.body.password);
		}

		await UserModel.findByIdAndUpdate(reqUser.id, {
			email: req.body.email,
			username: req.body.username,
			desc: req.body.desc,
			password: hash,
		});
		return res.status(200).json({ msg: "Update user successfully" });
	} catch (err) {
		console.error(err);

		if (err?.code === 11000) {
			const relatedFields = Object.keys(err.keyPattern).join(" and ");
			return res
				.status(500)
				.json({ err, msg: relatedFields + " already exist" });
		}
		return res.status(500).json({ err, msg: "Something went wrong" });
	}
});

// Delete user
router.delete("/", auth, async (req, res) => {
	const user = req.user;
	try {
		const deleted = await UserModel.findByIdAndDelete(user.id).exec();
		const deletedPosts = await PostModel.deleteMany({
			userId: mongoose.Types.ObjectId(user.id),
		});
		if (deleted)
			return res
				.status(200)
				.json({ msg: "Delete successfully", deleted });
		return res.status(500).json({ msg: "Something went wrong" });
	} catch (err) {
		return res.status(500).json({ err, msg: "Something went wrong" });
	}
});

// Get current user
router.get("/", auth, async (req, res) => {
	const reqUser = req.user;
	try {
		const user = await UserModel.findById(reqUser.id).exec();
		const posts = await PostModel.find({ userId: reqUser.id }).exec();
		const { password, updatedAt, ...others } = user._doc;

		return res.status(200).json({ user: others, posts });
	} catch (err) {
		return res.status(500).json({ err, msg: "Something went wrong" });
	}
});

// Search for users
router.get("/search", auth, async (req, res) => {
	const searchTerm = req.query.search;

	try {
		const users = await UserModel.find({
			username: {
				$regex: searchTerm,
				$options: "i",
			},
			_id: { $ne: req.user.id },
		});
		return res.status(200).json({ users });
	} catch (err) {
		console.log(err);
		return res.status(500).json({ err, msg: "Something went wrong" });
	}
});

// Get other user
router.get("/:id", auth, async (req, res) => {
	const id = req.params.id;

	try {
		const user = await UserModel.findById(id).exec();
		const posts = await PostModel.find({ userId: id }).exec();
		const { password, updatedAt, ...others } = user._doc;

		return res.status(200).json({ user: others, posts });
	} catch (err) {
		return res.status(500).json({ err, msg: "Something went wrong" });
	}
});

// Follow a user
router.put("/follow/:id", auth, async (req, res) => {
	const followUserId = req.params.id;
	if (req.user.id === followUserId)
		return res.status(403).json({ msg: "You cannot follow yourself" });

	try {
		const user = await UserModel.findById(req.user.id).exec();

		if (user.followers.includes(req.params.id))
			return res
				.status(403)
				.json({ msg: "You already follow this user" });

		// Update followers and followings
		await UserModel.findByIdAndUpdate(user.id, {
			$push: { followings: followUserId },
		});

		const newUser = await UserModel.findByIdAndUpdate(
			followUserId,
			{
				$push: { followers: user.id },
			},
			{ new: true }
		);
		return res
			.status(200)
			.json({ msg: "Successfully followed user", user: newUser });
	} catch (err) {
		return res.status(500).json({ err, msg: "Something went wrong" });
	}
});

// unfollow a user
router.put("/unfollow/:id", auth, async (req, res) => {
	const followUserId = req.params.id;
	if (req.user.id === followUserId)
		return res.status(403).json({ msg: "You cannot unfollow yourself" });

	try {
		const user = await UserModel.findById(req.user.id).exec();

		if (user.followers.includes(req.params.id))
			return res.status(403).json({ msg: "You don't follow this user" });

		// Update followers and followings
		await UserModel.findByIdAndUpdate(user.id, {
			$pull: { followings: followUserId },
		});

		const newUser = await UserModel.findByIdAndUpdate(
			followUserId,
			{
				$pull: { followers: user.id },
			},
			{ new: true }
		);
		return res
			.status(200)
			.json({ msg: "Successfully unfollowed user", user: newUser });
	} catch (err) {
		return res.status(500).json({ err, msg: "Something went wrong" });
	}
});

// upload profile pic
router.put(
	"/profilepic",
	auth,
	upload.single("profilepic"),
	async (req, res) => {
		// nsfw image filter
		const reqUser = req.user;
		try {
			const form = new FormData();
			form.append("image", req.file.buffer, req.file.filename);
			if (await isNsfw(form))
				return res.status(400).json({
					msg: "Image might contain explicit content, please upload other image or contact the support",
				});
			const user = await UserModel.findById(reqUser.id);
			if (!user) return res.status(400).json({ msg: "User not found" });
			console.log(user.profilePic, "profpic");
			if (user.profilePic && user.profilePic !== "default.jpg")
				fs.unlinkSync(
					path.resolve(__dirname + "../public/" + user.profilePic)
				);
			user.profilePic = req.file.filename;
			await user.save();
			return res.status(200).json({ user });
		} catch (err) {
			console.log(err);
			return res.status(500).json({ err, msg: "Something went wrong" });
		}
	}
);

module.exports = router;
