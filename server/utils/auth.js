const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

/**
 * Create tokens
 */
const createAccessToken = payload => {
	const accessToken = jwt.sign(payload, process.env.AT_SECRET, {
		expiresIn: "7h",
	});

	return accessToken;
};

const createRefreshToken = payload => {
	const refreshToken = jwt.sign(payload, process.env.RT_SECRET, {
		expiresIn: "7d",
	});

	return refreshToken;
};

/**
 * Create password hash
 */
const createPasswordHash = async password => {
	const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_SALT_ROUNDS));
	const hash = await bcrypt.hash(password, salt);

	return hash;
};

/**
 * Validate password
 */
const validatePassword = async (password, hash) => {
	const result = await bcrypt.compare(password, hash);

	return result;
};

/**
 * Validate token
 */
const validateToken = token => jwt.verify(token, process.env.AT_SECRET);

/**
 * Validate refresh token
 */
const validateRefreshToken = token => jwt.verify(token, process.env.RT_SECRET);

module.exports = {
	validatePassword,
	createPasswordHash,
	createAccessToken,
	createRefreshToken,
	validateToken,
	validateRefreshToken,
};
