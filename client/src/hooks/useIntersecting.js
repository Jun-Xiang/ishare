import { useEffect, useRef, useState } from "react";

const useIntersecting = ({
	root = null,
	rootMargin = "100px",
	threshold = 0,
}) => {
	const observerRef = useRef(null);
	const [entry, setEntry] = useState({});
	const [node, setNode] = useState(null);

	// const cb = useCallback(
	// 	([entry]) => {

	// 		entries.forEach(e => {
	// 			if (e.isIntersecting) {
	// 				setIntersecting(true);
	// 				// try and see if it works
	// 				observer.unobserve(e.target);
	// 				observer.observe(targetRef.current);
	// 			}
	// 		});
	// 	},
	// 	[targetRef]
	// );

	useEffect(() => {
		if (observerRef.current) observerRef.current.disconnect();
		observerRef.current = new window.IntersectionObserver(
			([entry]) => setEntry(entry),
			{
				root,
				rootMargin,
				threshold,
			}
		);

		const observer = observerRef.current;
		if (node) observer.observe(node);

		return () => {
			observer.disconnect();
		};
	}, [root, rootMargin, threshold, node]);
	return { entry, setNode };
};

export default useIntersecting;
