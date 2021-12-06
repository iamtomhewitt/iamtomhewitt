require('dotenv').config();

const { generateReadMe } = require('./services/readme');
const { getGhostHunterScores, getJetDashVrScores, getMostRecentJetDashVrScores, getMostRecentGhostHunterScores } = require('./services/games');
const { getLastUpdatedRepos, getRepos, getLatestReleases } = require('./services/github');
const { toFriendlyDate } = require('./services/lib');

const run = async () => {
  await getRepos();

  const { jetDashVrScores } = await getJetDashVrScores();
  const { lastUpdatedRepos } = getLastUpdatedRepos();
  const { latestReleases } = await getLatestReleases();
  const { vrPacmanScores } = await getGhostHunterScores();
  const { mostRecentJetDashVrScores } = await getMostRecentJetDashVrScores();
  const { mostRecentGhostHunterScores } = await getMostRecentGhostHunterScores();

  const data = {
    jetDashVrScores,
    lastRefreshed: toFriendlyDate(new Date()),
    lastUpdatedRepos,
    latestReleases,
    spotify: `https://spotify-github-profile.vercel.app/api/view?uid=${process.env.SPOTIFY_UID}&cover_image=true&theme=natemoo-re`,
    vrPacmanScores,
    mostRecentJetDashVrScores,
    mostRecentGhostHunterScores
  };

  await generateReadMe(data);
};

run();
