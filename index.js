const fetch = require('node-fetch');
const Mustache = require('mustache');
const fs = require('fs');
const MUSTACHE_MAIN_DIR = './main.mustache';

const DATA = {
  name: 'Tom',
  date: new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    month: 'long',
    timeZone: 'Europe/London',
    timeZoneName: 'short',
    weekday: 'long',
  }),
  lastRefreshed: new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    month: 'short',
    timeZone: 'Europe/London',
    weekday: 'short',
    year: 'numeric'
  })
};

const getTopRepos = async () => {
  const json = await fetch('https://api.github.com/users/iamtomhewitt/repos?sort=updated')
    .then(r => r.json());

  json.sort((a, b) => b.updated_at - a.updated_at)
  const topThree = json.slice(0, 3);

  DATA.firstRepo = {
    name: topThree[0].name,
    lastUpdated: new Date(topThree[0].updated_at).toLocaleDateString('en-GB', {
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      month: 'short',
      weekday: 'short',
    }),
    description: topThree[0].description
  }

  DATA.secondRepo = {
    name: topThree[1].name,
    lastUpdated: topThree[1].updated_at,
    description: topThree[1].description
  }

  DATA.thirdRepo = {
    name: topThree[2].name,
    lastUpdated: topThree[2].updated_at,
    description: topThree[2].description
  }
  console.log(DATA.firstRepo)
}

async function generateReadMe() {
  fs.readFile(MUSTACHE_MAIN_DIR, (err, data) => {
    if (err) throw err;
    const output = Mustache.render(data.toString(), DATA);
    fs.writeFileSync('README.md', output);
  });
}

const run = async () => {
  await getTopRepos();

  await generateReadMe();
}

run();