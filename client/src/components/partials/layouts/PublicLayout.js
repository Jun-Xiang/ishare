import React from "react";
import { Outlet } from "react-router-dom";
import Public from "../../auth/Public";
import PublicNav from "../nav/PublicNav";

const PublicLayout = () => {
	return (
		<Public>
			<div className=" py-6 px-12 h-screen flex flex-col w-full gap-20 md:gap-10 md:py-10 md:px-32">
				<PublicNav />
				<Outlet />
			</div>
		</Public>
	);
};

export default PublicLayout;
