import { Track } from '../api/playlist';

const PlaylistTrackCard = ({track} : {track: Track}) => {
	return (
		<div className='grid grid-cols-5 h-auto gap-4 mb-3 select-text'>
			<img src={track.image} className='col-span-1 max-h-full w-auto object-contain select-none place-self-center'/>
			<div className='col-span-4 flex flex-col py-1'>
				<h5 className='text-white text-left'>{track.name}</h5>
				<p className='text-slate-400 text-left'>{
					// add commas between artists if there are multiple
					track.artists.map((artist: any, index: number) => artist.name + (index == track.artists.length - 1 ? '' : ', '))
				}</p>
			</div>
			
		</div>
	)
}

export default PlaylistTrackCard;