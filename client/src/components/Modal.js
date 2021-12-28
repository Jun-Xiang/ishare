import React from "react";

const Modal = ({ show, children, closeModal }) => {
	return (
		<div className={`${!show && "hidden"} inset-0 z-40 absolute`}>
			{children}
			<div
				onClick={closeModal}
				className={`bg-black/80 inset-0 absolute top-0 -z-10 flex items-center justify-center`}></div>
		</div>
	);
};

export default Modal;
