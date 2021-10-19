require('dotenv').config();

const { generateReadMe } = require('./services/readme');
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

  const { lastUpdatedRepos } = getLastUpdatedRepos();
  const { latestReleases } = await getLatestReleases();

  DATA.lastUpdatedRepos = lastUpdatedRepos;
  DATA.latestReleases = latestReleases;

  await generateReadMe(DATA);
}

run();