const router = require("express").Router();
const axios = require("axios");
const path = require("path");
const { OAuth2Client } = require("google-auth-library");
const fs = require("fs");

const {
	createRefreshToken,
	createAccessToken,
	createPasswordHash,
	validatePassword,
	validateRefreshToken,
} = require("../utils/auth");

const UserModel = require("../models/User");

const clientId =
	"815667115963-gd3ksgbk79kfvao7mrfo6kklq77q2ocs.apps.googleusercontent.com";

const client = new OAuth2Client(clientId);

// REGISTER
router.post("/register", async (req, res) => {
	const { username, email, password } = req.body;
	if (username.toLowerCase().trim().replace(" ", "") === "deleteduser")
		return res.status(500).json({ msg: "Invalid username" });
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
			profilePic: user.profilePic,
		};

		return res.status(200).json({
			accessToken: createAccessToken(payload),
			refreshToken: createRefreshToken(payload),
		});
	} catch (err) {
		console.error(err);
		return res.status(500).json({ err, msg: "Something went wrong" });
	}
});

// Google login
router.post("/logingoogle", async (req, res) => {
	const { token } = req.body;
	try {
		const ticket = await client.verifyIdToken({
			idToken: token,
			audience: clientId,
		});
		const payload = ticket.getPayload();
		let user = await UserModel.findOne({ email: payload.email }).exec();

		if (!user) {
			const image = await axios.get(payload.picture, {
				responseType: "arraybuffer",
			});
			console.log(image);
			const base64 = Buffer.from(image.data, "binary").toString("base64");
			const filename = Date.now() + payload.sub + ".png";
			fs.writeFileSync(
				path.join(__dirname, "../public", filename),
				base64,
				"base64"
			);
			user = await UserModel.create({
				email: payload.email,
				profilePic: filename,
				username: payload.name,
			});
		}

		const payloadToSign = {
			id: user.id,
			username: user.username,
			isAdmin: user.isAdmin,
			profilePic: user.profilePic,
		};

		return res.status(200).json({
			accessToken: createAccessToken(payloadToSign),
			refreshToken: createRefreshToken(payloadToSign),
		});
	} catch (err) {
		console.error(err);
		return res.status(500).json({ err, msg: "Something went wrong" });
	}
});

// refresh token
router.post("/refreshtoken", async (req, res) => {
	try {
		const { id, username, isAdmin, profilePic } = validateRefreshToken(
			req.body.refreshToken
		);
		const payload = {
			id,
			username,
			isAdmin,
			profilePic,
		};

		return res.status(200).json({
			accessToken: createAccessToken(payload),
			refreshToken: createRefreshToken(payload),
		});
	} catch (err) {
		console.error(err);
		return res.status(401).json({ err, msg: "Unauthorized" });
	}
});
module.exports = router;
