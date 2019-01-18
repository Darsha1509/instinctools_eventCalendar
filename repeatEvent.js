let repeatEvent = (function () {
  function toMsConverter (date) {
    let dateForParse = date.slice(0, 10) + 'T' + date.slice(11, 17)
    return Date.parse(dateForParse)
  }

  let events = eventsStorage.getAllEvents()
  events.forEach(function (item) {
    if (item.repeat === 'everyDay') {
      let func = new Function(item.callback.slice(11, item.callback.length))
      let date = new Date(toMsConverter(item.date))
      let hours = date.getHours()
      let minutes = date.getMinutes()
      item.timerId = checkTime(func, hours, minutes)
    }
  })

  events.forEach(function (item) {
    if (typeof item.repeat === 'number') {
      let func = new Function(item.callback.slice(11, item.callback.length))
      let date = new Date(toMsConverter(item.date))
      let hours = date.getHours()
      let minutes = date.getMinutes()
      item.timerId = checkDay(func, item.repeat, hours, minutes)
    }
  })

  function checkTime (cb, hours, minutes) {
    (function loop () {
      var now = new Date()
      if (now.getHours() === hours && now.getMinutes() === minutes) {
        cb()
      }
      now = new Date() // allow for time passing
      var delay = 60000 - (now % 60000) // exact ms to next minute interval
      setTimeout(loop, delay)
    })()
  }

  function checkDay (cb, day, hours, minutes) {
    (function loop () {
      var now = new Date()
      if (now.getDay() === day && now.getHours() === hours && now.getMinutes() === minutes) {
        cb()
      }
      now = new Date() // allow for time passing
      var delay = 60000 - (now % 60000) // exact ms to next minute interval
      setTimeout(loop, delay)
    })()
  }
  return {
    setEveryDayEvent: function (titleEvent, dateEvent, callback) {
      let repeatedEvent = eventCalendar.setEvent(titleEvent, dateEvent, callback)
      repeatedEvent.repeat = 'everyDay'
      eventsStorage.updateLocalStorage()
      let date = new Date(toMsConverter(dateEvent))
      let dateHours = date.getHours()
      let dateMinutes = date.getMinutes()
      if (Date.now() > toMsConverter(dateEvent)) {
        checkTime(callback, dateHours, dateMinutes)
      } else {
        setTimeout(function () {
          checkTime(callback, dateHours, dateMinutes)
        }, toMsConverter(dateEvent) + 60000 - Date.now())
      }
    },
    setRepeatInWeekDayEvent: function (titleEvent, dateEvent, callback, dayOfWeek) {
      let repeatedEvent = eventCalendar.setEvent(titleEvent, dateEvent, callback)
      repeatedEvent.repeat = dayOfWeek
      eventsStorage.updateLocalStorage()
      if (dayOfWeek === 7) dayOfWeek = 0
      let date = new Date(toMsConverter(dateEvent))
      let dateHours = date.getHours()
      let dateMinutes = date.getMinutes()
      if (Date.now() > toMsConverter(dateEvent)) {
        checkDay(callback, dayOfWeek, dateHours, dateMinutes)
      } else {
        setTimeout(function () {
          checkDay(callback, dayOfWeek, dateHours, dateMinutes)
        }, toMsConverter(dateEvent) + 60000 - Date.now())
      }
    }
  }
})()
