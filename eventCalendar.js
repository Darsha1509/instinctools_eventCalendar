let eventCalendar = (function () {
  let events = []

  if (Object.keys(window.localStorage).length > 0) {
    for (let key in window.localStorage) {
      events[+key.slice(0, key.length - 1)] = JSON.parse(window.localStorage.getItem(key))
    }

    events.forEach(function (item) {
      if (Date.now() < toMsConverter(item.date)) {
        let func = new Function(item.callback.slice(11, item.callback.length))
        item.timerId = setTimeout(func, toMsConverter(item.date) - Date.now())
      }
    })
  }
  function toMsConverter (date) {
    let dateForParse = date.slice(0, 10) + 'T' + date.slice(11, 17)
    return Date.parse(dateForParse)
  }

  function updateLocalStorage (array) {
    window.localStorage.clear()
    array.forEach(function (item, i, arr) {
      window.localStorage.setItem(i + ' ', JSON.stringify(item))
    })
  }

  return {
    setEvent: function (titleEvent, dateEvent, callback) {
      let event = {
        title: titleEvent,
        date: dateEvent,
        id: Math.random().toString(36).substr(2, 9),
        callback: String(callback),
        timerId: setTimeout(callback, toMsConverter(dateEvent) - Date.now())
      }

      events.push(event)
      updateLocalStorage(events)
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
      updateLocalStorage(events)
    },

    changeEventTitle: function (id, newTitle) {
      events.forEach(function (item) {
        if (item.id === id) {
          item.title = newTitle
        }
      })
      updateLocalStorage(events)
    },

    changeEventDate: function (id, newDate) {
      events.forEach(function (item) {
        if (item.id === id) {
          clearTimeout(item.timerId)
          item.date = newDate
          let func = new Function(item.callback.slice(11, item.callback.length))
          item.timerId = setTimeout(func, toMsConverter(newDate) - Date.now())
        }
      })
      updateLocalStorage(events)
    }
  }
})()
