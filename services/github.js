const fetch = require('node-fetch');
const { toFriendlyDateWithYear } = require('./lib');

const headers = {
  Authorization: `token ${process.env.GITHUB_TOKEN}`
};

const getRepos = async () => {
  console.log('Getting repos');
  const json = await fetch('https://api.github.com/users/iamtomhewitt/repos?sort=pushed', { headers })
    .then((r) => r.json());
  return json.filter((r) => r.name !== 'iamtomhewitt' && r.name !== 'sandbox');
};

const getLastUpdatedRepos = async () => {
  console.log('Getting last updated repos');

  const repos = await getRepos();

  const lastUpdatedRepos = await Promise.all(
    repos.slice(0, 5).map(async (repo) => {
      const tags = await fetch(`https://api.github.com/repos/iamtomhewitt/${repo.name}/tags`, { headers })
        .then((r) => r.json());

      const latestTag = tags.length > 0 ? tags[0].name : '-';

      return {
        name: repo.name,
        lastUpdated: toFriendlyDateWithYear(repo.pushed_at),
        description: repo.description,
        tag: latestTag,
        url: repo.html_url
      };
    })
  );

  console.log('Finished getting last pushed repos');

  return lastUpdatedRepos;
};

module.exports = {
  getRepos,
  getLastUpdatedRepos
};
