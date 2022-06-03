const fetch = require('node-fetch');
const { toFriendlyDateWithYearAndNoTime, replaceAll } = require('./lib');

const build = (data) => ({
  name: data.name,
  score: data.score,
  date: toFriendlyDateWithYearAndNoTime(data.date) || data.date
});

const getScores = async (url, mostRecent = false) => {
  console.log('Getting scores', { mostRecent });
  const scores = await fetch(url).then((r) => r.json());
  const parsedData = [];

  Object.keys(scores).forEach((k) => {
    const { name, score, date } = scores[k];

    let s = date;
    s = replaceAll(s, '.', '/');
    s = replaceAll(s, '-', '/');

    const dateString = s.split(' ')[0];
    const numbers = dateString.split('/');
    const firstNumber = Number(numbers[0]) < 10 && numbers[0].length < 2 ? `0${numbers[0]}` : numbers[0];
    const secondNumber = Number(numbers[1]) < 10 && numbers[1].length < 2 ? `0${numbers[1]}` : numbers[1];

    const day = secondNumber > 12 ? secondNumber : firstNumber;
    const month = secondNumber > 12 ? firstNumber : secondNumber;
    const year = numbers[2];
    const newDate = `${month}-${day}-${year}`;

    if (new Date(newDate) > new Date()) {
      console.log(newDate, 'is after today so skipping until I fixed the dates');
    } else {
      parsedData.push({ name, score, date: newDate });
    }
  });

  if (mostRecent) {
    console.log('Before', parsedData);
    parsedData.sort((a, b) => new Date(b.date) - new Date(a.date));
    console.log('After', parsedData);
  } else {
    parsedData.sort((a, b) => b.score - a.score);
  }

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
  console.log('Getting top ghost hunter scores');
  const { scores } = await getScores(process.env.GHOST_HUNTER_SCORES);
  console.log('Scores:', scores);
  return {
    ghostHunterScores: scores
  };
};

const getJetDashVrScores = async () => {
  console.log('Getting top jest dash vr scores');
  const { scores } = await getScores(process.env.JET_DASH_VR_SCORES);
  console.log('Scores:', scores);
  return {
    jetDashVrScores: scores
  };
};

const getMostRecentGhostHunterScores = async () => {
  console.log('Getting most recent ghost hunter scores');
  const { scores } = await getScores(process.env.GHOST_HUNTER_SCORES, true);
  console.log('Scores:', scores);
  return {
    mostRecentGhostHunterScores: scores
  };
};

const getMostRecentJetDashVrScores = async () => {
  console.log('Getting most recent jet dash vr scores');
  const { scores } = await getScores(process.env.JET_DASH_VR_SCORES, true);
  console.log('Scores:', scores);
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
