import React, { useEffect, useRef } from "react";

const Video = ({ peer }) => {
	const vidRef = useRef();

	useEffect(() => {
		peer.on("stream", stream => {
			console.log(stream);
			vidRef.current.srcObject = stream;
		});
		peer.on("error", e => {
			console.log("[Error]:", e);
		});
		console.log(peer);

		return _ => {
			peer.off("stream");
		};
	}, [peer]);

	return <video autoPlay playsInline ref={vidRef} />;
};

export default Video;
