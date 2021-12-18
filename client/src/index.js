import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";

import App from "./App";
import Feed from "./pages/Feed";
import Auth from "./pages/Auth";
import Welcome from "./pages/Welcome";

import PublicLayout from "./components/partials/layouts/PublicLayout";
import ProtectedLayout from "./components/partials/layouts/ProtectedLayout";

import AuthProvider from "./context/AuthContext";
import SocketProvider from "./context/SocketContext";

import "./assets/css/index.css";

const Left = _ => <div>Left</div>;
const Right = _ => <div>Right</div>;

const toastClass = {
	success: "bg-green-100 text-green-700",
	error: "bg-red-100 text-red-700",
	info: "bg-blue-100 text-blue-700",
	warning: "bg-yellow-100 text-yellow-700",
	default: "bg-purple-100 text-purple-700",
};

ReactDOM.render(
	<React.StrictMode>
		<AuthProvider>
			<SocketProvider>
				<ToastContainer
					toastClassName={({ type }) =>
						toastClass[type || "default"] +
						" Toastify__toast Toastify__toast-theme--light Toastify__toast--error"
					}
				/>
				<BrowserRouter>
					<Routes>
						<Route path="/">
							<Route element={<PublicLayout />}>
								<Route index element={<Welcome />} />
								<Route path="auth" element={<Auth />} />
							</Route>

							<Route element={<ProtectedLayout />}>
								<Route path="feed" element={<Feed />} />
							</Route>
						</Route>
					</Routes>
				</BrowserRouter>
			</SocketProvider>
		</AuthProvider>
	</React.StrictMode>,
	document.getElementById("root")
);
