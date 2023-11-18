const ProfileCard = ({ profile } : { profile: any }) => {
	return (
	<div className='rounded-lg text-white p-1 overflow-hidden bg-gradient-to-br from-primary-500 to-secondary-500'>
		<link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet'/>
		<div className='bg-[#121212] grid grid-cols-4 p-3'>
			<img src={profile.images ? profile.images[0].url : ''} className='pointer-events-none col-span-1 select-none'></img>
			<div className='col-span-2 flex flex-row place-items-center px-4'>
				<p className='text-xl md:text-2xl select-none'>{profile.display_name}</p>
			</div>
			<div className='col-span-1 flex flex-row place-items-center justify-center'>
				<a href={profile.external_urls.spotify} target='_blank'>
					<i className='bx bxl-spotify text-white text-4xl md:text-5xl'/>
				</a>
			</div>
		</div>
	</div>
	)
}

export default ProfileCard;