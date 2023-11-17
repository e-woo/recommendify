import { terminal } from 'virtual:terminal';
export async function getGenres(): Promise<Array<string>> {
	const accessToken = localStorage.getItem('access_token');
	const genres: Array<string> = JSON.parse(localStorage.getItem('genres')!);
	if (genres)
		return genres;
	terminal.log('getting genres from server!')
	const result = await fetch('https://api.spotify.com/v1/recommendations/available-genre-seeds', {
        method: 'GET',
		headers: {
			'Authorization': `Bearer ${accessToken}`
		}
	});
	const response = await result.json();
	localStorage.setItem('genres', JSON.stringify(response.genres));
	return response.genres;
}

export async function getSongs(genre: string, trackCount: number, profile: any) {
	const accessToken = localStorage.getItem('access_token');
	const result = await fetch(`https://api.spotify.com/v1/recommendations?limit=${trackCount}&market=${profile.country}&seed_genres=${genre}`, {
        method: 'GET',
		headers: {
			'Authorization': `Bearer ${accessToken}`
		}
	}).then(response => response.json()).then(data => {return data.tracks});
	const uris: string[] = [];
	result.forEach((track: any) => {uris.push(track.uri)});
	terminal.log(uris);

	const playlistId = await makePlaylist(profile);

	await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
		method: 'POST',
		headers: {
		  'Authorization': `Bearer ${accessToken}`,
		  'Content-Type': 'application/json'
		},
		body: JSON.stringify({
		  'uris': uris,
		  'position': 0
		})
	});

}

async function makePlaylist(profile: any) {
    const id = profile.id
    const access_token = localStorage.getItem('access_token');
    terminal.log(id)
    const result = await fetch(`https://api.spotify.com/v1/users/${id}/playlists`,
    {
        method: "POST",
        headers: { 
            'Authorization': `Bearer ${access_token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'name': 'abc',
            'description': 'New playlist description',
            'public': false
        })
    }).then(response => response.json()).then(data => {return data.id});
	return result;
}