const toFriendlyDate = (data) => new Date(data).toLocaleDateString('en-GB', {
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  month: 'short',
  weekday: 'short',
  timeZone: 'Europe/London'
});

const toFriendlyDateWithYear = (data) => new Date(data).toLocaleDateString('en-GB', {
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  month: 'short',
  weekday: 'short',
  year: 'numeric',
  timeZone: 'Europe/London'
});

const toFriendlyDateWithYearAndNoTime = (data) => new Date(data).toLocaleDateString('en-GB', {
  day: 'numeric',
  month: 'short',
  weekday: 'short',
  year: 'numeric',
  timeZone: 'Europe/London'
});

const escapeRegExp = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string

const replaceAll = (str, find, replace) => str.replace(new RegExp(escapeRegExp(find), 'g'), replace);

module.exports = {
  toFriendlyDate,
  toFriendlyDateWithYear,
  toFriendlyDateWithYearAndNoTime,
  replaceAll
};
