import React from "react";
import { Outlet } from "react-router-dom";

import History from "../components/partials/messages/History";

const Messages = () => {
	return (
		<div className="flex grow">
			<History />
			<Outlet />
		</div>
	);
};

export default Messages;
