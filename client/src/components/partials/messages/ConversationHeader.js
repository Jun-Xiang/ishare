import { Formik, Form, Field } from "formik";
import * as yup from "yup";
import { useRef, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";

import { useVideo } from "../../../context/VideoContext";
import Modal from "../../Modal";
import Input from "../../form/InputWithValidation";
import Preview from "../../PreviewImage";
import Button from "../../Button";
import Spinner from "../../Spinner";
import { updateConversation, leaveGroup } from "../../../api/conversations";
import Menu from "../../Menu";
import { useAuth } from "./../../../context/AuthContext";

const ConversationHeader = ({ convo }) => {
	const { call, answerCall } = useVideo();
	const { updateConvo, removeConvo } = useOutletContext();
	const navigate = useNavigate();
	const { id } = useParams();
	const { user } = useAuth();

	const targetRef = useRef(null);

	const [show, setShow] = useState(false);
	const [loading, setLoading] = useState(false);
	const [showMenu, setShowMenu] = useState(false);
	const closeModal = _ => {
		setShow(false);
	};
	const closeMenu = _ => setShowMenu(false);

	const handleLeaveGroup = async _ => {
		const { convo } = await leaveGroup(id);
		removeConvo(convo._id);
		navigate("/messages");
	};

	// For dms only
	const receiver =
		!convo?.isGroup && convo?.members?.find(x => x._id !== user.id);
	const isOnline = convo?.isGroup
		? convo?.members.find(x => x.isActive && x._id !== user.id)
		: receiver?.isActive;

	// TODO: refactor
	return (
		<div className="flex justify-between items-center py-8 group">
			{convo.isGroup && (
				<Menu
					show={showMenu}
					targetRef={targetRef}
					closeMenu={closeMenu}>
					{style => (
						<span
							onClick={handleLeaveGroup}
							className={`${style} justify-between text-gray-600 hover:text-red-600`}>
							Leave group
							<svg
								className="h-5 w-5"
								viewBox="0 0 24 24"
								fill="none"
								xmlns="http://www.w3.org/2000/svg">
								<path
									d="M17.4399 14.62L19.9999 12.06L17.4399 9.5"
									className="stroke-current"
									strokeWidth="2"
									strokeMiterlimit="10"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
								<path
									d="M9.76001 12.0601H19.93"
									className="stroke-current"
									strokeWidth="2"
									strokeMiterlimit="10"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
								<path
									d="M11.76 20C7.34001 20 3.76001 17 3.76001 12C3.76001 7 7.34001 4 11.76 4"
									className="stroke-current"
									strokeWidth="2"
									strokeMiterlimit="10"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							</svg>
						</span>
					)}
				</Menu>
			)}
			{convo.isGroup && (
				<Modal show={show} closeModal={closeModal}>
					<div className="py-6 px-8 rounded-lg bg-white w-96 max-w-[90%] mx-auto mt-8">
						<Formik
							initialValues={{
								name: convo.groupName,
								file: null,
							}}
							validationSchema={yup.object({
								name: yup.string().required("Must have a name"),
								file: yup.mixed(),
							})}
							onSubmit={async ({ name, file }) => {
								setLoading(true);
								if (file) {
									const reader = new FileReader();
									reader.onload = async e => {
										const img = {
											src: e.target.result,
											filename: file.name,
										};
										const { convo } =
											await updateConversation(
												id,
												name,
												img
											);
										updateConvo(convo._id, convo);
										setLoading(false);
										setShow(false);
									};
									reader.readAsDataURL(file);
								} else {
									const { convo } = await updateConversation(
										id,
										name,
										null
									);
									updateConvo(convo._id, convo);
									setLoading(false);
									setShow(false);
								}
							}}>
							{props => (
								<Form className="flex flex-col gap-4">
									{loading && (
										<Spinner size="50" fullscreen={true} />
									)}
									<h3 className="text-xl font-bold mb-2">
										Update group info
									</h3>
									<Field
										component={Input}
										name="name"
										placeholder="Group name"
									/>
									<div className="flex flex-col">
										<label className="text-gray-700 capitalize">
											Group Picture
										</label>
										<input
											accept=".png,.jpeg,.jpg,.gif"
											type="file"
											name="file"
											onChange={e => {
												const validExt = [
													"png",
													"jpg",
													"jpeg",
												];
												const ext =
													e.target.files[0].name
														.split(".")
														.pop()
														.toLowerCase();
												if (!validExt.includes(ext))
													return toast.error(
														"Invalid file type"
													);
												props.setFieldValue(
													"file",
													e.target.files[0]
												);
											}}
										/>
										<Preview file={props.values.file} />
									</div>
									<Button.Primary
										type="submit"
										text="Update"
										size="small"
									/>
								</Form>
							)}
						</Formik>
					</div>
				</Modal>
			)}
			<div className="flex gap-4 items-center">
				<svg
					onClick={_ => navigate("/messages")}
					className="w-8 h-8 cursor-pointer text-gray-700 hover:text-gray-900 transition duration-200 shrink-0 md:hidden"
					viewBox="0 0 24 24"
					fill="none"
					xmlns="http://www.w3.org/2000/svg">
					<path
						d="M15 19.9201L8.47997 13.4001C7.70997 12.6301 7.70997 11.3701 8.47997 10.6001L15 4.08008"
						className="stroke-current"
						strokeWidth="2"
						strokeMiterlimit="10"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</svg>
				<div className="relative shrink-0 w-10 h-10">
					<img
						src={`${process.env.REACT_APP_API_URL}/${
							convo?.isGroup
								? convo.groupImg ?? "group.jpg"
								: receiver?.profilePic ?? "default.jpg"
						}`}
						alt=""
						className="rounded-full h-full w-full object-cover"
					/>
					{isOnline && (
						<div className="rounded-full p-1.5 bg-green-600 absolute right-0 bottom-0 border-[3px] border-white transform translate-x-[1.5px] translate-y-[1.5px]"></div>
					)}
				</div>
				<div className="flex justify-between items-center w-full">
					<div className="flex flex-col justify-between">
						<h4 className="font-bold text-xl line-clamp-1">
							{convo?.isGroup
								? convo?.groupName
								: receiver?.username || "Deleted User"}
						</h4>
						<p className="line-clamp-1 text-sm text-gray-700">
							{isOnline && "Online"}
						</p>
					</div>
				</div>
				{convo.isGroup && (
					<svg
						onClick={_ => setShow(true)}
						className="w-5 h-5 cursor-pointer self-start mt-1 -ml-2 opacity-0 pointer-events-none shrink-0 text-gray-700 hover:text-gray-900 group-hover:opacity-100 group-hover:pointer-events-auto transition duration-200"
						viewBox="0 0 24 24"
						fill="none"
						xmlns="http://www.w3.org/2000/svg">
						<path
							d="M13.26 3.59997L5.04997 12.29C4.73997 12.62 4.43997 13.27 4.37997 13.72L4.00997 16.96C3.87997 18.13 4.71997 18.93 5.87997 18.73L9.09997 18.18C9.54997 18.1 10.18 17.77 10.49 17.43L18.7 8.73997C20.12 7.23997 20.76 5.52997 18.55 3.43997C16.35 1.36997 14.68 2.09997 13.26 3.59997Z"
							className="stroke-current"
							strokeWidth="2"
							strokeMiterlimit="10"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
						<path
							d="M11.89 5.05005C12.32 7.81005 14.56 9.92005 17.34 10.2"
							className="stroke-current"
							strokeWidth="2"
							strokeMiterlimit="10"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
						<path
							d="M3 22H21"
							className="stroke-current"
							strokeWidth="2"
							strokeMiterlimit="10"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>
				)}
			</div>
			{/* Action */}
			<div className="flex gap-8 items-center">
				{convo.members.length > 1 && (
					<>
						{/* Call */}
						<svg
							className="w-5 h-5 cursor-pointer text-gray-700 hover:text-gray-900 transition duration-200"
							viewBox="0 0 24 24"
							fill="none"
							xmlns="http://www.w3.org/2000/svg">
							<path
								d="M21.97 18.33C21.97 18.69 21.89 19.06 21.72 19.42C21.55 19.78 21.33 20.12 21.04 20.44C20.55 20.98 20.01 21.37 19.4 21.62C18.8 21.87 18.15 22 17.45 22C16.43 22 15.34 21.76 14.19 21.27C13.04 20.78 11.89 20.12 10.75 19.29C9.6 18.45 8.51 17.52 7.47 16.49C6.44 15.45 5.51 14.36 4.68 13.22C3.86 12.08 3.2 10.94 2.72 9.81C2.24 8.67 2 7.58 2 6.54C2 5.86 2.12 5.21 2.36 4.61C2.6 4 2.98 3.44 3.51 2.94C4.15 2.31 4.85 2 5.59 2C5.87 2 6.15 2.06 6.4 2.18C6.66 2.3 6.89 2.48 7.07 2.74L9.39 6.01C9.57 6.26 9.7 6.49 9.79 6.71C9.88 6.92 9.93 7.13 9.93 7.32C9.93 7.56 9.86 7.8 9.72 8.03C9.59 8.26 9.4 8.5 9.16 8.74L8.4 9.53C8.29 9.64 8.24 9.77 8.24 9.93C8.24 10.01 8.25 10.08 8.27 10.16C8.3 10.24 8.33 10.3 8.35 10.36C8.53 10.69 8.84 11.12 9.28 11.64C9.73 12.16 10.21 12.69 10.73 13.22C11.27 13.75 11.79 14.24 12.32 14.69C12.84 15.13 13.27 15.43 13.61 15.61C13.66 15.63 13.72 15.66 13.79 15.69C13.87 15.72 13.95 15.73 14.04 15.73C14.21 15.73 14.34 15.67 14.45 15.56L15.21 14.81C15.46 14.56 15.7 14.37 15.93 14.25C16.16 14.11 16.39 14.04 16.64 14.04C16.83 14.04 17.03 14.08 17.25 14.17C17.47 14.26 17.7 14.39 17.95 14.56L21.26 16.91C21.52 17.09 21.7 17.3 21.81 17.55C21.91 17.8 21.97 18.05 21.97 18.33Z"
								className="stroke-current"
								strokeWidth="2"
								strokeMiterlimit="10"
							/>
						</svg>
						{/* Video */}
						<svg
							onClick={_ => {
								convo.onGoingCall
									? answerCall(convo._id)
									: call(convo._id, convo.members);
							}}
							className="w-5 h-5 cursor-pointer text-gray-600 hover:text-gray-900 transition duration-200"
							viewBox="0 0 22 20"
							fill="none"
							xmlns="http://www.w3.org/2000/svg">
							<path
								d="M11.53 18.4201H5.21C2.05 18.4201 1 16.3201 1 14.2101V5.79008C1 2.63008 2.05 1.58008 5.21 1.58008H11.53C14.69 1.58008 15.74 2.63008 15.74 5.79008V14.2101C15.74 17.3701 14.68 18.4201 11.53 18.4201Z"
								className="stroke-current"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
							<path
								d="M18.52 15.0999L15.74 13.1499V6.83989L18.52 4.88989C19.88 3.93989 21 4.51989 21 6.18989V13.8099C21 15.4799 19.88 16.0599 18.52 15.0999Z"
								className="stroke-current"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
						</svg>
					</>
				)}
				{/* Three dots */}
				{convo.isGroup && (
					<svg
						ref={targetRef}
						onClick={_ => setShowMenu(true)}
						className="h-5 w-5 cursor-pointer text-gray-600 hover:text-gray-900 transition duration-200"
						viewBox="0 0 24 24"
						fill="none"
						xmlns="http://www.w3.org/2000/svg">
						<path
							d="M5 10C3.9 10 3 10.9 3 12C3 13.1 3.9 14 5 14C6.1 14 7 13.1 7 12C7 10.9 6.1 10 5 10Z"
							className="stroke-current"
							strokeWidth="2"
						/>
						<path
							d="M19 10C17.9 10 17 10.9 17 12C17 13.1 17.9 14 19 14C20.1 14 21 13.1 21 12C21 10.9 20.1 10 19 10Z"
							className="stroke-current"
							strokeWidth="2"
						/>
						<path
							d="M12 10C10.9 10 10 10.9 10 12C10 13.1 10.9 14 12 14C13.1 14 14 13.1 14 12C14 10.9 13.1 10 12 10Z"
							className="stroke-current"
							strokeWidth="2"
						/>
					</svg>
				)}
			</div>
		</div>
	);
};

export default ConversationHeader;
