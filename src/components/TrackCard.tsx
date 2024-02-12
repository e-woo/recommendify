import { Track } from './TrackSelector';

const ArtistCard = ({ track, onClick } : {track: Track, onClick: Function}) => {
	return (
		<div className='grid grid-cols-5 gap-2 px-2' onClick={() => onClick(track)}>
			<img src={track.image} className='col-span-1 place-self-center'/>
			<div className='col-span-3'>
				<h5 className='text-white'>{track.name.length > 40 ? track.name.substring(0, 40) + "..." : track.name}</h5>
				<p className='text-slate-400 text-sm'>{
					// add commas between artists if there are multiple
					track.artists.map((artist: any, index: number) => artist + (index == track.artists.length - 1 ? '' : ', '))
				}
				</p>
			</div>
			<a href={track.url} target='_blank' className='col-span-1 flex justify-center items-center'>
				<i className='bx bxl-spotify text-2xl'/>
			</a>
		</div>
	)
}

export default ArtistCard;