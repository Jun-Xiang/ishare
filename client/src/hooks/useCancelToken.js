import { useRef, useEffect, useCallback } from "react";
import { CancelToken, isCancel } from "axios";

const useCancelToken = () => {
	const axiosSource = useRef(null);
	const newCancelToken = useCallback(() => {
		axiosSource.current = CancelToken.source();
		return axiosSource.current.token;
	}, []);

	useEffect(() => () => {
		console.log("???");
		axiosSource.current?.cancel();
	});

	return { newCancelToken, isCancel };
};

export default useCancelToken;
