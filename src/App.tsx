import { useEffect, useState } from 'react';
import './App.css';
import { fetchProfile, getAccessToken, getRefreshToken, redirectToAuthCodeFlow } from './api/auth';
import { getGenres, getSongs } from './api/playlist';
import Profile from './components/profile';
const App = () => {
	const clientId = '';
	const params = new URLSearchParams(window.location.search);
	const code = params.get("code");
	
	const [trackCount, setTrackCount] = useState(50);
	const [profile, setProfile] = useState({});
	const [genres, setGenres] = useState<string[]>([]);
	const [loggedIn, setLoggedIn] = useState(false);

	
	useEffect(() => {
		async function authorize() {
			// initial authorization to obtain an Access Token via PKCE Authorization
			if (code) {
				await getAccessToken(clientId, code);
				setLoggedIn(true);
				document.location = 'http://localhost:3000'
			}
			// fetch an existing access token from session storage
			if (sessionStorage.getItem('access_token')) 
				setLoggedIn(true)
			}
		authorize();
	}, []);

	useEffect(() => {
		async function f() {
			// fetch profile and genres when logged in
			if (loggedIn) {
				setProfile(await fetchProfile());
				setGenres(await getGenres());
			}
			// load profile from local storage
			else if (localStorage.getItem('profile') !== null)
				setProfile(JSON.parse(localStorage.getItem('profile')!));
		}
		f();
	}, [loggedIn]);

	return (
		<div>
			{loggedIn ? <>
				<h1>Welcome, {(profile as any).display_name}!</h1>
				<select id='category'>
					{genres.map((item, index) => <option value={item} key={index}>{capitalize(item)}</option>)}
				</select>
				<input type='range' min={5} max={100} defaultValue={trackCount} id='count' step={5} onChange={e => setTrackCount(e.target.valueAsNumber)}></input>
				<p>{trackCount}</p>
				<button onClick={() => getSongs((document.getElementById('category')! as HTMLFormElement).value, trackCount, profile)}>Get songs</button>
				<button onClick={() => {document.location = 'http://localhost:3000'; sessionStorage.removeItem('access_token')}}>Logout</button> 
				<Profile profile={profile}/>
			</> : <>
			{Object.keys(profile).length !== 0 ? 
				<>
					<p>Welcome back, {(profile as any).display_name}!</p>
					<button onClick={() => {
						setLoggedIn(true);
						getRefreshToken(clientId);
					}}>Login</button> 
					<p>Not you?</p>
				</> : <></>
			}
			<button onClick={() => redirectToAuthCodeFlow(clientId)}>Spotify Login</button>

			</>
            }
		</div>
    );
};

function capitalize(str: string) {
	return str.charAt(0).toUpperCase() + str.slice(1);
}

export default App;