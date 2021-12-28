import React from "react";
import { Routes, Route, Outlet, useParams } from "react-router-dom";
import Protected from "../../auth/Protected";
import Profile from "../feed/Profile";
import ProtectedNav from "../nav/ProtectedNav";
import Header from "../Header";

/* TODO: (low priority) Find out how to use multiple components from the same Outlet */
const ProtectedLayout = () => {
	const { id } = useParams();

	return (
		<Protected>
			<div className="flex flex-col-reverse md:flex-row justify-between h-screen">
				{/* Left */}
				<div
					className={`sticky bottom-0 w-full ${
						id && "hidden"
					} md:block md:top-0 md:w-auto md:h-screen`}>
					{/* <ProtectedNav /> */}
					<ProtectedNav />
				</div>

				{/* Mid */}
				<div className="flex flex-col bg-gray-100 justify-start grow overflow-auto">
					<Routes>
						<Route path="feed/*" element={<Header />} />
					</Routes>
					<Outlet />
				</div>

				{/* Right */}
				{/* <div className="w-80 hidden md:block"> */}
				<Routes>
					<Route path="feed/" element={<Profile />} />
				</Routes>
				{/* </div> */}
			</div>
		</Protected>
	);
};

export default ProtectedLayout;
