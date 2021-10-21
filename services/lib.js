const toFriendlyDate = (data) => {
  return new Date(data).toLocaleDateString('en-GB', {
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    month: 'short',
    weekday: 'short',
    timeZone: 'Europe/London'
  })
}

const toFriendlyDateWithYear = (data) => {
  return new Date(data).toLocaleDateString('en-GB', {
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    month: 'short',
    weekday: 'short',
    year: 'numeric',
    timeZone: 'Europe/London'
  })
}

module.exports = {
  toFriendlyDate,
  toFriendlyDateWithYear
}
