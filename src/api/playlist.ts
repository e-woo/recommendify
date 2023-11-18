export interface Track {
	uri: string;
	name: string;
	artists: Array<any>;
	image: string;
}

export async function getGenres(): Promise<Array<string>> {
	const accessToken = sessionStorage.getItem('access_token');
	const genres: Array<string> = JSON.parse(localStorage.getItem('genres')!);
	if (genres)
		return genres;
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

export async function generate(genre: string, trackCount: number, profile: any): Promise<Track[]> {
	const accessToken = sessionStorage.getItem('access_token');
	const result = await fetch(`https://api.spotify.com/v1/recommendations?limit=${trackCount}&market=${profile.country}&seed_genres=${genre}`, {
        method: 'GET',
		headers: {
			'Authorization': `Bearer ${accessToken}`
		}
	}).then(response => response.json()).then(data => {return data.tracks});
	// const uris: string[] = [];
	// result.forEach((track: any) => {uris.push(track.uri)});

	const tracks: Track[] = [];
	result.forEach((track: any) => {tracks.push({
		uri: track.uri, // string
		name: track.name, // string
		artists: track.artists, // array
		image: track.album.images[0].url
	})})
	console.log(tracks);
	return tracks;

	// const playlistId = await createPlaylist(profile, tracks);

	// await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
	// 	method: 'POST',
	// 	headers: {
	// 	  'Authorization': `Bearer ${accessToken}`,
	// 	  'Content-Type': 'application/json'
	// 	},
	// 	body: JSON.stringify({
	// 	  'uris': uris,
	// 	  'position': 0
	// 	})
	// });

}

export async function createPlaylist(profile: any, tracks: Array<any>) {
    const id = profile.id
    const accessToken = sessionStorage.getItem('access_token');
    const playlistId = await fetch(`https://api.spotify.com/v1/users/${id}/playlists`,
    {
        method: "POST",
        headers: { 
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'name': 'abc',
            'description': 'New playlist description',
            'public': false
        })
    }).then(response => response.json()).then(data => {return data.id});
	const uris: string[] = [];
	tracks.forEach((track) => uris.push(track.uri))
	//return result;
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