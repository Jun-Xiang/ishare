import React, { useEffect, useState } from "react";

const Preview = ({ file }) => {
	const [url, setUrl] = useState(null);

	useEffect(() => {
		if (!file) return;
		const url = URL.createObjectURL(file);
		setUrl(url);
		return _ => URL.revokeObjectURL(url);
	}, [file]);

	if (!file) return null;

	return (
		<div className="flex">
			<img src={url} alt={file.name} />
		</div>
	);
};

export default Preview;
