let eventsStorage = (function () {
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
            case 4: property = 'timerId'
              break
            case 5: property = 'repeat'
              break
            case 6: property = 'extraFuncs'
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

let eventCalendar = (function () {
  let events = eventsStorage.getAllEvents()
  events.forEach(function (item) {
    if (Date.now() < toMsConverter(item.date)) {
      if (item.repeat === 'no') {
        let func = new Function(item.callback.slice(11, item.callback.length))
        item.timerId = setTimeout(func, toMsConverter(item.date) - Date.now())
      }
    }
  })
  function checkDate (cb, date) {
    let year = date.getFullYear()
    let month = date.getMonth()
    let dateDay = date.getDate()
    let hours = date.getHours()
    let minutes = date.getMinutes()
    let i = 0;
    (function loop () {
      if (i === 1) return
      var now = new Date()
      if (now.getFullYear() === year && now.getMonth() === month && now.getDate() === dateDay &&
        now.getHours() === hours && now.getMinutes() === minutes) {
        cb()
        i = 1
      }
      now = new Date() // allow for time passing
      var delay = 60000 - (now % 60000) // exact ms to next minute interval
      setTimeout(loop, delay)
    })()
  }

  function toMsConverter (date) {
    let dateForParse = date.slice(0, 10) + 'T' + date.slice(11, 17)
    return Date.parse(dateForParse)
  }
  return {
    setEvent: function (titleEvent, dateEvent, callback) {
      let event = {
        title: titleEvent,
        date: dateEvent,
        id: Math.random().toString(36).substr(2, 9),
        callback: String(callback),
        timerId: 0,
        repeat: 'no',
        extraFuncs: []
      }

      if (toMsConverter(dateEvent) > Date.now()) {
        checkDate(callback, new Date(toMsConverter(event.date)))
      }

      events = eventsStorage.getAllEvents()
      events.push(event)
      eventsStorage.updateLocalStorage()
      return event
    },

    getEvents: function (startTime, endTime) {
      let startMs = toMsConverter(startTime)
      let endMs = toMsConverter(endTime)

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
          let func = new Function(item.callback.slice(11, item.callback.length))
          checkDate(func, new Date(toMsConverter(item.date)))
        }
      })
      eventsStorage.updateLocalStorage()
    },
    /* Метод для проверки, не забыть удалить!! */
    getAllEvents: function () {
      return events
    },
    updateEvents: function () {
      events = eventsStorage.getAllEvents()
    }
  }
})()
