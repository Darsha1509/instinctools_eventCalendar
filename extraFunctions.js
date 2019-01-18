const extraFunctions = (function () {
  function toMsConverter (date) {
    const dateForParse = date.slice(0, 10) + 'T' + date.slice(11, 17)
    return Date.parse(dateForParse)
  }

  let events = eventsStorage.getAllEvents()
  events.forEach(function (item) {
    const eventDate = item.date
    if (item.repeat === 'no') {
      item.extraFuncs.forEach(function (item) {
        const func = new Function(item.func.slice(11, item.func.length))
        const funcDate = eventDate.substring(0, 11) + (+eventDate.substring(11, 13) - item.interval) + eventDate.substring(13, 17)
        const funcTime = new Date(toMsConverter(funcDate))
        runEventTimer(func, funcTime)
      })
    } else if (item.repeat === 'everyDay') {
      item.extraFuncs.forEach(function (item) {
        const func = new Function(item.func.slice(11, item.func.length))
        const funcDate = eventDate.substring(0, 11) + (+eventDate.substring(11, 13) - item.interval) + eventDate.substring(13, 17)
        const funcTime = new Date(toMsConverter(funcDate))
        const funcHours = funcTime.getHours()
        const funcMinutes = funcTime.getMinutes()
        runTimer(func, funcHours, funcMinutes)
      })
    } else {
      const day = item.repeat
      item.extraFuncs.forEach(function (item) {
        const func = new Function(item.func.slice(11, item.func.length))
        const funcDate = eventDate.substring(0, 11) + (+eventDate.substring(11, 13) - item.interval) + eventDate.substring(13, 17)
        const funcTime = new Date(toMsConverter(funcDate))
        const funcHours = funcTime.getHours()
        const funcMinutes = funcTime.getMinutes()
        runDayTimer(func, day, funcHours, funcMinutes)
      })
    }
  })

  function runEventTimer (cb, date) {
    const year = date.getFullYear()
    const month = date.getMonth()
    const dateDay = date.getDate()
    const hours = date.getHours()
    const minutes = date.getMinutes();
    (function loop () {
      let now = new Date()
      if (now.getFullYear() === year && now.getMonth() === month && now.getDate() === dateDay &&
        now.getHours() === hours && now.getMinutes() === minutes) {
        cb()
      }
      now = new Date()
      const delay = 60000 - (now % 60000)
      setTimeout(loop, delay)
    })()
  }

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
    forOneEvent: function (fun, event, timeHoursInterval) {
      let events = eventsStorage.getAllEvents()
      let targetEvent = {}
      let index = 0
      events.forEach(function (item, i, arr) {
        if (item.id === event) {
          targetEvent = item
          index = i
        }
      })
      const extraFun = {
        func: String(fun),
        interval: timeHoursInterval
      }
      targetEvent.extraFuncs.push(extraFun)
      window.localStorage.setItem(index + ' ', JSON.stringify(targetEvent))
      eventCalendar.updateEvents()
      const eventDate = targetEvent.date
      const funcDate = eventDate.substring(0, 11) + (+eventDate.substring(11, 13) - timeHoursInterval) + eventDate.substring(13, 17)
      const funcTime = new Date(toMsConverter(funcDate))
      const funcHours = funcTime.getHours()
      const funcMinutes = funcTime.getMinutes()
      switch (targetEvent.repeat) {
        case 'no':
          runEventTimer(fun, funcTime)
          break
        case 'everyDay':
          runTimer(fun, funcHours, funcMinutes)
          break
        default:
          let day = targetEvent.repeat
          if (day === 7) day = 0
          runDayTimer(fun, day, funcHours, funcMinutes)
          break
      }
    },
    forAllEvents: function (fun, timeHoursInterval) {
      let events = eventsStorage.getAllEvents()
      const extraFun = {
        func: String(fun),
        interval: timeHoursInterval
      }
      for (let key in window.localStorage) {
        if (key === 'length') break
        let event = JSON.parse(window.localStorage[key])
        event.extraFuncs.push(extraFun)
        window.localStorage[key] = JSON.stringify(event)
      }
      eventCalendar.updateEvents();
      (function loop () {
        events.forEach(function (item) {
          let itemDate = new Date(toMsConverter(item.date))
          let funcDate = itemDate
          funcDate.setHours(itemDate.getHours() - timeHoursInterval)
          let funYear = funcDate.getFullYear()
          let funMonth = funcDate.getMonth()
          let funDateDay = funcDate.getDate()
          let funcHours = funcDate.getHours()
          let funcMinutes = funcDate.getMinutes()
          let now = new Date()
          if (item.repeat === 7) {
            item.repeat = 0
          }
          if (item.repeat === 'no' && now.getFullYear() === funYear && now.getMonth() === funMonth &&
            now.getDate() === funDateDay && now.getHours() === funcHours && now.getMinutes() === funcMinutes) {
            fun()
          } else if (item.repeat === 'everyDay' && now.getHours() === funcHours && now.getMinutes() === funcMinutes) {
            fun()
          } else if (now.getDay() === item.repeat && now.getHours() === funcHours && now.getMinutes() === funcMinutes) {
            fun()
          }
        })
        let now = new Date()
        const delay = 60000 - (now % 60000)
        setTimeout(loop, delay)
      })()
    }
  }
})()
