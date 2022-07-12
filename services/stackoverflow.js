const fetch = require('node-fetch');

const getReputation = async () => {
  console.log('Getting stack overflow rep');
  const url = 'https://api.stackexchange.com/2.2/users/3002268?site=stackoverflow';
  const json = await fetch(url).then((r) => r.json());
  const stackoverflowData = json.items[0];
  const { reputation } = stackoverflowData;
  console.log('Found rep: ', reputation);
  return {
    reputation
  };
};

module.exports = { getReputation };
