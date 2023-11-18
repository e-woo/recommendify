import { Track } from '../api/playlist';

const TrackCard = ({track} : {track: Track}) => {
	//terminal.log(track);
	return (
		<div className='grid grid-cols-5 h-auto gap-4 mb-3'>
			<img src={track.image} className='col-span-1 max-h-full w-auto object-contain'/>
			<div className='col-span-4 flex flex-col py-1'>
				<h5 className='text-white text-left'>{track.name}</h5>
				<p className='text-slate-400 text-left'>{track.artists.map((artist: any, index: number) => artist.name + (index == track.artists.length - 1 ? '' : ', '))}</p>
			</div>
			
		</div>
	)
}

export default TrackCard;