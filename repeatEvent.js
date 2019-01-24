var EventCalendar = require('./EventCalendar');



/*(function () {
  runRepeatTimer()
  function runRepeatTimer () {
    (function loop () {
      let events = eventCalendar.getAllEvents()
      let now = new Date()
      events.forEach(function (event) {
        if (event.repeat === 'everyDay' || typeof event.repeat === 'object') {
          const hours = +event.date.slice(0, 2)
          const minutes = +event.date.slice(3, 5)
          const fun = new Function(event.callback.slice(11, event.callback.length))
          if (now.getHours() === hours && now.getMinutes() === minutes && event.repeat === 'everyDay') {
            fun()
          } else if (typeof event.repeat === 'object') {
            event.repeat.forEach(function (day) {
              if (day === 7) day = 0
              if (now.getDay() === day && now.getHours() === hours && now.getMinutes() === minutes) {
                fun()
              }
            })
          }
        }
      })
      now = new Date()
      const delay = 60000 - (now % 60000)
      setTimeout(loop, delay)
    })()
  }
  eventCalendar.setEveryDayEvent = function (titleEvent, dateEvent, callback) {
    let repeatedEvent = eventCalendar.setEvent(titleEvent, dateEvent, callback)
    repeatedEvent.repeat = 'everyDay'
    eventsStorage.updateLocalStorage(eventCalendar.getAllEvents())
  };
  eventCalendar.setRepeatInWeekDayEvent = function (titleEvent, dateEvent, callback, daysOfWeek) {
    let repeatedEvent = eventCalendar.setEvent(titleEvent, dateEvent, callback)
    repeatedEvent.repeat = daysOfWeek
    eventsStorage.updateLocalStorage(eventCalendar.getAllEvents())
  };
  var oldSetEvent = eventCalendar.setEvent;

  eventCalendar.setEvent = function (arguments) {
    oldSetEvent.apply(eventCalendar, arguments);
    console.log(arguments);
  }
})();*/
