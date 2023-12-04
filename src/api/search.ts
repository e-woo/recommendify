export function searchArtists(query: string) {
	return search(query, 'artist');
}

export function searchTracks(query: string) {
	return search(query, 'track');
}

async function search(query: string, type: string) {
	const profile = localStorage.getItem('profile');
	if (!profile)
		return
	const country = JSON.parse(profile).country;
	const accessToken = sessionStorage.getItem('access_token');

	return await fetch(`https://api.spotify.com/v1/search?q=${type}%3A${query}&type=${type}&market=${country}&limit=10`, {
		headers: {
			'Authorization': `Bearer ${accessToken}`
		}
	}).then(result => result.json()).then(data => {return data});
}