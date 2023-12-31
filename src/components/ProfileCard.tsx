const ProfileCard = ({ profile } : { profile: any }) => {
	return (
	<> {
		Object.keys(profile).length === 0 && !('error' in profile) ? <></> :
		<div className='rounded-lg text-white p-1 overflow-hidden bg-gradient-to-br from-primary-500 to-secondary-500 w-80'>
			<link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet'/>
			<div className={`bg-[#121212] grid ${profile.images && profile.images[0] ? 'grid-cols-4' : 'grid-cols-3'} p-3 rounded-lg`}>
				{profile.images && profile.images[0] ? <img src={profile.images && profile.images[0] ? profile.images[0].url : ''} className='pointer-events-none col-span-1 select-none'></img> : null}
				<div className='col-span-2 flex flex-row place-items-center px-4'>
					<p className='text-xl md:text-2xl select-none'>
						{profile.display_name}
					</p>
				</div>
				<div className='col-span-1 flex flex-row place-items-center justify-center'>
					<a href={profile.external_urls.spotify} target='_blank'>
						<i className='bx bxl-spotify text-white text-4xl md:text-5xl'/>
					</a>
				</div>
			</div>
		</div>
	} </>
	)
}

export default ProfileCard;