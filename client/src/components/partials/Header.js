import React from "react";
import { useNavigate } from "react-router-dom";

import Search from "./Search";

const Header = () => {
	const navigate = useNavigate();
	const handleOnClick = u => {
		navigate("/profile/" + u._id);
	};
	return (
		<div className="w-full flex justify-between items-center border-b-2 py-5 px-4 border-gray-400/10 bg-white">
			<div className="logo">IShare</div>
			<Search handleOnClick={handleOnClick} />
		</div>
	);
};

export default Header;
