const fetch = require('node-fetch');
const { toFriendlyDate } = require('./lib');

let repos = [];
const headers = {
  Authorization: `token ${process.env.GITHUB_TOKEN}`
};

const getRepos = async () => {
  console.log('Getting repos');
  const json = await fetch('https://api.github.com/users/iamtomhewitt/repos?sort=pushed', { headers }).then((r) => r.json());
  repos = json.filter((r) => r.name !== 'iamtomhewitt' && r.name !== 'sandbox');
  console.log('Finished getting repos');
};

const getLastUpdatedRepos = () => {
  console.log('Getting last updated repos');
  const slicedRepos = repos.slice(0, 5);

  const build = (data) => ({
    name: data.name,
    lastUpdated: toFriendlyDate(data.pushed_at),
    description: data.description,
    url: data.html_url
  });

  slicedRepos.map((r) => build(r));
  console.log('Finished getting last pushed repos');

  return {
    lastUpdatedRepos: [
      build(slicedRepos[0]),
      build(slicedRepos[1]),
      build(slicedRepos[2]),
      build(slicedRepos[3]),
      build(slicedRepos[4])
    ]
  };
};

const getLatestReleases = async () => {
  console.log('Getting latest releases from repos');
  const releases = [];
  repos.sort((a, b) => b.updated_at - a.updated_at);

  for (const repo of repos) {
    const data = await fetch(`https://api.github.com/repos/iamtomhewitt/${repo.name}/releases`, { headers }).then((r) => r.json());

    console.log('Getting release for repo', repo.name);

    if (data.length > 0) {
      releases.push({
        publishedAt: data[0].published_at,
        repoName: repo.name,
        url: data[0].html_url,
        version: data[0].name
      });
    }

    console.log('Finished getting release for repo', repo.name);
  }

  releases.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
  releases.map((r) => r.publishedAt = toFriendlyDate(r.publishedAt));

  console.log('Finished getting latest releases from repos');

  return {
    latestReleases: releases.slice(0, 5)
  };
};

module.exports = {
  getRepos,
  getLastUpdatedRepos,
  getLatestReleases
};
