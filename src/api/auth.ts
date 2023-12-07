export async function redirectToAuthCodeFlow(clientId: string) {
    const verifier = generateCodeVerifier(128);
    const challenge = await generateCodeChallenge(verifier);

    localStorage.setItem('verifier', verifier);
    const params = new URLSearchParams();
    params.append('client_id', clientId);
    params.append('response_type', 'code');
    params.append('redirect_uri', 'https://recommendify.netlify.app');
    params.append('scope', 'user-read-private user-read-email playlist-modify-public playlist-modify-private');
    params.append('code_challenge_method', 'S256');
    params.append('code_challenge', challenge);

    document.location = `https://accounts.spotify.com/authorize?${params.toString()}`;
}

export function generateCodeVerifier(length: number) {
    let text = '';
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

export async function generateCodeChallenge(codeVerifier: string) {
    const data = new TextEncoder().encode(codeVerifier);
    const digest = await window.crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
}

export async function getAccessToken(clientId: string, code: string) {
    const verifier = localStorage.getItem('verifier');
    
    const params = new URLSearchParams();
    params.append('client_id', clientId);
    params.append('grant_type', 'authorization_code');
    params.append('code', code);
    params.append('redirect_uri', 'https://recommendify.netlify.app');
    params.append('code_verifier', verifier!);

    const result = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params
    });
    const response = await result.json();
    sessionStorage.setItem('access_token', response.access_token);
    localStorage.setItem('refresh_token', response.refresh_token);
}

export async function getRefreshToken(clientId: string) {

    // refresh token that has been previously stored
    const refreshToken = localStorage.getItem('refresh_token');
    const params = new URLSearchParams();
    params.append('grant_type', 'refresh_token');
    params.append('refresh_token', refreshToken!);
    params.append('client_id', clientId);

    const result = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params,
    });
    const response = await result.json();

    sessionStorage.setItem('access_token', response.access_token);
    localStorage.setItem('refresh_token', response.refresh_token);
   }


export async function fetchProfile(): Promise<Object> {
    if (localStorage.getItem('profile') !== null) {
        const localProfile = JSON.parse(localStorage.getItem('profile')!);
        if (!('error' in localProfile)) {
            return localProfile;
        }
    }
    const accessToken = sessionStorage.getItem('access_token');
    const result = await fetch('https://api.spotify.com/v1/me', {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${accessToken}` }
    }
    ).then(response => response.json()).then(data => {return data});
    localStorage.setItem('profile', JSON.stringify(result));
    return result;
}