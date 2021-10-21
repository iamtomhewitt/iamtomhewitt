require('dotenv').config();

const { generateReadMe } = require('./services/readme');
const { getGhostHunterScores, getJetDashVrScores } = require('./services/games');
const { getLastUpdatedRepos, getRepos, getLatestReleases } = require('./services/github');
const { toFriendlyDate } = require('./services/lib');

const DATA = {
  myName: 'Tom',
  date: new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    month: 'long',
    timeZone: 'Europe/London',
    timeZoneName: 'short',
    weekday: 'long',
  }),
  lastRefreshed: toFriendlyDate(new Date())
};

const run = async () => {
  await getRepos();

  const { jetDashVrScores } = await getJetDashVrScores();
  const { lastUpdatedRepos } = getLastUpdatedRepos();
  const { latestReleases } = await getLatestReleases();
  const { vrPacmanScores } = await getGhostHunterScores();

  DATA.jetDashVrScores = jetDashVrScores;
  DATA.lastUpdatedRepos = lastUpdatedRepos;
  DATA.latestReleases = latestReleases;
  DATA.spotify = `https://spotify-github-profile.vercel.app/api/view?uid=${process.env.SPOTIFY_UID}&cover_image=true&theme=natemoo-re`;
  DATA.vrPacmanScores = vrPacmanScores;

  await generateReadMe(DATA);
}

run();