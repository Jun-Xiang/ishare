import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { toast } from "react-toastify";

import Input from "../components/form/InputWithValidation";
import Button from "../components/Button";
import { createPost } from "../api/posts";
import Spinner from "../components/Spinner";
import Preview from "../components/PreviewImage";

const Add = () => {
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);

	return (
		<div className="overflow-y-auto h-full flex justify-center items-center py-6">
			<Formik
				initialValues={{
					desc: "",
					file: null,
				}}
				onSubmit={({ desc, file }) => {
					const reader = new FileReader();
					setLoading(true);
					reader.onload = e => {
						const img = {
							src: e.target.result,
							filename: file.name,
							mime: file.type,
						};
						createPost(desc, img)
							.then(_ => {
								setLoading(false);
								navigate("/feed");
							})
							.catch(err => console.log(err));
					};
					reader.readAsDataURL(file);
				}}
				validationSchema={yup.object({
					desc: yup.string().required("Must have description"),
					file: yup.mixed().required("Must have an image"),
				})}>
				{props => (
					<Form className="flex flex-col gap-5 w-[70%] md:w-[25%] m-auto">
						{loading && <Spinner size="50" fullscreen={true} />}
						<h1 className="text-3xl font-bold">Add post</h1>
						<Field
							component={Input}
							placeholder="Description"
							name="desc"
							label="Description"
						/>
						<div className="flex flex-col">
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
						<Button.Primary type="submit" text="Post" />
					</Form>
				)}
			</Formik>
		</div>
	);
};

export default Add;
