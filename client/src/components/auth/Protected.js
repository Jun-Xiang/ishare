import React from "react";
import { Navigate, useLocation } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
// implementation from https://stackblitz.com/github/remix-run/react-router/tree/main/examples/auth?file=src/App.tsx
const Protected = ({ children }) => {
	const { auth } = useAuth();
	const location = useLocation();

	if (!auth) return <Navigate to="/auth" state={{ from: location }} />;

	return children;
};

export default Protected;
