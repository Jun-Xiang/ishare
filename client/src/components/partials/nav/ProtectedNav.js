import React from "react";
import { NavLink } from "react-router-dom";

const StyledNavLink = ({ children, to }) => {
	const activeClass = "bg-purple-600 text-pink-200";
	const inactiveClass = "text-gray-500 hover:bg-purple-300";
	const chooseClass = isActive => (isActive ? activeClass : inactiveClass);

	return (
		<NavLink
			to={to}
			className={({ isActive }) =>
				`transition duration-200 ease-in-out block rounded-md w-8 h-8 p-1.5 ${chooseClass(
					isActive
				)}`
			}>
			{children}
		</NavLink>
	);
};

const ProtectedNav = () => {
	return (
		<nav className="w-full fixed bottom-0 md:max-w-sm md:mt-2 md:relative bg-purple-50 rounded-md ">
			<ul className="flex items-center justify-between py-4 px-10">
				{/* Home Icon */}
				<li>
					<StyledNavLink to="feed">
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
					<StyledNavLink to="messages">
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
					<StyledNavLink to="messages">
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
				{/* Notifications */}
				<li>
					<StyledNavLink to="settings">
						<svg
							viewBox="0 0 24 24"
							fill="none"
							xmlns="http://www.w3.org/2000/svg">
							<path
								d="M12.02 2.90991C8.70997 2.90991 6.01997 5.59991 6.01997 8.90991V11.7999C6.01997 12.4099 5.75997 13.3399 5.44997 13.8599L4.29997 15.7699C3.58997 16.9499 4.07997 18.2599 5.37997 18.6999C9.68997 20.1399 14.34 20.1399 18.65 18.6999C19.86 18.2999 20.39 16.8699 19.73 15.7699L18.58 13.8599C18.28 13.3399 18.02 12.4099 18.02 11.7999V8.90991C18.02 5.60991 15.32 2.90991 12.02 2.90991Z"
								className="stroke-current"
								strokeWidth="2"
								strokeMiterlimit="10"
								strokeLinecap="round"
							/>
							<path
								d="M13.87 3.19994C13.56 3.10994 13.24 3.03994 12.91 2.99994C11.95 2.87994 11.03 2.94994 10.17 3.19994C10.46 2.45994 11.18 1.93994 12.02 1.93994C12.86 1.93994 13.58 2.45994 13.87 3.19994Z"
								className="stroke-current"
								stroke-width="1.5"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
							<path
								d="M15.02 19.0601C15.02 20.7101 13.67 22.0601 12.02 22.0601C11.2 22.0601 10.44 21.7201 9.90002 21.1801C9.36002 20.6401 9.02002 19.8801 9.02002 19.0601"
								className="stroke-current"
								strokeWidth="2"
								strokeMiterlimit="10"
							/>
						</svg>
					</StyledNavLink>
				</li>
				{/* Settings */}
				<li>
					<StyledNavLink to="settings">
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
		</nav>
	);
};

export default ProtectedNav;
