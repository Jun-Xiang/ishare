import React from "react";
import { Link } from "react-router-dom";
import logo from "../../../assets/img/logo.svg";
import Button from "../../Button";

const PublicNav = () => {
	return (
		<header className="sticky top-0 flex justify-between items-center bg-white py-6 md:p-0 ">
			<img src={logo} alt="" className="w-10" />
			<div className="flex items-center gap-6">
				<Link to="/auth?type=signin">Login</Link>
				<Link to="/auth?type=register">
					<Button.Primary text="Join now" />
				</Link>
			</div>
		</header>
	);
};

export default PublicNav;
