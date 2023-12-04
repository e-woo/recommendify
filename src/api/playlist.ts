export interface Track {
	uri: string;
	name: string;
	artists: any[];
	image: string;
}

export async function getGenres(): Promise<string[]> {
	const accessToken = sessionStorage.getItem('access_token');
	const genres: string[] = JSON.parse(localStorage.getItem('genres')!);
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

export async function generate(genres: string, artists: string, tracks: string, trackCount: number, profile: any): Promise<any> {
	const accessToken = sessionStorage.getItem('access_token');
	return await fetch(`https://api.spotify.com/v1/recommendations?limit=${trackCount}&market=${profile.country}&seed_genres=${genres}&seed_artists=${artists}&seed_tracks=${tracks}`, {
        method: 'GET',
		headers: {
			'Authorization': `Bearer ${accessToken}`
		}
	}).then(response => response.json()).then(data => {return data});
}

export function filterTracks(data: any): Track[] {
	const tracks: Track[] = [];
	data.forEach((track: any) => {tracks.push({
		uri: track.uri, // string
		name: track.name, // string
		artists: track.artists, // array
		image: track.album.images[0].url // string
	})})
	return tracks;
}


export async function create(profile: any, name: string, tracks: Track[], playlistPublic: boolean): Promise<any> {
	if (name === '')
		name = 'Untitled Playlist';
    const id = profile.id;
    const accessToken = sessionStorage.getItem('access_token');

	// create playlist
    const playlistId = await fetch(`https://api.spotify.com/v1/users/${id}/playlists`, {
        method: 'POST',
        headers: { 
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'name': name,
            'description': 'New playlist description',
            'public': playlistPublic
        })
    }).then(response => response.json()).then(data => {return data.id});

	// populate playlist
	const uris: string[] = [];
	tracks.forEach((track) => uris.push(track.uri))
	return await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
		method: 'POST',
		headers: {
		  'Authorization': `Bearer ${accessToken}`,
		  'Content-Type': 'application/json'
		},
		body: JSON.stringify({
		  'uris': uris,
		  'position': 0
		})
	}).then(response => response.json()).then(data => {return data});
}