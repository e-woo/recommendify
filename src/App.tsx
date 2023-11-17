import { useEffect, useState } from 'react';
import './App.css';
import { fetchProfile, getAccessToken, getRefreshToken, redirectToAuthCodeFlow } from './api/auth';
import { getGenres, getSongs } from './api/playlist';
const App = () => {
	const clientId = '';
	const params = new URLSearchParams(window.location.search);
	const code = params.get("code");
	
	const [trackCount, setTrackCount] = useState(50);
	const [profile, setProfile] = useState({});
	const [genres, setGenres] = useState<string[]>([]);
	useEffect(() => {
		async function f() {
			if (code) {
				if (localStorage.getItem('refresh_token') !== 'undefined' && localStorage.getItem('refresh_token'))
					await getRefreshToken(clientId);
				else
					await getAccessToken(clientId, code);
				
			}
		}
		f();
	}, []);

	useEffect(() => {
		async function f() {
			setProfile(await fetchProfile());
			setGenres(await getGenres());
		}
		f();
	}, []);
	
	return (
		<div>
			page
			{code ? <>
					<select id='category'>
						{genres.map((item, index) => <option value={item} key={index}>{capitalize(item)}</option>)}
					</select>
					<input type='range' min={5} max={100} defaultValue={trackCount} id='count' step={5} onChange={e => setTrackCount(e.target.valueAsNumber)}></input>
					<p>{trackCount}</p>
					<button onClick={() => getSongs((document.getElementById('category')! as HTMLFormElement).value, trackCount, profile)}>Get songs</button>
				<button onClick={() => {document.location = 'http://localhost:3000'}}>Logout</button> 
				<p>{getProfileEmail(profile)}</p>
			</> :
			<button onClick={() => redirectToAuthCodeFlow(clientId)}>Login</button>
            }
		</div>
    );
};

function getProfileEmail(profile: any) {
	return profile.email;
}

function capitalize(str: string) {
	return str.charAt(0).toUpperCase() + str.slice(1);
}

export default App;