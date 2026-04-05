require('dotenv').config();

const { generateReadMe } = require('./services/readme');
const { getLastUpdatedRepos, getRepos } = require('./services/github');
const { toFriendlyDate } = require('./services/lib');
const { getReputation } = require('./services/stackoverflow');

const run = async () => {
  await getRepos();

  const { lastUpdatedRepos } = await getLastUpdatedRepos();
  const { reputation } = await getReputation();

  const data = {
    lastRefreshed: toFriendlyDate(new Date()),
    lastUpdatedRepos,
    spotify: `https://spotify-github-profile.kittinanx.com/api/view?uid=${process.env.SPOTIFY_UID}&cover_image=true&theme=spotify-embed`,
    reputation
  };

  await generateReadMe(data);
};

run();
