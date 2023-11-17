import { useEffect, useState } from 'react';
import './App.css';
import { fetchProfile, getAccessToken, getRefreshToken, redirectToAuthCodeFlow } from './api/auth';
import { getGenres, getSongs } from './api/playlist';
import ProfileCard from './components/ProfileCard';
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
			else if (loggedIn && localStorage.getItem('refresh_token') !== null) // intended for page refreshes
				getRefreshToken(clientId);
			// fetch an existing access token from session storage
			if (sessionStorage.getItem('access_token') !== null) 
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
				<button 
					onClick={() => getSongs((document.getElementById('category')! as HTMLFormElement).value, trackCount, profile)}
					className=''>Get songs</button>
				<button onClick={() => {document.location = 'http://localhost:3000'; sessionStorage.removeItem('access_token')}}>Logout</button> 
				<ProfileCard profile={profile}/>
			</> : <div  className='fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col gap-4 justify-center place-items-center'>
			{Object.keys(profile).length !== 0 ? 
				<>
					<h1 className='text-5xl md:text-7xl font-bold mb-4'>Playlist Generator</h1>
					<h3 className='text-2xl md:text-4xl font-semibold mb-4'>Welcome back, {(profile as any).display_name}!</h3>
					<ProfileCard profile={profile}/>
					<button
						onClick={() => {
							setLoggedIn(true);
							getRefreshToken(clientId);
						}}
						className='px-1 py-1 max-w-[200px] w-full rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 hover:bg-slate-200 text-white select-none font-semibold'>
							<span className='block bg-[#121212] hover:bg-slate-800 rounded-full px-8 py-2'>Login</span>
					</button> 
					<p className='text-xl mt-32'>Not you?</p>
				</> : <h1 className='text-4xl md:text-6xl font-bold mb-4'>Welcome!</h1>
			}
			<button
				onClick={() => redirectToAuthCodeFlow(clientId)}
				className='px-8 py-3 max-w-[200px] w-full rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 hover:bg-slate-200 text-white select-none font-semibold'>Spotify Login</button>

			</div>
            }
		</div>
    );
};

function capitalize(str: string) {
	return str.charAt(0).toUpperCase() + str.slice(1);
}

export default App;