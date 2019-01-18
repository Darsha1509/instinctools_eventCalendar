const eventsStorage = (function () {
  return {
    getAllEvents: function () {
      let events = []
      for (let key in window.localStorage) {
        let item = window.localStorage.getItem(key)
        if (String(item).charAt(0) !== '{') break
        let currentEvent = JSON.parse(item)
        let n = 0
        let property = ''
        let filter = true
        for (let prop in currentEvent) {
          switch (n) {
            case 0: property = 'title'
              break
            case 1: property = 'date'
              break
            case 2: property = 'id'
              break
            case 3: property = 'callback'
              break
            case 4: property = 'repeat'
              break
            case 5: property = 'extraFuncs'
              break
          }
          if (prop === property) {
            filter = true
          } else {
            filter = false
          }
          n++
        }
        if (filter) {
          events[events.length] = currentEvent
        }
      }
      return events
    },
    updateLocalStorage: function () {
      window.localStorage.clear()
      eventCalendar.getAllEvents().forEach(function (item, i, arr) {
        window.localStorage.setItem(i + ' ', JSON.stringify(item))
      })
    }
  }
})()

const eventCalendar = (function () {
  let events = eventsStorage.getAllEvents()
  runEventsTimer(events)
  function runEventsTimer (events) {
    (function loop () {
      let now = new Date()
      events.forEach(function (item) {
        const date = new Date(toMsConverter(item.date))
        const year = date.getFullYear()
        const month = date.getMonth()
        const dateDay = date.getDate()
        const hours = date.getHours()
        const minutes = date.getMinutes()
        const func = new Function(item.callback.slice(11, item.callback.length))
        if (now.getFullYear() === year && now.getMonth() === month && now.getDate() === dateDay &&
          now.getHours() === hours && now.getMinutes() === minutes) {
          func()
        }
      })
      now = new Date() // allow for time passing
      let delay = 60000 - (now % 60000) // exact ms to next minute interval
      setTimeout(loop, delay)
    })()
  }

  function runEventTimer (event) {
    (function loop () {
      let empty = ''
      events.forEach(function (item) {
        if (item.id === event.id) {
          empty = item.id
        }
      })
      if (empty === '') return
      if (event.repeat === 'everyDay' || typeof event.repeat === 'number') return
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

  function toMsConverter (date) {
    const dateForParse = date.slice(0, 10) + 'T' + date.slice(11, 17)
    return Date.parse(dateForParse)
  }
  return {
    setEvent: function (titleEvent, dateEvent, callback) {
      const event = {
        title: titleEvent,
        date: dateEvent,
        id: Math.random().toString(36).substr(2, 9),
        callback: String(callback),
        repeat: 'no',
        extraFuncs: []
      }
      events = eventsStorage.getAllEvents()
      events.push(event)
      eventsStorage.updateLocalStorage()
      runEventTimer(events[events.length - 1])
      return event
    },

    getEvents: function (startTime, endTime) {
      const startMs = toMsConverter(startTime)
      const endMs = toMsConverter(endTime)

      return events.filter(function (event) {
        return toMsConverter(event.date) >= startMs && toMsConverter(event.date) <= endMs
      })
    },

    deleteEvent: function (id) {
      events.forEach(function (item, i, arr) {
        if (item.id === id) {
          delete arr.splice(i, 1)
        }
      })
      eventsStorage.updateLocalStorage()
    },

    changeEventTitle: function (id, newTitle) {
      events.forEach(function (item) {
        if (item.id === id) {
          item.title = newTitle
        }
      })
      eventsStorage.updateLocalStorage()
    },

    changeEventDate: function (id, newDate) {
      events.forEach(function (item) {
        if (item.id === id) {
          item.date = newDate
        }
      })
      eventsStorage.updateLocalStorage()
    },
    getAllEvents: function () {
      return events
    },
    updateEvents: function () {
      events = eventsStorage.getAllEvents()
    }
  }
})()
