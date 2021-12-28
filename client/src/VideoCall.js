import React, { useEffect, useState, useRef, createContext } from "react";

const VideoCall = () => {
	const [stream, setStream] = useState(null);

	const myVideoRef = useRef();
	const receiverVideoRef = useRef();
	const connectionRef = useRef();

	useEffect(() => {}, []);

	return <div></div>;
};

export default VideoCall;
