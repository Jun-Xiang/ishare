import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";

import App from "./App";
import Feed from "./pages/Feed";
import Auth from "./pages/Auth";
import Welcome from "./pages/Welcome";
import PostDetails from "./pages/PostDetails";
import Messages from "./pages/Messages";
import Add from "./pages/Add";
import Calls from "./pages/Calls";

import PublicLayout from "./components/partials/layouts/PublicLayout";
import ProtectedLayout from "./components/partials/layouts/ProtectedLayout";
import Conversation from "./components/partials/messages/Conversation";

import AuthProvider from "./context/AuthContext";
import SocketProvider from "./context/SocketContext";
import VideoProvider from "./context/VideoContext";

import "./assets/css/index.css";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
// TODO: add framer motion if got time
// TODO: import poppins font

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
							<Route path="/*" element={<PublicLayout />}>
								<Route index element={<Welcome />} />
								<Route path="auth" element={<Auth />} />
							</Route>

							<Route path="/*" element={<ProtectedLayout />}>
								<Route path="feed" element={<Feed />} />
								<Route
									path="feed/:id"
									element={<PostDetails />}
								/>
								<Route
									element={<VideoProvider></VideoProvider>}>
									<Route
										path="messages"
										element={<Messages />}>
										<Route
											path=":id/"
											element={<Conversation />}
										/>
									</Route>

									<Route
										path="call/:id"
										element={<Calls />}
									/>
								</Route>
								<Route path="add" element={<Add />} />

								<Route
									path="profile/:id"
									element={<Profile />}
								/>

								<Route path="settings" element={<Settings />} />
							</Route>
						</Route>
					</Routes>
				</BrowserRouter>
			</SocketProvider>
		</AuthProvider>
	</React.StrictMode>,
	document.getElementById("root")
);
