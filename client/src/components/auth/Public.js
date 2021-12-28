import React from "react";
import { Navigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
const Public = ({ children }) => {
	const { auth } = useAuth();

	if (auth) return <Navigate to="/feed" />;

	return children;
};

export default Public;
