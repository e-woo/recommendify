const Profile = ({ profile } : { profile: any }) => {
	return (
	<div>
		<img src={profile.images ? profile.images[0].url : ''}></img>
		<p>{profile.display_name}</p>
	</div>
	)
}

export default Profile;