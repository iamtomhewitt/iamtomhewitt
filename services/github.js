const fetch = require('node-fetch');
const { toFriendlyDate } = require('./lib');

let repos = []
const headers = {
  'Authorization': `token ${process.env.GITHUB_TOKEN}`
}

const getRepos = async () => {
  const json = await fetch('https://api.github.com/users/iamtomhewitt/repos?sort=updated', { headers }).then(r => r.json());
  repos = json;
}

const getLastUpdatedRepos = () => {
  repos.sort((a, b) => b.updated_at - a.updated_at)
  const topThree = repos.slice(0, 3);

  return {
    lastUpdatedRepos: {
      first: {
        name: topThree[0].name,
        lastUpdated: toFriendlyDate(topThree[0].updated_at),
        description: topThree[0].description
      },
      second: {
        name: topThree[1].name,
        lastUpdated: toFriendlyDate(topThree[1].updated_at),
        description: topThree[1].description
      },
      third: {
        name: topThree[2].name,
        lastUpdated: toFriendlyDate(topThree[2].updated_at),
        description: topThree[2].description
      }
    }
  }
}

const getLatestReleases = async () => {
  let releases = []

  repos.sort((a, b) => b.updated_at - a.updated_at)

  for (const repo of repos) {
    const data = await fetch(`https://api.github.com/repos/iamtomhewitt/${repo.name}/releases`, { headers }).then(r => r.json());

    if (data.length > 0) {
      releases.push({
        publishedAt: toFriendlyDate(data[0].published_at),
        repoName: repo.name,
        url: data[0].html_url,
        version: data[0].name
      });
    }
  }

  releases.sort((a, b) => b.publishedAt - a.publishedAt)

  return {
    latestReleases: {
      first: releases[0],
      second: releases[1],
      third: releases[2],
      fourth: releases[3],
      fifth: releases[4],
    }
  }
}

module.exports = {
  getRepos,
  getLastUpdatedRepos,
  getLatestReleases
}