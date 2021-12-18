import React from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import Protected from "../../auth/Protected";
import ProtectedNav from "../nav/ProtectedNav";

const ProtectedLayout = () => {
	return (
		<Protected>
			<div className="flex justify-between">
				{/* Left */}
				<div className="w-80 hidden md:block">
					{/* TODO: Find out how to use multiple components from the same Outlet */}
					<Routes>
						<Route path="feed" element={<div>Div left</div>} />
					</Routes>
				</div>

				{/* Mid */}
				<div className="grow flex flex-col items-center gap-14">
					{/* TODO: Make a routes so that nav only shows on some routes  */}
					<ProtectedNav />
					<Outlet />
				</div>

				{/* Right */}
				<div className="w-80 hidden md:block">
					<Routes>
						<Route path="feed" element={<div>Div right</div>} />
					</Routes>
				</div>
			</div>
		</Protected>
	);
};

export default ProtectedLayout;
