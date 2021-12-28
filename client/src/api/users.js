import api from ".";

export const getUser = async (id, cancelToken) => {
	const { data } = await api.get("/users/" + id, { cancelToken });

	return data;
};

export const getMe = async cancelToken => {
	const { data } = await api.get("/users", { cancelToken });

	return data;
};

export const followUser = async id => {
	const { data } = await api.put("/users/follow/" + id);

	return data;
};

export const unfollowUser = async id => {
	const { data } = await api.put("/users/unfollow/" + id);

	return data;
};

export const updateUser = async values => {
	const { data } = await api.put("/users", values);

	return data;
};

export const changeProfilePic = async form => {
	const { data } = await api.put("/users/profilepic", form);

	return data;
};

export const searchUsers = async (search, cancelToken) => {
	const { data } = await api.get(`/users/search?search=${search}`, {
		cancelToken,
	});

	return data;
};

export const deleteUser = async _ => {
	const { data } = await api.delete("/users");

	return data;
};
