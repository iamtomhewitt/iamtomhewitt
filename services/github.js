const fetch = require('node-fetch');
const { toFriendlyDate } = require('./lib');

let repos = []
const headers = {
  'Authorization': `token ${process.env.GITHUB_TOKEN}`
}

const getRepos = async () => {
  console.log('Getting repos')
  const json = await fetch('https://api.github.com/users/iamtomhewitt/repos?sort=updated', { headers }).then(r => r.json());
  repos = json;
  console.log('Finished getting repos')
}

const getLastUpdatedRepos = () => {
  console.log('Getting last updated repos')
  const slicedRepos = repos.slice(0, 5);

  const build = (data) => ({
    name: data.name,
    lastUpdated: toFriendlyDate(data.updated_at),
    description: data.description
  })

  console.log('Finished getting last updated repos')

  return {
    lastUpdatedRepos: {
      first: build(slicedRepos[0]),
      second: build(slicedRepos[1]),
      third: build(slicedRepos[2]),
      fourth: build(slicedRepos[3]),
      fifth: build(slicedRepos[4]),
    }
  }
}

const getLatestReleases = async () => {
  console.log('Getting latest releases from repos')
  let releases = []

  repos.sort((a, b) => b.updated_at - a.updated_at)

  for (const repo of repos) {
    const data = await fetch(`https://api.github.com/repos/iamtomhewitt/${repo.name}/releases`, { headers }).then(r => r.json());

    console.log('Getting release for repo', repo.name)

    if (data.length > 0) {
      releases.push({
        publishedAt: toFriendlyDate(data[0].published_at),
        repoName: repo.name,
        url: data[0].html_url,
        version: data[0].name
      });
    }

    console.log('Finished getting release for repo', repo.name)
  }

  releases.sort((a, b) => b.publishedAt - a.publishedAt)

  console.log('Finished getting latest releases from repos')

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