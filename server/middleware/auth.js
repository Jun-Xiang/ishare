const { validateToken } = require("../utils/auth");
module.exports = async (req, res, next) => {
	const token = req.header("Authorization")?.split(" ")?.[1];
	if (!token) return res.status(401).json({ msg: "Missing token" });
	try {
		const payload = validateToken(token);
		req.user = payload;
		next();
	} catch (err) {
		return res.status(401).json({ msg: "Something went wrong", err });
	}
};
