import React, { useState, useEffect, useRef } from "react";
import { CancelToken, isCancel } from "axios";
import { toast } from "react-toastify";

import { searchUsers } from "../../api/users";
import Menu from "../Menu";

// !This component is too specific (only searches for user)
const Search = ({ handleOnClick, filterFn }) => {
	const [search, setSearch] = useState("");
	const [users, setUsers] = useState(null);
	const [show, setShow] = useState(false);

	const searchRef = useRef(null);

	const closeMenu = _ => {
		setUsers(null);
		setShow(false);
	};

	useEffect(() => {
		const cancelToken = CancelToken.source();
		setShow(false);
		if (search.length >= 1) {
			setShow(true);
			searchUsers(search, cancelToken.token)
				.then(data =>
					setUsers(
						typeof filterFn === "function"
							? filterFn(data.users)
							: data.users
					)
				)
				.catch(
					err =>
						!isCancel(err) &&
						toast.error(err.message, { toastId: "error" })
				);
		}
		return () => {
			cancelToken.cancel();
		};
	}, [search, filterFn]);
	// TODO change it so that it doesn't look like insta (if have time)
	return (
		<>
			{users && (
				<Menu
					show={show}
					targetRef={searchRef}
					closeMenu={closeMenu}
					moveLeft={false}
					className="shadow-[0_0_60px_-12px_rgba(0,0,0,0.2)]"
					additionalOffset={{ top: 55, left: 8 }}>
					{style => (
						<div className="flex flex-col gap-2 py-3">
							{users.length > 0 ? (
								users.map(u => (
									<div
										onClick={_ => {
											handleOnClick(u);
											setSearch("");
										}}
										className={`${style} flex items-center py-2`}
										key={u._id}>
										<img
											src={`${process.env.REACT_APP_API_URL}/${u.profilePic}`}
											alt=""
											className="w-5 h-5 rounded-3xl object-cover object-center"
										/>
										<p>{u.username}</p>
									</div>
								))
							) : (
								<p> No users found </p>
							)}
						</div>
					)}
				</Menu>
			)}
			<div className="relative">
				<svg
					className="absolute text-gray-400 w-4 h-4 top-1/2 -translate-y-1/2 -translate-x-1/2 left-4"
					viewBox="0 0 24 24"
					fill="none"
					xmlns="http://www.w3.org/2000/svg">
					<path
						className="stroke-current"
						d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
					<path
						className="stroke-current"
						d="M22 22L20 20"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</svg>

				<input
					ref={searchRef}
					value={search}
					onChange={e => setSearch(e.target.value)}
					type="text"
					placeholder="Search"
					className="rounded-lg border-transparent appearance-none w-full py-3 px-5 pl-8 bg-gray-50 focus:bg-gray-100 text-gray-700 placeholder-gray-400 text-base focus:outline-none transition duration-200"
				/>
			</div>
		</>
	);
};

export default Search;
