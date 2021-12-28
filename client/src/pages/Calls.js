import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Video from "../components/Video";
import { useVideo } from "../context/VideoContext";
// TODO: check if socket is connected
const Calls = () => {
	const {
		myVidRef,
		peers,
		streams,
		stream,
		call,
		answerCall,
		inCall,
		leaveCall,
	} = useVideo();
	const navigate = useNavigate();
	const { id } = useParams();

	useEffect(() => {
		return _ => {
			window.location.reload();
		};
	}, []);

	useEffect(() => {
		if (!inCall) navigate("/messages/" + id);
	}, [inCall, navigate, id]);

	return (
		<>
			<video playsInline autoPlay ref={myVidRef} />
			{peers.map((p, i) => (
				<Video peer={p} key={i} />
			))}
			{streams.map((s, i) => (
				<video
					key={i}
					playsInline
					autoPlay
					ref={vid => {
						if (vid) {
							vid.srcObject = s;
						}
					}}
				/>
			))}
			{/* <Video  /> */}
		</>
	);
};

export default Calls;
