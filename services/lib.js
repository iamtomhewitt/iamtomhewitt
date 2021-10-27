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

module.exports = {
  toFriendlyDate,
  toFriendlyDateWithYear
};
