## IMPORTANT NOTE
Due to the limitations of a Spotify developer app, this web app will only work for whitelisted people for now. If you would like to try this web app, contact me at https://ethanwoo.vercel.app.

# Recommendify

Recommendify is a web application that utilizes Spotify's recommendations API to generate playlists based on user selected seeds, consisting of genres, artists and tracks. Generated playlists can be saved to a user's Spotify account.

## Usage

Authorize recommendify by logging in with your Spotify account. Then, on the main generator page, add up to 5 seeds, consisting of genres, artists or tracks in any combination you like. Then, hit the generate button to generate a playlist using those seeds. You can regenerate the playlist as many times as you like, but do keep in mind that too many generations may result in the web app getting rate limited!

If you generate a playlist that you would like to save, click on the "Add To My Profile" button. Additionally, you can check the "Show on my public profile" checkbox if you would like to add this playlist to your public profile.

## Seeds
Seeds consist of genres, artists, and tracks. Genres are fetched via Spotify's API, while artist and tracks allow you to enter a search query. Recommendify will return search results from Spotify's API using your search query.
