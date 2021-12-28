import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CancelToken, isCancel } from "axios";
import { Formik, Form, Field } from "formik";
import * as yup from "yup";
import { toast } from "react-toastify";

import { getMe, updateUser, changeProfilePic, deleteUser } from "../api/users";
import { useAuth } from "../context/AuthContext";
import Input from "../components/form/InputWithValidation";
import Button from "../components/Button";
import Spinner from "../components/Spinner";
import Preview from "../components/PreviewImage";
import Divider from "../components/Divider";

const Settings = () => {
	const { user: curUser, signOut } = useAuth();
	const navigate = useNavigate();

	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(false);

	const handleDeleteAccount = async _ => {
		const { msg } = await deleteUser();
		toast.success(msg);
		signOut();
	};

	useEffect(() => {
		const cancelToken = CancelToken.source();

		getMe(cancelToken.token)
			.then(data => {
				setUser(data.user);
			})
			.catch(err => !isCancel(err) && toast.error(err.message));

		return _ => cancelToken.cancel();
	}, [curUser, navigate]);
	if (!user) return <p>Loading...</p>;
	return (
		<div className="overflow-y-auto h-full flex justify-center items-center py-6">
			<Formik
				initialValues={{
					username: user.username,
					email: user.email,
					desc: user.desc ?? "",
					password: "",
					file: null,
				}}
				onSubmit={async ({ file, ...others }) => {
					try {
						setLoading(true);
						if (file) {
							const form = new FormData();
							form.append("profilepic", file, file.name);
							await changeProfilePic(form);
						}
						const { msg } = await updateUser(others);
						toast.success(msg);
						setLoading(false);
						navigate("/feed");
					} catch (err) {
						toast.error(err.response.data.msg);
						setLoading(false);
					}
				}}
				validationSchema={yup.object({
					username: yup
						.string()
						.min(3, "Must be at least 3 characters")
						.required("Username is required"),
					email: yup
						.string()
						.email("Invalid email")
						.required("Email is required"),
					password: yup
						.string()
						.min(6, "Must be at least 6 characters"),
					desc: yup.string(),
					file: yup.mixed(),
				})}>
				{props => (
					<Form className="flex flex-col gap-5 w-[25%] m-auto">
						{loading && <Spinner size="50" fullscreen={true} />}
						<h1 className="text-3xl font-bold">Edit Profile</h1>
						<Field
							component={Input}
							placeholder="Username"
							name="username"
						/>
						<Field
							component={Input}
							placeholder="Email"
							name="email"
						/>
						<Field
							label="Description"
							component={Input}
							placeholder="Description"
							name="desc"
						/>
						<Field
							label="New Password"
							name="password"
							component={Input}
							placeholder="New password (ignore if unchanged)"
							type="password"
						/>
						<div className="flex flex-col">
							<label className="text-gray-700 capitalize">
								Profile Picture
							</label>
							<input
								accept=".png,.jpeg,.jpg,.gif"
								type="file"
								name="file"
								onChange={e => {
									const validExt = ["png", "jpg", "jpeg"];
									const ext = e.target.files[0].name
										.split(".")
										.pop()
										.toLowerCase();
									if (!validExt.includes(ext))
										return toast.error("Invalid file type");
									props.setFieldValue(
										"file",
										e.target.files[0]
									);
								}}
							/>
							<Preview file={props.values.file} />
						</div>
						<Button.Primary type="submit" text="Update" />
						<Divider text="Others" />
						<Button.Secondary
							type="button"
							text="Logout"
							onClick={signOut}
						/>
						<Button.Danger
							type="button"
							text="Delete Account"
							onClick={handleDeleteAccount}
						/>
					</Form>
				)}
			</Formik>
		</div>
	);
};

export default Settings;
