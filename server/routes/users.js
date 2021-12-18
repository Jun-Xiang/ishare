const router = require("express").Router();

const auth = require("../middleware/auth");
const { createPasswordHash } = require("../utils/auth");

const UserModel = require("../models/User");

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
			...req.body,
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
		const { password, updatedAt, ...others } = user._doc;
		return res.status(200).json(others);
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

		await UserModel.findByIdAndUpdate(followUserId, {
			$push: { followers: user.id },
		});
		return res.status(200).json({ msg: "Successfully followed user" });
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

		await UserModel.findByIdAndUpdate(followUserId, {
			$pull: { followers: user.id },
		});
		return res.status(200).json({ msg: "Successfully unfollowed user" });
	} catch (err) {
		return res.status(500).json({ err, msg: "Something went wrong" });
	}
});

module.exports = router;
