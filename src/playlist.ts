
import { terminal } from 'virtual:terminal';
export async function getCategories(): Promise<Array<string>> {
	const accessToken = localStorage.getItem('access_token');
	const result = await fetch('https://api.spotify.com/v1/recommendations/available-genre-seeds', {
		headers: {
			'Authorization': `Bearer ${accessToken}`
		}
	});
	const response = await result.json();
	return response.genres;
}

export async function getSongs(genre: string) {
	const accessToken = localStorage.getItem('access_token');
	const result = await fetch(`https://api.spotify.com/v1/recommendations?seed_genres=${genre}`, {
		headers: {
		  'Authorization': `Bearer ${accessToken}`
		}
	});
	const response = await result.json();
	terminal.log(response)
}