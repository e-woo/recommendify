import { useEffect, useState } from 'react'
import { searchTracks } from '../api/search';
import TrackCard from './TrackCard';

const TrackSelector = ( {index} : {index: number}) => {
	const [showTracks, setShowTracks] = useState(false);
	const [tracks, setTracks] = useState<Array<Track>>([]);
	const [selected, setSelected] = useState(false);
	const [track, setTrack] = useState<Track>( {
		name: '',
		id: '',
		artists: [],
		image: ''
	}); 

	var delay: number;
	function search() {
		clearTimeout(delay);
		delay = setTimeout(async () => {
			const query = (document.getElementById('searchBar' + index) as any).value;
			if (!query)
				return;

			const result = await searchTracks(query);
			console.log(result);

			const resultTracks: Track[] = []
			result.tracks.items.forEach((track: any) => resultTracks.push({
				name: track.name,
				id: track.id,
				artists: track.artists.map((artist: any) => artist.name),
				image: track.album.images[0].url
			}));

			console.log(resultTracks);
            setTracks(resultTracks);
            setShowTracks(true);
		}, 1000);
	}

	useEffect(() => {
		function close() {
		  setShowTracks(false);
		}

		if (showTracks) {
			setTimeout(() => window.addEventListener("click", close), 50);
		}

		return function removeListener() {
		  window.removeEventListener("click", close);
		}
	}, [showTracks]);

	function select(track: Track) {
        setTrack(track);
        setSelected(true);
	}

	return (selected ?
		<div className='bg-[#262626] p-2 text-center text-md rounded-2xl select-none border-none w-full'>
            <TrackCard track={track} onClick={() => {}}/>
            <div id={'track' + index} track-id={track.id} />
		</div> :
		<div className='relative text-left text-sm'>
			<input
				type='text'
				placeholder='Search Track...'
				id = {'searchBar' + index}
				onKeyUp={search}
				className={`bg-[#262626] py-2 px-4 text-md ${showTracks ? 'rounded-t-2xl' : 'rounded-2xl'} select-none border-none focus:ring-primary-500 focus:ring-2 inline-block w-full`}/>
			<ul className={`${showTracks ? '' : 'hidden'} absolute z-[10] block bg-[#202020] rounded-b-lg w-full overflow-y-auto max-h-64`}>
				{tracks.length > 0 ? tracks.map((track, index) =>
				<li className='bg-[#202020] z-[100] text-md select-none hover:bg-[#383838] cursor-pointer py-2 w-full' key={index}>
					<TrackCard track={track} onClick={select}/>
				</li>) : 
                <li className='bg-[#202020] z-[100] text-md select-none py-4 w-full text-center'>
                    <p className='text-slate-300'>No search results!</p>
                </li>}
			</ul>
		</div>
		
	)
}

export interface Track {
	name: string;
	id: string;
	artists: string[];
	image: string;
}

export default TrackSelector;