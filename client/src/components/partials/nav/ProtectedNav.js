import React from "react";
import { NavLink, Link } from "react-router-dom";
import logo from "../../../assets/img/logo.svg";
import logout from "../../../assets/img/logout.svg";
import { useAuth } from "../../../context/AuthContext";

const StyledNavLink = ({ children, to }) => {
	const activeClass = "bg-purple-600 text-pink-200";
	const inactiveClass = "text-gray-500 hover:bg-purple-300";
	const chooseClass = isActive => (isActive ? activeClass : inactiveClass);

	return (
		<NavLink
			to={to}
			className={({ isActive }) =>
				`transition duration-200 ease-in-out block rounded-lg w-9 h-9 p-1.5 ${chooseClass(
					isActive
				)}`
			}>
			{children}
		</NavLink>
	);
};

const ProtectedNav = () => {
	const { signOut, user } = useAuth();

	return (
		<nav className="w-full md:w-auto md:h-full bg-purple-100 md:bg-white relative flex flex-col justify-center items-center border-r-2 border-gray-400/10">
			<Link
				to="/feed"
				className="hidden justify-self-start w-10 md:block absolute top-8">
				<img
					src={logo}
					alt=""
					className="cursor-pointer opacity-80 hover:opacity-100 transition duration-200"
				/>
			</Link>

			<ul className="flex md:flex-col items-center justify-center gap-8 py-4 px-6 grow md:grow-0">
				{/* Home Icon */}
				<li>
					<StyledNavLink to="/feed">
						<svg
							viewBox="0 0 24 24"
							fill="none"
							xmlns="http://www.w3.org/2000/svg">
							<path
								className="stroke-current"
								d="M9.02 2.84004L3.63 7.04004C2.73 7.74004 2 9.23004 2 10.36V17.77C2 20.09 3.89 21.99 6.21 21.99H17.79C20.11 21.99 22 20.09 22 17.78V10.5C22 9.29004 21.19 7.74004 20.2 7.05004L14.02 2.72004C12.62 1.74004 10.37 1.79004 9.02 2.84004Z"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
							<path
								className="stroke-current"
								d="M12 17.99V14.99"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
						</svg>
					</StyledNavLink>
				</li>
				{/* Messages */}
				<li>
					<StyledNavLink to="/messages">
						<svg
							viewBox="0 0 24 24"
							fill="none"
							xmlns="http://www.w3.org/2000/svg">
							<path
								d="M18.47 16.83L18.86 19.99C18.96 20.82 18.07 21.4 17.36 20.97L13.17 18.48C12.71 18.48 12.26 18.45 11.82 18.39C12.56 17.52 13 16.42 13 15.23C13 12.39 10.54 10.09 7.49997 10.09C6.33997 10.09 5.26997 10.42 4.37997 11C4.34997 10.75 4.33997 10.5 4.33997 10.24C4.33997 5.68999 8.28997 2 13.17 2C18.05 2 22 5.68999 22 10.24C22 12.94 20.61 15.33 18.47 16.83Z"
								className="stroke-current"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
							<path
								d="M13 15.23C13 16.42 12.56 17.5201 11.82 18.3901C10.83 19.5901 9.26 20.36 7.5 20.36L4.89 21.91C4.45 22.18 3.89 21.81 3.95 21.3L4.2 19.3301C2.86 18.4001 2 16.91 2 15.23C2 13.47 2.94 11.9201 4.38 11.0001C5.27 10.4201 6.34 10.0901 7.5 10.0901C10.54 10.0901 13 12.39 13 15.23Z"
								className="stroke-current"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
						</svg>
					</StyledNavLink>
				</li>
				{/* Add post */}
				<li>
					<StyledNavLink to="/add">
						<svg
							viewBox="0 0 24 24"
							fill="none"
							xmlns="http://www.w3.org/2000/svg">
							<path
								d="M8 12H16"
								className="stroke-current"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
							<path
								d="M12 16V8"
								className="stroke-current"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
							<path
								d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z"
								className="stroke-current"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
						</svg>
					</StyledNavLink>
				</li>
				{/* Me */}
				<li>
					<StyledNavLink to={`/profile/${user?.id}`}>
						<svg
							viewBox="0 0 24 24"
							fill="none"
							xmlns="http://www.w3.org/2000/svg">
							<path
								d="M12.12 12.78C12.05 12.77 11.96 12.77 11.88 12.78C10.12 12.72 8.71997 11.28 8.71997 9.50998C8.71997 7.69998 10.18 6.22998 12 6.22998C13.81 6.22998 15.28 7.69998 15.28 9.50998C15.27 11.28 13.88 12.72 12.12 12.78Z"
								className="stroke-current"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
							<path
								d="M18.74 19.3801C16.96 21.0101 14.6 22.0001 12 22.0001C9.40001 22.0001 7.04001 21.0101 5.26001 19.3801C5.36001 18.4401 5.96001 17.5201 7.03001 16.8001C9.77001 14.9801 14.25 14.9801 16.97 16.8001C18.04 17.5201 18.64 18.4401 18.74 19.3801Z"
								className="stroke-current"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
							<path
								d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
								className="stroke-current"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
						</svg>
					</StyledNavLink>
				</li>
				{/* Settings */}
				<li>
					<StyledNavLink to="/settings">
						<svg
							viewBox="0 0 24 24"
							fill="none"
							xmlns="http://www.w3.org/2000/svg">
							<path
								d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"
								className="stroke-current"
								strokeWidth="2"
								strokeMiterlimit="10"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
							<path
								d="M2 12.8799V11.1199C2 10.0799 2.85 9.21994 3.9 9.21994C5.71 9.21994 6.45 7.93994 5.54 6.36994C5.02 5.46994 5.33 4.29994 6.24 3.77994L7.97 2.78994C8.76 2.31994 9.78 2.59994 10.25 3.38994L10.36 3.57994C11.26 5.14994 12.74 5.14994 13.65 3.57994L13.76 3.38994C14.23 2.59994 15.25 2.31994 16.04 2.78994L17.77 3.77994C18.68 4.29994 18.99 5.46994 18.47 6.36994C17.56 7.93994 18.3 9.21994 20.11 9.21994C21.15 9.21994 22.01 10.0699 22.01 11.1199V12.8799C22.01 13.9199 21.16 14.7799 20.11 14.7799C18.3 14.7799 17.56 16.0599 18.47 17.6299C18.99 18.5399 18.68 19.6999 17.77 20.2199L16.04 21.2099C15.25 21.6799 14.23 21.3999 13.76 20.6099L13.65 20.4199C12.75 18.8499 11.27 18.8499 10.36 20.4199L10.25 20.6099C9.78 21.3999 8.76 21.6799 7.97 21.2099L6.24 20.2199C5.33 19.6999 5.02 18.5299 5.54 17.6299C6.45 16.0599 5.71 14.7799 3.9 14.7799C2.85 14.7799 2 13.9199 2 12.8799Z"
								className="stroke-current"
								strokeWidth="2"
								strokeMiterlimit="10"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
						</svg>
					</StyledNavLink>
				</li>
			</ul>

			<div className="hidden justify-self-start w-10 md:flex justify-center absolute bottom-8">
				<img
					onClick={signOut}
					src={logout}
					alt=""
					className="cursor-pointer opacity-80 hover:opacity-100 transition duration-200"
				/>
			</div>
		</nav>
	);
};

export default ProtectedNav;
