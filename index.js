require('dotenv').config();

const spotify = require('./services/spotify');
const { generateReadMe } = require('./services/readme');
const { getLastUpdatedRepos } = require('./services/github');
const { getReputation } = require('./services/stackoverflow');
const { toFriendlyDate } = require('./services/lib');

(async () => {
  const skills = [
    'https://img.shields.io/badge/AWS-FF9900?logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9IiNmZmZmZmYiPjxwYXRoIGZpbGw9IiNmZmZmZmYiIGQ9Ik03LjY0MSAxMC4zNTdjMCAuNzEuMzU0IDEuMDMxLjM1NCAxLjIyNWMwIC4wOTYtLjAzMi4xMjgtLjEyOC4xOTNsLS40Mi4yNThjLS4wMzIuMDMyLS4xMjguMDMyLS4xOTMuMDMyYzAgMC0uMjU3LjAzMi0uNjQ0LS44MDZjLS40NTEuNTgtMS4xOTIuOTY3LTEuOTMzLjkwMmMtLjQ4My4wMzMtMS44NjktLjI1Ny0xLjgwNC0xLjc3MWMtLjAzMi0xLjE5MyAxLjAzLTEuOTM0IDIuMjIzLTEuODdjLjIyNSAwIC42NzYgMCAxLjQ1LjE5NHYtLjQ4M2MuMDk2LS44MDYtLjQ1MS0xLjQ1LTEuNDE4LTEuMzUzYy0uMDMyIDAtLjU4IDAtMS40NS4zMjJjLS4yMjUuMTI5LS4yMjUuMTI5LS4zMjIuMTI5Yy0uMjI1IDAtLjEyOS0uNjQ1LS4wOTctLjc3M2MuMTMtLjE5NCAxLjEyOC0uNTQ4IDIuMDMtLjU0OGMuNjQ0LS4wMzIgMS4yNTcuMTI5IDEuNzcyLjU0OGMuNDE5LjQ1LjU4IDEuMDMuNTQ4IDEuNjQzem0tMi43MzggMWMuOTk4IDAgMS40NS0uNjQ1IDEuNTQ2LS45NjdjLjAzMi0uMzIzLjAzMi0uNDg0LjAzMi0uODdjLS4zMjItLjAzMy0uNzczLS4xMy0xLjI1Ni0uMTNjLS40NTEtLjAzMS0xLjM1My4xOTQtMS4zMjEgMWMuMDY0LjU4LjQxOS45OTguOTk5Ljk2Nm01LjM0OC43MDhjLS4yNTguMDMyLS4zNTUtLjEyOS0uNDItLjMyMkw4LjI4NiA2LjYyYy0uMDMyLS4wOTctLjAzMi0uMTkzLS4wMzItLjI1OGMwLS4wOTYuMDMyLS4xMjkuMTI5LS4xMjloLjY3N2MuMjU3LS4wMzIuMzU0LjE5NC40MTguMzIzbDEuMTI4IDQuMzgxbDEuMDYzLTQuMzgxYy4wMzMtLjA5Ny4wOTctLjM1NS40Mi0uMzIzaC41NDdjLjAzMiAwIC4zNTQgMCAuNDE5LjMyM2wxLjAzIDQuNDQ2bDEuMTI4LTQuNDQ2YzAtLjAzMy4wOTctLjM1NS40MTktLjMyM2guNjQ0Yy4wMzMgMCAuMTk0LS4wMzIuMTMuMjU4YzAgLjAzMi4wOTYtLjM1NC0xLjY0NCA1LjI4NGMtLjAzMi4xOTMtLjEyOS4zNTQtLjQxOS4zMjJoLS41OGMtLjM1NC4wMzItLjQxOC0uMzIyLS40MTgtLjM1NEwxMi4yMTYgNy40OWwtMS4wMzEgNC4yNTNjMCAuMDMyLS4wMzIuMzU0LS40MTkuMzU0aC0uNDgzdi0uMDMyem04LjUwNS4xOTNjLS4xOTMgMC0xLjAzIDAtMS43NzItLjM1NGMtLjEyOS0uMDMzLS4yNTgtLjIyNi0uMjU4LS4zNTV2LS4zNTRjMC0uMjU4LjE5NC0uMjI2LjI1OC0uMTkzYy4zMjIuMTI4LjQ4My4yMjUuOTAyLjMyMmMxLjEyOC4yNTggMS42NDMtLjAzMiAxLjc3Mi0uMTI5Yy40Mi0uMjU4LjQ1MS0uODA2LjEzLTEuMDk1Yy0uMzIzLS4yNTgtLjQ1Mi0uMjU4LTEuNjQ0LS42NDVjLS4wOTctLjA2NC0xLjMyLS40NS0xLjMyLTEuNjQzYy0uMDMzLS44Ny43NzItMS43NzIgMi4xNTgtMS43NzJjLjQxOSAwIDEuNDUuMTI5IDEuNzcyLjQ4M2MuMDMyLjAzMy4wMzIuMTMuMDMyLjIyNnYuMzIyYzAgLjEyOS0uMDMyLjIyNi0uMTI5LjIyNmMtLjI1OC0uMDMzLS42NDQtLjM1NS0xLjU0Ni0uMzU1Yy0uMjI2IDAtMS4yNTcuMDMyLTEuMTkyLjc3M2MwIC41OC44Ny44MDYuOTY2Ljg3YzEuMTI4LjM1NSAxLjU0Ni40MiAxLjkzMy45NjdjLjU0OC42NzYuMjU4IDEuNDgyLjEyOSAxLjcwN2MtLjYxMiAxLjEyOC0yLjEyNiAxLTIuMTkgMW0xLjI4OSAzLjI4NmMtMi4xNTkgMS41OC01LjM0OCAyLjQ0OS04LjAyMiAyLjQ0OUExNC40MyAxNC40MyAwIDAgMSAyLjEgMTQuMjU2Yy0uMjI2LS4xOTQtLjAzMy0uNDUxLjIyNS0uMjU4YTIwLjIgMjAuMiAwIDAgMCA5Ljg1OSAyLjU3N2MyLjU3NyAwIDUuMTIyLS41NDcgNy41MDctMS41NDZjLjM4Ni0uMTYxLjcwOC4yMjUuMzU0LjUxNW0uOTAyLTEuMDNjLS4yNTgtLjM1NS0xLjg2OS0uMTMtMi41NDUtLjA5N2MtLjIyNi4wMzItLjI1OC0uMTMtLjAzMi0uMjU4YzEuMjU2LS44NyAzLjMxOC0uNjQ0IDMuNTQzLS4zNTRjLjI1OC4yNTctLjAzMiAyLjM1Mi0xLjI1NiAzLjM1Yy0uMTkzLjEzLS4zNTQuMDMyLS4yNTgtLjEyOWMuMjI2LS43MDguODA2LTIuMTU4LjU0OC0yLjUxMyIvPjwvc3ZnPg==',
    'https://shields.io/badge/Docker-2560ff?logo=docker&logoColor=fff',
    'https://shields.io/badge/Git-F1502F?logo=git&logoColor=fff',
    'https://shields.io/badge/GitHub-ffffff?logo=github&logoColor=000',
    'https://shields.io/badge/GitLab-FC6D26?logo=gitlab&logoColor=fff',
    'https://shields.io/badge/Java-ED8B00?logo=coffeescript&logoColor=fff',
    'https://shields.io/badge/JavaScript-F0DB4F?logo=javascript&logoColor=000',
    'https://shields.io/badge/Jest-BD1424?logo=jest&logoColor=fff',
    'https://shields.io/badge/MySQL-00758F?logo=mysql&logoColor=fff',
    'https://shields.io/badge/NodeJS-68A063?logo=node.js&logoColor=fff',
    'https://shields.io/badge/Python-3670A0?logo=python&logoColor=ffdd54',
    'https://shields.io/badge/React-212121?logo=react&logoColor=61DBFB',
    'https://shields.io/badge/Storybook-FF4785?logo=storybook&logoColor=fff',
    'https://shields.io/badge/TypeScript-3074BF?logo=typescript&logoColor=fff'
  ].map((b) => ({ url: b }));

  const socials = [
    { badgeUrl: 'https://shields.io/badge/Instagram-E4405F?logo=instagram&logoColor=fff', url: 'https://www.instagram.com/iamtomhewitt/' },
    { badgeUrl: 'https://img.shields.io/badge/LinkedIn-0077b5?logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nMjU2JyBoZWlnaHQ9JzI1NicgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJyBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSd4TWlkWU1pZCcgdmlld0JveD0nMCAwIDI1NiAyNTYnPjxwYXRoIGQ9J00yMTguMTIzIDIxOC4xMjdoLTM3LjkzMXYtNTkuNDAzYzAtMTQuMTY1LS4yNTMtMzIuNC0xOS43MjgtMzIuNC0xOS43NTYgMC0yMi43NzkgMTUuNDM0LTIyLjc3OSAzMS4zNjl2NjAuNDNoLTM3LjkzVjk1Ljk2N2gzNi40MTN2MTYuNjk0aC41MWEzOS45MDcgMzkuOTA3IDAgMCAxIDM1LjkyOC0xOS43MzNjMzguNDQ1IDAgNDUuNTMzIDI1LjI4OCA0NS41MzMgNTguMTg2bC0uMDE2IDY3LjAxM1pNNTYuOTU1IDc5LjI3Yy0xMi4xNTcuMDAyLTIyLjAxNC05Ljg1Mi0yMi4wMTYtMjIuMDA5LS4wMDItMTIuMTU3IDkuODUxLTIyLjAxNCAyMi4wMDgtMjIuMDE2IDEyLjE1Ny0uMDAzIDIyLjAxNCA5Ljg1MSAyMi4wMTYgMjIuMDA4QTIyLjAxMyAyMi4wMTMgMCAwIDEgNTYuOTU1IDc5LjI3bTE4Ljk2NiAxMzguODU4SDM3Ljk1Vjk1Ljk2N2gzNy45N3YxMjIuMTZaTTIzNy4wMzMuMDE4SDE4Ljg5QzguNTgtLjA5OC4xMjUgOC4xNjEtLjAwMSAxOC40NzF2MjE5LjA1M2MuMTIyIDEwLjMxNSA4LjU3NiAxOC41ODIgMTguODkgMTguNDc0aDIxOC4xNDRjMTAuMzM2LjEyOCAxOC44MjMtOC4xMzkgMTguOTY2LTE4LjQ3NFYxOC40NTRjLS4xNDctMTAuMzMtOC42MzUtMTguNTg4LTE4Ljk2Ni0xOC40NTMnIGZpbGw9JyNmZmYnLz48L3N2Zz4K', url: 'https://www.linkedin.com/in/thomas-hewitt-ab7724a8/' },
    { badgeUrl: `https://shields.io/badge/Stack%20Overflow-${await getReputation()}-F58025?logo=stackoverflow&logoColor=fff`, url: 'https://stackoverflow.com/users/3002268/tom' },
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
    skills,
    socials,
    spotifyNowListening: spotify.nowListening,
    spotifyTopItems
  });
})();
