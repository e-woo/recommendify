import { Artist } from './ArtistSelector';

const ArtistCard = ({ artist, onClick } : {artist: Artist, onClick: Function}) => {
	return (
		<div className='grid grid-cols-4 gap-2 px-2' onClick={() => onClick(artist)}>
			{artist.image ? 
				// artist image
				<img src={artist.image} className='col-span-1 place-self-center'/> :

				// generic user icon if there is no image
				<i className='bx bxs-user-circle text-4xl text-slate-300 place-self-center'/>
			}
			<div className='col-span-3'>
				<h5 className='text-white'>{artist.name}</h5>
				<p className='text-slate-400 text-sm'>
					{Intl.NumberFormat('en-US', {
						notation: "compact",
						maximumFractionDigits: 1
					}).format(artist.followers) + ' followers'}
				</p>
			</div>
		</div>
	)
}

export default ArtistCard;