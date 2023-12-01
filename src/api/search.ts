export async function searchArtists(query: string) {
	const profile = localStorage.getItem("profile");
	console.log(query);
	if (!profile)
		return
	const country = JSON.parse(profile).country;
	const accessToken = sessionStorage.getItem('access_token');

	return await fetch(`https://api.spotify.com/v1/search?q=artist%3A${query}&type=artist&market=${country}&limit=10`, {
		headers: {
			'Authorization': `Bearer ${accessToken}`
		}
	}).then(result => result.json()).then(data => {return data});
}

export async function searchTracks(query: string) {
	const profile = localStorage.getItem("profile");
	console.log(query);
	if (!profile)
		return
	const country = JSON.parse(profile).country;
	const accessToken = sessionStorage.getItem('access_token');

	return await fetch(`https://api.spotify.com/v1/search?q=track%3A${query}&type=track&market=${country}&limit=10`, {
		headers: {
			'Authorization': `Bearer ${accessToken}`
		}
	}).then(result => result.json()).then(data => {return data});
}