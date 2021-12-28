import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import * as yup from "yup";

import { useAuth } from "../context/AuthContext";
import Input from "../components/form/InputWithValidation";
import Button from "../components/Button";

const Auth = () => {
	const { signIn, register } = useAuth();
	const navigate = useNavigate();
	const location = useLocation();
	const from = location.state?.from?.pathname || "/feed";

	const [isSignIn, setIsSignIn] = useState(true);

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
			</Form>
		</Formik>
	);
};

export default Auth;
