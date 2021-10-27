const fetch = require('node-fetch');
const { toFriendlyDateWithYear } = require('./lib');

const build = (data) => ({
  name: data.name,
  score: data.score,
  date: toFriendlyDateWithYear(data.date) || data.date
});

const getScores = async (url) => {
  console.log('Getting scores');
  const scores = await fetch(url).then((r) => r.json());
  const parsedData = [];

  Object.keys(scores).forEach((k) => {
    const { name, score, date } = scores[k];
    parsedData.push({ name, score, date });
  });

  parsedData.sort((a, b) => b.score - a.score);

  console.log('Finished getting scores');

  return {
    scores: {
      first: build(parsedData[0]),
      second: build(parsedData[1]),
      third: build(parsedData[2]),
      fourth: build(parsedData[3]),
      fifth: build(parsedData[4])
    }
  };
};

const getGhostHunterScores = async () => {
  const { scores } = await getScores(process.env.GHOST_HUNTER_SCORES);
  return {
    vrPacmanScores: scores
  };
};

const getJetDashVrScores = async () => {
  const { scores } = await getScores(process.env.JET_DASH_VR_SCORES);
  return {
    jetDashVrScores: scores
  };
};

module.exports = {
  getGhostHunterScores,
  getJetDashVrScores
};
