import React, { useRef, useEffect, useState } from "react";

const Menu = ({
	show,
	children,
	targetRef,
	closeMenu,
	additionalOffset,
	className,
	moveLeft = true,
}) => {
	const [pos, setPos] = useState(
		targetRef?.current?.getBoundingClientRect() || { top: 0, left: 0 }
	);
	const menuRef = useRef();
	const closeMenuFn = useRef(closeMenu);

	useEffect(() => {
		if (show) {
			const { top, left } = targetRef.current.getBoundingClientRect();
			setPos({
				top: additionalOffset?.top
					? Number(additionalOffset.top) + top
					: top,
				left: additionalOffset?.left
					? Number(additionalOffset.left) + left
					: left,
			});
		}
	}, [show, targetRef, additionalOffset]);
	console.log(pos);

	useEffect(() => {
		const handleClickOutside = e => {
			if (
				targetRef.current == null ||
				targetRef.current.contains(e.target)
			)
				return;
			closeMenuFn.current();
		};
		window.addEventListener("click", handleClickOutside);
		return () => {
			window.removeEventListener("click", handleClickOutside);
		};
	}, [targetRef]);
	return (
		<div
			style={{
				transform: `translate(${
					moveLeft ? `calc(-100% + ${pos.left}px)` : pos.left + "px"
				},${pos.top}px)`,
			}}
			ref={menuRef}
			className={`fixed top-0 left-0 p-2 rounded-lg z-50 ${
				!show && "hidden"
			} ${className ?? ""} bg-white transform`}>
			{children(
				"px-3 py-2 flex gap-3 cursor-pointer bg-white rounded-md hover:bg-gray-100 transition duration-100"
			)}
		</div>
	);
};

export default Menu;
