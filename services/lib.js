const toFriendlyDate = (data) => new Date(data).toLocaleDateString('en-GB', {
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  month: 'short',
  timeZone: 'Europe/London',
  weekday: 'short',
});

const toFriendlyDateWithYear = (data) => new Date(data).toLocaleDateString('en-GB', {
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  month: 'short',
  timeZone: 'Europe/London',
  weekday: 'short',
  year: 'numeric',
});

const toFriendlyDateWithYearAndNoTime = (data) => new Date(data).toLocaleDateString('en-GB', {
  day: 'numeric',
  month: 'short',
  timeZone: 'Europe/London',
  weekday: 'short',
  year: 'numeric',
});

const escapeRegExp = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string

const replaceAll = (str, find, replace) => str.replace(new RegExp(escapeRegExp(find), 'g'), replace);

module.exports = {
  replaceAll,
  toFriendlyDate,
  toFriendlyDateWithYear,
  toFriendlyDateWithYearAndNoTime,
};
