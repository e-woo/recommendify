import { useEffect, useState } from 'react';
import { terminal } from 'virtual:terminal';
import './App.css';
import { fetchProfile, getAccessToken, getRefreshToken, makePlaylist, redirectToAuthCodeFlow } from './auth';
const App = () => {
	const clientId = 'ENTER CLIENT ID';
	const params = new URLSearchParams(window.location.search);
	const code = params.get("code");
	
	const [profile, setProfile] = useState({});
	
	useEffect(() => {
		async function f() {
			if (code) {
				terminal.log('Refresh token: ' + localStorage.getItem('refresh_token'))
				if (localStorage.getItem('refresh_token') !== 'undefined' && localStorage.getItem('refresh_token'))
					await getRefreshToken(clientId);
				else
					await getAccessToken(clientId, code);
				
			}
			terminal.log('called once!')
		}
		f();
	}, []);

	useEffect(() => {
		async function f() {
			setProfile(await fetchProfile());
		}
		f();
	}, []);
	
	return (
		<div>
			page
			{code ? <>
				<button onClick={() => {
				terminal.log(makePlaylist(profile))}}>Create playlist</button>
				<button onClick={() => {document.location = 'http://localhost:3000'}}>Logout</button> 
				<p>{getProfileName(profile)}</p>
			</> :
			<button onClick={() => redirectToAuthCodeFlow(clientId)}>Login</button>
            }
		</div>
    );
};

export default App;
function getProfileName(profile: any) {
	return profile.email;
}