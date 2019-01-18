const repeatEvent = (function () {
  function toMsConverter (date) {
    const dateForParse = date.slice(0, 10) + 'T' + date.slice(11, 17)
    return Date.parse(dateForParse)
  }

  function runEventTimer (event) {
    (function loop () {
      let now = new Date()
      const date = new Date(toMsConverter(event.date))
      const year = date.getFullYear()
      const month = date.getMonth()
      const dateDay = date.getDate()
      const hours = date.getHours()
      const minutes = date.getMinutes()
      const func = new Function(event.callback.slice(11, event.callback.length))
      if (now.getFullYear() === year && now.getMonth() === month && now.getDate() === dateDay &&
        now.getHours() === hours && now.getMinutes() === minutes) {
        func()
      }
      now = new Date() // allow for time passing
      const delay = 60000 - (now % 60000) // exact ms to next minute interval
      setTimeout(loop, delay)
    })()
  }

  let events = eventsStorage.getAllEvents()
  events.forEach(function (item) {
    if (item.repeat === 'everyDay') {
      const func = new Function(item.callback.slice(11, item.callback.length))
      const date = new Date(toMsConverter(item.date))
      const hours = date.getHours()
      const minutes = date.getMinutes()
      runTimer(func, hours, minutes)
    }
  })

  events.forEach(function (item) {
    if (typeof item.repeat === 'number') {
      const func = new Function(item.callback.slice(11, item.callback.length))
      const date = new Date(toMsConverter(item.date))
      const hours = date.getHours()
      const minutes = date.getMinutes()
      runDayTimer(func, item.repeat, hours, minutes)
    }
  })

  function runTimer (cb, hours, minutes) {
    (function loop () {
      let now = new Date()
      if (now.getHours() === hours && now.getMinutes() === minutes) {
        cb()
      }
      now = new Date()
      const delay = 60000 - (now % 60000)
      setTimeout(loop, delay)
    })()
  }

  function runDayTimer (cb, day, hours, minutes) {
    (function loop () {
      let now = new Date()
      if (now.getDay() === day && now.getHours() === hours && now.getMinutes() === minutes) {
        cb()
      }
      now = new Date()
      const delay = 60000 - (now % 60000)
      setTimeout(loop, delay)
    })()
  }
  return {
    setEveryDayEvent: function (titleEvent, dateEvent, callback) {
      let repeatedEvent = eventCalendar.setEvent(titleEvent, dateEvent, callback)
      repeatedEvent.repeat = 'everyDay'
      eventsStorage.updateLocalStorage()
      const date = new Date(toMsConverter(dateEvent))
      const dateHours = date.getHours()
      const dateMinutes = date.getMinutes()
      runTimer(callback, dateHours, dateMinutes)
    },
    setRepeatInWeekDayEvent: function (titleEvent, dateEvent, callback, dayOfWeek) {
      let repeatedEvent = eventCalendar.setEvent(titleEvent, dateEvent, callback)
      repeatedEvent.repeat = dayOfWeek
      eventsStorage.updateLocalStorage()
      if (dayOfWeek === 7) dayOfWeek = 0
      const date = new Date(toMsConverter(dateEvent))
      const dateHours = date.getHours()
      const dateMinutes = date.getMinutes()
      runEventTimer(repeatedEvent)
      runDayTimer(callback, dayOfWeek, dateHours, dateMinutes)
    }
  }
})()
