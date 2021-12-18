import React, { useEffect, useState, useRef, createContext } from "react";



const VideoCall = () => {
	const [stream, setStream] = useState(null);

	const myVideoRef = useRef();
	const receiverVideoRef = useRef();
	const connectionRef = useRef();

	useEffect(() => {
		navigator.mediaDevices
			.getUserMedia({
				video: true,
				audio: true,
			})
			.then(curStream => {
				setStream(curStream);
  
        myVideoRef.current.srcObject = curStream
			});
	}, []);


	return <div></div>;
};

export default VideoCall;
