const extraFuncsStorage = (function () {
  return {
    getAllFuncs: function () {
      return JSON.parse(window.localStorage.getItem('global'))
    },
    updateLocalStorage: function (funcs) {
      window.localStorage.removeItem('global')
      window.localStorage.setItem('global', JSON.stringify(funcs))
    }
  }
})()

const extraFunctions = (function () {
  let globalFuncs = []
  if (window.localStorage.getItem('global') !== null) {
    globalFuncs = extraFuncsStorage.getAllFuncs()
  }
  function toMsConverter (date) {
    const dateForParse = date.slice(0, 10) + 'T' + date.slice(11, 17)
    return Date.parse(dateForParse)
  }

  runExtraFuncTimer()

  function runExtraFuncTimer () {
    (function loop () {
      let events = eventCalendar.getAllEvents()
      let now = new Date()
      events.forEach(function (event) {
        if (String(event.extraFuncs) !== '[]') {
          event.extraFuncs.forEach(function (item) {
            const fun = new Function(item.func.slice(11, item.func.length))
            let year = 0
            let month = 0
            let dateDay = 0
            let hours = 0
            let minutes = 0
            if (event.repeat === 'no') {
              const eventDate = new Date(toMsConverter(event.date))
              let date = eventDate
              date.setMinutes(eventDate.getMinutes() - item.timeInterval)
              year = date.getFullYear()
              month = date.getMonth()
              dateDay = date.getDate()
              hours = date.getHours()
              minutes = date.getMinutes()
            } else if (event.repeat === 'everyDay' || typeof event.repeat === 'object') {
              let dateNow = new Date()
              dateNow.setHours(+event.date.slice(0, 2))
              dateNow.setMinutes(+event.date.slice(3, 5) - item.timeInterval)
              hours = dateNow.getHours()
              minutes = dateNow.getMinutes()
            }
            if (now.getFullYear() === year && now.getMonth() === month && now.getDate() === dateDay &&
              now.getHours() === hours && now.getMinutes() === minutes && event.repeat === 'no') {
              fun()
            } else if (now.getHours() === hours && now.getMinutes() === minutes && event.repeat === 'everyDay') {
              fun()
            } else if (typeof event.repeat === 'object') {
              event.repeat.forEach(function (day) {
                if (day === 7) {
                  day = 0
                }
                if (now.getDay() === day && now.getHours() === hours && now.getMinutes() === minutes) {
                  fun()
                }
              })
            }
          })
        }
      })
      now = new Date()
      const delay = 60000 - (now % 60000)
      setTimeout(loop, delay)
    })()
  }

  return {
    forOneEvent: function (fun, event, timeMinutesInterval) {
      let events = eventsStorage.getAllEvents()
      events.forEach(function (item) {
        if (item.id === event) {
          const extraFun = {
            func: String(fun),
            timeInterval: timeMinutesInterval
          }
          item.extraFuncs.push(extraFun)
        }
      })
      eventsStorage.updateLocalStorage(events)
      eventCalendar.updateEvents()
    },
    forAllEvents: function (fun, timeMinutesInterval) {
      const extraFun = {
        func: String(fun),
        timeInterval: timeMinutesInterval
      }
      globalFuncs = extraFuncsStorage.getAllFuncs()
      if (globalFuncs === null) globalFuncs = []
      globalFuncs.push(extraFun)
      let events = eventCalendar.getAllEvents()
      if (events.length > 0 && window.localStorage.getItem('events') !== null) {
        events.forEach(function (event) {
          event.extraFuncs.push(extraFun)
        })
        eventsStorage.updateLocalStorage(events)
      }
      extraFuncsStorage.updateLocalStorage(globalFuncs)
    }
  }
})()
