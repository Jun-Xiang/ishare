import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import * as yup from "yup";

import { useAuth } from "../context/AuthContext";
import Input from "../components/form/InputWithValidation";
import Button from "../components/Button";
import Divider from "../components/Divider";

const cliendId =
	"815667115963-gd3ksgbk79kfvao7mrfo6kklq77q2ocs.apps.googleusercontent.com";

const Auth = () => {
	const { signIn, register, signInGoogle } = useAuth();
	const navigate = useNavigate();
	const location = useLocation();
	const [searchParams] = useSearchParams();
	const from = location.state?.from?.pathname || "/feed";

	const [isSignIn, setIsSignIn] = useState(
		searchParams.get("type") !== "register"
	);
	const [gsiLoaded, setGsiLoaded] = useState(false);

	const btnDivRef = useRef(null);

	useEffect(() => {
		setIsSignIn(searchParams.get("type") !== "register");
	}, [searchParams]);

	useEffect(() => {
		const handleGoogleSignIn = async res => {
			await signInGoogle(res.credential, () => {
				navigate(from, { replace: true });
			});
		};
		const initializeGsi = _ => {
			if (!window.google || gsiLoaded) return;
			setGsiLoaded(true);

			window.google.accounts.id.initialize({
				client_id: cliendId,
				callback: handleGoogleSignIn,
			});
			window.google.accounts.id.renderButton(
				btnDivRef.current,
				{ theme: "outline", size: "large" } // customization attributes
			);
		};

		const script = document.createElement("script");
		script.src = "https://accounts.google.com/gsi/client";
		script.onload = initializeGsi;
		script.async = true;
		script.id = "google-script";
		document.querySelector("head")?.appendChild(script);

		return _ => {
			document.getElementById("google-script")?.remove();
			window.google?.accounts.id.cancel();
		};
	}, [gsiLoaded, signInGoogle, from, navigate]);

	return (
		<Formik
			initialValues={{
				username: "",
				email: "",
				password: "",
			}}
			onSubmit={async ({ email, password, username }) => {
				// TODO: Implement Auto login if got time
				isSignIn
					? await signIn(email, password, () => {
							navigate(from, { replace: true });
					  })
					: await register(username, email, password, () =>
							setIsSignIn(true)
					  );
			}}
			validationSchema={yup.object({
				username:
					!isSignIn &&
					yup
						.string()
						.min(3, "Must be at least 3 characters")
						.required("Username is required"),
				email: yup
					.string()
					.email("Invalid email")
					.required("Email is required"),
				password: yup
					.string()
					.min(6, "Must be at least 6 characters")
					.required("Password is required"),
			})}>
			<Form className="flex flex-col gap-5 w-[25%] m-auto">
				<h1 className="text-3xl font-bold">
					{isSignIn ? "Sign In" : "Register"}
				</h1>
				{!isSignIn && (
					<Field
						name="username"
						component={Input}
						placeholder="Your username"
					/>
				)}
				<Field
					name="email"
					component={Input}
					placeholder="Your email"
				/>
				<Field
					name="password"
					component={Input}
					placeholder="Your password"
					type="password"
				/>
				{isSignIn ? (
					<p className="text-sm text-gray-600">
						Don't have an account?{" "}
						<Button.Text
							onClick={e => setIsSignIn(false)}
							text="Register"
						/>
					</p>
				) : (
					<p className="text-sm text-gray-600">
						Have an account?{" "}
						<Button.Text
							onClick={e => setIsSignIn(true)}
							text="Sign In"
						/>
					</p>
				)}
				<Button.Primary
					className="mt-2"
					type="submit"
					text={isSignIn ? "Sign In" : "Register"}
				/>
				<Divider text="OR" />
				<div ref={btnDivRef} className="flex justify-center"></div>
			</Form>
		</Formik>
	);
};

export default Auth;
