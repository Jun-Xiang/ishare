const Stats = ({ value, name }) => {
	return (
		<div className="flex flex-col items-center w-20">
			<p className="font-bold text-lg">{value}</p>
			<p className="text-gray-500 text-xs">{name}</p>
		</div>
	);
};
export default Stats;
