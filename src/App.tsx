import { useEffect, useState } from 'react';
import './App.css';
import './scrollbar.css';
import { fetchProfile, getAccessToken, getRefreshToken, redirectToAuthCodeFlow } from './api/auth';
import { create, getGenres, generate, Track, filterTracks } from './api/playlist';
import ProfileCard from './components/ProfileCard';
import TrackCard from './components/TrackCard';
const App = () => {
	const clientId = '';
	const params = new URLSearchParams(window.location.search);
	const code = params.get("code");
	
	const [trackCount, setTrackCount] = useState(50);
	const [profile, setProfile] = useState({});
	const [genres, setGenres] = useState<string[]>([]);
	const [loggedIn, setLoggedIn] = useState(false);
	const [tracks, setTracks] = useState<Array<Track>>([]);

	// message element states
	const [loginErrorMessage, setLoginErrorMessage] = useState(<></>); // tells the user to reauthorize Spotify account
	const [generateMessage, setGenerateMessage] = useState(<></>); // playlist generation result
	const [playlistMessage, setPlaylistMessage] = useState(<></>); // playlist creation result

	async function generatePlaylist() {
		const result = await generate((document.getElementById('category')! as HTMLFormElement).value, trackCount, profile);
		setPlaylistMessage(<></>);
		if ('error' in result) {
			setGenerateMessage(<h4 className='text-[#fa5050] text-lg'>An error occured while generating your playlist. Please refresh the page.</h4>);
			setTracks([]);
		}
		else {
			setGenerateMessage(<h4 className='text-[#50fa50] text-lg'>Playlist successfully generated!</h4>);
			setTracks(filterTracks(result.tracks));
		}
	}

	async function createPlaylist(profile: any, name: string, tracks: Array<any>) {
		const result = await create(profile, name, tracks);
		setPlaylistMessage('error' in result ? 
		<h4 className='text-[#fa5050] text-lg'>An error occured while creating your playlist. Please refresh the page.</h4> :
		<h4 className='text-[#50fa50] text-lg'>Playlist successfully created!</h4>);
	}
	
	useEffect(() => {
		async function authorize() {
			const refreshToken = localStorage.getItem('refresh_token')

			// initial authorization to obtain an Access Token via PKCE Authorization (code in URL)
			if (code) {
				await getAccessToken(clientId, code);
				setLoggedIn(true);
				document.location = 'http://localhost:3000'
			}

			// if refresh token is bad, the user will need to reauthorize, so clear local storage
			else if (refreshToken === 'undefined' || refreshToken === null) {
				setLoggedIn(false);
				setLoginErrorMessage(<h4 className='text-[#fa5050] text-lg'>An error occured with authroization. Please log in to Spotify again.</h4>);
				localStorage.removeItem('profile');
				localStorage.removeItem('refresh_token');
				localStorage.removeItem('verifier');
				sessionStorage.removeItem('access_token')
			}

			// get token using refresh token
			else
				getRefreshToken(clientId);

			// fetch an existing access token from session storage
			if (sessionStorage.getItem('access_token') !== null)
				setLoggedIn(true);
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
			else if (!('error' in JSON.parse(localStorage.getItem('profile')!)))
				setProfile(JSON.parse(localStorage.getItem('profile')!));
		}
		f();
	}, [loggedIn]);

	return (
		<>
			<link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet'/>
			{loggedIn ? // Logged In
			<>
				<div className={`font-poppins fixed top-[50%] left-1/2 -translate-x-1/2 -translate-y-1/4 md:-translate-y-1/2 select-none \
				grid ${tracks.length === 0 ? '' : 'md:grid-cols-2'} gap-64 lg:gap-32 xl:gap-16`}>
					<div className='flex flex-col gap-4 justify-center place-items-center'>
						<h2 className='font-semibold text-2xl'>Generator</h2>
						<div className='rounded-lg text-white p-1 overflow-hidden bg-gradient-to-br from-primary-500 to-secondary-500'>
							<div className='bg-[#121212] flex flex-col p-4 gap-4'>
								<div>
									<h4 className='font-medium mb-2'>Genre</h4>
									<select id='category' className='bg-[#262626] p-2 text-center text-md rounded-2xl select-none'>
										{genres.map((item, index) => <option value={item} key={index}>{capitalize(item)}</option>)}
									</select>
								</div>
								<div>
									<h4 className='font-medium mb-2'>Track Count</h4>
									<div className='grid grid-cols-4 bg-[#262626] p-2 rounded-2xl'>
										<input type='range' min={5} max={100} defaultValue={trackCount} id='count' step={5} onChange={e => setTrackCount(e.target.valueAsNumber)}
										className='col-span-3 accent-secondary-500'/>
										<p className='text-md text-center'>{trackCount}</p>
									</div>
								</div>
								<button 
									onClick={() => generatePlaylist()}
									className='px-4 py-3 max-w-[200px] w-full rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white select-none font-medium'>
										Generate
								</button>
							</div>
						</div>
						{generateMessage}
						<div className='font-poppins md:translate-y-1/4 flex flex-col gap-4 justify-center place-items-center'>
							<h2>Logged in as {(profile as any).display_name}</h2>
							<ProfileCard profile={profile}/>
							<button
								onClick={() => {
										setLoggedIn(false);
										sessionStorage.removeItem('access_token');
									}}
								className='px-1 py-1 max-w-[200px] w-full rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 hover:bg-slate-200 text-white select-none font-medium'>
								<span className='block bg-[#121212] hover:bg-slate-800 rounded-full px-8 py-2'>Logout</span>
							</button>
						</div>
					</div>
					<div className={`tracks invisible ${tracks.length === 0 ? 'hidden' : 'md:visible'} flex flex-col gap-4 justify-center place-items-center`}>
						<h2 className='font-semibold text-2xl'>Tracks</h2>
						<div className='rounded-lg text-white p-1 overflow-hidden bg-gradient-to-br from-primary-500 to-secondary-500'>
							<div className='bg-[#121212] flex flex-col p-4 gap-4'>
								<div className='overflow-auto overflow-y-scroll h-96'>
									<ul className='gap-2 w-72 xl:w-96'>
										{tracks.map((track, index) => <li key={index}><TrackCard track={track}/></li>)}
									</ul>
								</div>
								<input type='text' className={`${tracks.length === 1 ? 'invisible' : 'visible'} bg-[#262626] py-2 px-4 rounded-xl`} placeholder='Playlist Name...' id='playlistName'/>
								<button
									onClick={() => createPlaylist(profile, (document.getElementById('playlistName')! as HTMLInputElement).value, tracks)}
									className='px-4 py-3 max-w-[200px] w-full rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white select-none font-medium place-self-center'>
										Add To My Profile
								</button>
							</div>
						</div>
						{playlistMessage}
					</div>
				</div>
			</> : // Logged out
			<div className='font-poppins fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col gap-4 justify-center place-items-center'>
				<h1 className='text-5xl md:text-7xl font-bold mb-4'>Playlist Generator</h1>
				{Object.keys(profile).length !== 0 ? 
					<>
						<h3 className='text-2xl md:text-4xl font-medium mb-4'>Welcome back, {(profile as any).display_name}!</h3>
						<ProfileCard profile={profile}/>
						<button
							onClick={() => {
								setLoggedIn(true);
								getRefreshToken(clientId);
							}}
							className='px-1 py-1 max-w-[200px] w-full rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 hover:bg-slate-200 text-white select-none font-medium'>
								<span className='block bg-[#121212] hover:bg-slate-800 rounded-full px-8 py-2'>Login</span>
						</button> 
						<p className='text-xl mt-32'>Not you?</p>
					</> : <h1 className='text-2xl md:text-4xl font-bold mb-4'>Welcome!</h1>
				}
				{loginErrorMessage}
				<button
					onClick={() => redirectToAuthCodeFlow(clientId)}
					className='px-4 py-3 max-w-[200px] w-full rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white select-none font-medium'>
						<div className='grid grid-cols-4'>
							<p className='col-span-3 text-right'>Spotify Login</p>
							<i className='bx bxl-spotify text-white text-2xl col-span-1 align-middle text-right'/>
						</div>
				</button>

			</div>
            }
		</>
    );
};

function capitalize(str: string) {
	return str.charAt(0).toUpperCase() + str.slice(1);
}

export default App;