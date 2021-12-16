const fetch = require('node-fetch');
const { toFriendlyDateWithYear } = require('./lib');

const build = (data) => ({
  name: data.name,
  score: data.score,
  date: toFriendlyDateWithYear(data.date) || data.date
});

const getScores = async (url, mostRecent = false) => {
  console.log('Getting scores');
  const scores = await fetch(url).then((r) => r.json());
  const parsedData = [];

  Object.keys(scores).forEach((k) => {
    const { name, score, date } = scores[k];
    parsedData.push({ name, score, date });
  });

  if (mostRecent) {
    parsedData.sort((a, b) => new Date(b.date) - new Date(a.date));
  } else {
    parsedData.sort((a, b) => b.score - a.score);
  }

  console.log('Finished getting scores');

  return {
    scores: [
      build(parsedData[0]),
      build(parsedData[1]),
      build(parsedData[2]),
      build(parsedData[3]),
      build(parsedData[4])
    ]
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

const getMostRecentGhostHunterScores = async () => {
  const { scores } = await getScores(process.env.GHOST_HUNTER_SCORES, true);
  return {
    mostRecentGhostHunterScores: scores
  };
};

const getMostRecentJetDashVrScores = async () => {
  const { scores } = await getScores(process.env.JET_DASH_VR_SCORES, true);
  return {
    mostRecentJetDashVrScores: scores
  };
};

module.exports = {
  getGhostHunterScores,
  getJetDashVrScores,
  getMostRecentJetDashVrScores,
  getMostRecentGhostHunterScores
};
