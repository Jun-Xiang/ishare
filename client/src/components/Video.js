import React, { useEffect, useRef } from "react";

const Video = ({ peer }) => {
	const vidRef = useRef();

	useEffect(() => {
		const handleStream = stream => {
			vidRef.current.srcObject = stream;
		};
		peer.on("stream", handleStream);
		peer.on("error", e => {
			console.log("[Error]:", e);
		});
		console.log(peer);

		return _ => {
			peer.off("stream", handleStream);
		};
	}, [peer]);

	return <video autoPlay playsInline ref={vidRef} />;
};

export default Video;
