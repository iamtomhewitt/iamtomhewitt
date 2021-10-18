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

module.exports = {
  toFriendlyDate
}
