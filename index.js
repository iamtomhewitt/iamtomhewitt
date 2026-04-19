require('dotenv').config();

const spotify = require('./services/spotify');
const { generateReadMe } = require('./services/readme');
const { getLastUpdatedRepos } = require('./services/github');
const { getReputation } = require('./services/stackoverflow');
const { toFriendlyDate } = require('./services/lib');

(async () => {
  const skills = [
    'https://shields.io/badge/AWS-FF9900?logo=amazonaws&logoColor=fff',
    'https://shields.io/badge/Docker-0db7ed?logo=docker&logoColor=fff',
    'https://shields.io/badge/Git-F1502F?logo=git&logoColor=fff',
    'https://shields.io/badge/GitHub-ffffff?logo=github&logoColor=000',
    'https://shields.io/badge/GitLab-FC6D26?logo=gitlab&logoColor=fff',
    'https://shields.io/badge/Java-ED8B00?logo=coffeescript&logoColor=fff',
    'https://shields.io/badge/JavaScript-F0DB4F?logo=javascript&logoColor=000',
    'https://shields.io/badge/Jest-BD1424?logo=jest&logoColor=fff',
    'https://shields.io/badge/MySQL-00758F?logo=mysql&logoColor=fff',
    'https://shields.io/badge/NodeJS-68A063?logo=node.js&logoColor=fff',
    'https://shields.io/badge/Python-306998?logo=python&logoColor=fff',
    'https://shields.io/badge/React-61DBFB?logo=react&logoColor=000',
    'https://shields.io/badge/Storybook-FF4785?logo=storybook&logoColor=fff',
    'https://shields.io/badge/TypeScript-3074BF?logo=typescript&logoColor=fff'
  ].map((b) => ({ url: b }));

  const socials = [
    { badgeUrl: 'https://shields.io/badge/Instagram-E4405F?logo=instagram&logoColor=fff', url: 'https://www.instagram.com/iamtomhewitt/' },
    { badgeUrl: 'https://shields.io/badge/LinkedIn-0A66C2?logo=linkedin&logoColor=fff', url: 'https://www.linkedin.com/in/thomas-hewitt-ab7724a8/' },
    { badgeUrl: 'https://shields.io/badge/Stack%20Overflow-F58025?logo=stackoverflow&logoColor=fff', url: 'https://stackoverflow.com/users/3002268/tom' },
    { badgeUrl: 'https://shields.io/badge/YouTube-FF0000?logo=youtube&logoColor=fff', url: 'https://www.youtube.com/@iamtomhewitt' }
  ];

  const spotifyTableSize = 10;
  const spotifyTopArtists = await spotify.topArtists(spotifyTableSize);
  const spotifyTopTracks = await spotify.topTracks(spotifyTableSize);
  const spotifyTopItems = Array.from({ length: spotifyTableSize }, (_, i) => ({
    artistName: spotifyTopArtists[i].name,
    artistImage: spotifyTopArtists[i].image,
    trackName: spotifyTopTracks[i].name,
    trackImage: spotifyTopTracks[i].image
  }));

  await generateReadMe({
    lastRefreshed: toFriendlyDate(new Date()),
    lastUpdatedRepos: await getLastUpdatedRepos(),
    reputation: await getReputation(),
    skills,
    socials,
    spotifyNowListening: spotify.nowListening,
    spotifyTopItems
  });
})();
