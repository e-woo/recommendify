import { useEffect, useState } from 'react'
import { searchArtists } from '../api/search';
import ArtistCard from './ArtistCard';

const ArtistSelector = () => {
	const [showArtists, setShowArtists] = useState(false);
	const [artists, setArtists] = useState<Array<Artist>>([]);

	var delay: number;
	function search() {
		clearTimeout(delay)
		delay = setTimeout(async () => {
			const query = (document.getElementById('searchBar') as any).value;
			if (!query)
				return;
			const result = await searchArtists(query);
			console.log(result);
			const resultArtists: Artist[] = []
			result.artists.items.forEach((artist: any) => resultArtists.push( {
				name: artist.name,
				id: artist.id,
				followers: artist.followers.total,
				image: artist.images[0] ? artist.images[0].url : ''
			}));
			console.log(resultArtists);
			setArtists(resultArtists);
			setShowArtists(true);
		}, 1000);
	}

	useEffect(() => {
		function close() {
		  setShowArtists(false);
		}

		if (showArtists) {
			setTimeout(() => window.addEventListener("click", close), 50);
		}

		return function removeListener() {
		  window.removeEventListener("click", close);
		}
	}, [showArtists]);
	
	return (
		<div className='relative text-left text-sm'>
			<input
				type='text'
				placeholder='Search Artist...'
				id = 'searchBar'
				onKeyUp={search}
				className={`bg-[#262626] py-2 px-4 text-md ${showArtists ? 'rounded-t-2xl' : 'rounded-2xl'} select-none border-none focus:ring-primary-500 focus:ring-2 inline-block w-full`}/>
			<ul className={`${showArtists ? '' : 'hidden'} absolute z-[10] block bg-[#202020] rounded-b-lg w-full overflow-y-auto max-h-64`}>
				{artists.map((artist, index) =>
				<li className='bg-[#202020] z-[100] text-md select-none hover:bg-[#383838] cursor-pointer py-2 w-full' key={index}>
					<ArtistCard artist={artist}/>
				</li>)}
			</ul>
		</div>
	)
}

export interface Artist {
	name: string;
	id: string;
	followers: number;
	image: string;
}

export default ArtistSelector;