const UserModel = require("../../models/User");

const updateUserStatus = async (userId, isActive) => {
	const updatedUser = await UserModel.findByIdAndUpdate(
		userId,
		{
			isActive,
		},
		{ new: true }
	);
	return updatedUser;
};

module.exports = {
	updateUserStatus,
};
