const router = require("express").Router();

const {
	createRefreshToken,
	createAccessToken,
	createPasswordHash,
	validatePassword,
} = require("../utils/auth");

const UserModel = require("../models/User");

// REGISTER
router.post("/register", async (req, res) => {
	const { username, email, password } = req.body;

	try {
		const user = await UserModel.create({
			username,
			email,
			password: await createPasswordHash(password),
		});

		return res
			.status(200)
			.json({ user, msg: "User registered successfully" });
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

// LOGIN
router.post("/login", async (req, res) => {
	const { email, password } = req.body;

	try {
		const user = await UserModel.findOne({ email }).exec();
		if (!user) return res.status(404).json({ msg: "User not found" });

		const validPassword = await validatePassword(password, user.password);

		if (!validPassword)
			return res.status(400).json({ msg: "Incorrect password" });

		const payload = {
			id: user.id,
			username: user.username,
			isAdmin: user.isAdmin,
		};

		res.status(200).json({
			accessToken: createAccessToken(payload),
			refreshToken: createRefreshToken(payload),
		});
	} catch (err) {
		console.error(err);
		return res.status(500).json({ err, msg: "Something went wrong" });
	}
});

module.exports = router;
