import {
	Grid, // our UI Component to display the results
	SearchBar, // the search bar the user will type into
	SearchContext, // the context that wraps and connects our components
	SearchContextManager, // the context manager, includes the Context.Provider
	SuggestionBar, // an optional UI component that displays trending searches and channel / username results
} from "@giphy/react-components";
import { useContext, forwardRef } from "react";

const SearchExperience = forwardRef(({ handleGifClick, closeGif }, ref) => (
	<SearchContextManager apiKey="c8DZT3btr5c8yAT6uCCJZIHEPpXqKvmI">
		<Giphy handleGifClick={handleGifClick} closeGif={closeGif} ref={ref} />
	</SearchContextManager>
));

export default SearchExperience;

const Giphy = forwardRef(({ handleGifClick, closeGif }, ref) => {
	const { fetchGifs, searchKey } = useContext(SearchContext);

	return (
		<div
			ref={ref}
			className="absolute transform right-10 -translate-y-full p-4 bg-white rounded-lg w-[450px] max-h-96 overflow-auto">
			<SearchBar />
			<SuggestionBar />
			{/** 
            key will recreate the component, 
            this is important for when you change fetchGifs 
            e.g. changing from search term dogs to cats or type gifs to stickers
            you want to restart the gifs from the beginning and changing a component's key does that 
        **/}
			<Grid
				onGifClick={(gif, e) => {
					e.preventDefault();
					handleGifClick(gif);
					closeGif();
				}}
				key={searchKey}
				columns={2}
				width={400}
				height={300}
				fetchGifs={fetchGifs}
			/>
		</div>
	);
});
