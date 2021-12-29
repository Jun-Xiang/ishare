import React from "react";

const Spinner = ({ size, fullscreen }) => {
	const fullscreenStyle =
		"bg-black/80 inset-0 absolute top-0 z-50 flex items-center justify-center";
	return (
		<div className={fullscreen && fullscreenStyle}>
			<svg
				className="animate-spin text-white"
				width={size}
				height={size}
				viewBox="0 0 24 24"
				fill="none"
				xmlns="http://www.w3.org/2000/svg">
				<path
					d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
					stroke="currentColor"
					strokeOpacity="0.25"
					strokeWidth="4"
				/>
				<path
					d="M4 12C4 9.87827 4.84285 7.84344 6.34315 6.34315C7.84344 4.84285 9.87827 4 12 4V0C5.373 0 0 5.373 0 12H4ZM6 17.291C4.70821 15.8316 3.99661 13.949 4 12H0C0 15.042 1.135 17.824 3 19.938L6 17.291Z"
					fill="currentColor"
				/>
			</svg>
		</div>
	);
};

export default Spinner;
