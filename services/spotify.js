const fetch = require('node-fetch');

const nowListening = `https://spotify-github-profile.kittinanx.com/api/view?uid=${process.env.SPOTIFY_UID}&cover_image=true&theme=spotify-embed`;
const api = 'https://9smygdfh2g.execute-api.eu-west-1.amazonaws.com/api/top-items';

const getData = async () => {
  const r = await fetch(api);
  const json = await r.json();
  return json.data;
};

const topTracks = async (limit = 10) => {
  const response = await getData();
  return response.tracks
    .slice(0, limit)
    .map((track) => ({
      image: track.album.images[0].url,
      name: track.name
    }));
};

const topArtists = async (limit = 10) => {
  const response = await getData();
  return response.artists
    .slice(0, limit)
    .map((artist) => ({
      image: artist.images[0].url,
      name: artist.name
    }));
};

module.exports = {
  nowListening,
  topArtists,
  topTracks
};
