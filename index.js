require('dotenv').config();
const Mustache = require('mustache');
const fs = require('fs');

const { getLastUpdatedRepos, getRepos, getLatestReleases } = require('./services/github');
const { toFriendlyDate } = require('./services/lib');
const MUSTACHE_MAIN_DIR = './main.mustache';

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

async function generateReadMe() {
  fs.readFile(MUSTACHE_MAIN_DIR, (err, data) => {
    if (err) throw err;
    const output = Mustache.render(data.toString(), DATA);
    fs.writeFileSync('README.md', output);
  });
}

const run = async () => {
  await getRepos();

  const { lastUpdatedRepos } = getLastUpdatedRepos();
  const { latestReleases } = await getLatestReleases();

  DATA.lastUpdatedRepos = lastUpdatedRepos;
  DATA.latestReleases = latestReleases;

  await generateReadMe();
}

run();