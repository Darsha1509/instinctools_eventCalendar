(function(global, factory) {
  if (typeof module === 'object' && typeof module.exports === 'object') {
    // CommonJS
    module.exports = factory();
  } else if (typeof define === 'function' && define.amd) {
    // AMD
    define(factory);
  } else {
    // Глобальная переменная (если скрипт выполняется в браузере, тогда это будет `window`)
    global.EventCalendar = factory();
  }
})(this, function() {
  'use strict';

  function EventCalendar () {

  }

    function getAllEvents() {
      return JSON.parse(window.localStorage.getItem('events')) || [];
    }

    function updateLocalStorage(events) {
      window.localStorage.removeItem('events');
      window.localStorage.setItem('events', JSON.stringify(events));
    }

    function toMsConverter(date) {
      var dateForParse = date.slice(0, 10) + 'T' + date.slice(11, 17);
      return Date.parse(dateForParse);
    }

    var events = getAllEvents();

    function runEventTimer() {
      (function loop() {
        var now = new Date();
        if (events.length > 0) {
          events.forEach(function (item) {
            var date = new Date(toMsConverter(item.date));
            var year = date.getFullYear();
            var month = date.getMonth();
            var dateDay = date.getDate();
            var hours = date.getHours();
            var minutes = date.getMinutes();
            var func = new Function(item.callback.slice(11, item.callback.length));
            if (now.getFullYear() === year && now.getMonth() === month && now.getDate() === dateDay &&
              now.getHours() === hours && now.getMinutes() === minutes) {
              func();
            }
          });
        }
        setTimeout(function () {
          loop()
        }, 60000);
      })();
    }

    runEventTimer();

    function getEventsByInterval(startTime, endTime) {
      return events.filter(function (event) {
        var dateEvent = new Date(toMsConverter(event.date));
        return dateEvent.getTime() >= startTime.getTime() && dateEvent.getTime() <= endTime.getTime();
      });
    }

  EventCalendar.prototype.logEvents = function () {
      console.log(events);
    };

  EventCalendar.prototype.setEvent = function (titleEvent, dateEvent, callback) {
      var event = {
        title: titleEvent,
        date: dateEvent,
        id: Math.random().toString(36).substr(2, 9),
        callback: String(callback)
      };
      events.push(event);
      updateLocalStorage(events);
      return event;

    };

  EventCalendar.prototype.getDayEvents = function () {
      var date = new Date();
      var year = date.getFullYear();
      var month = date.getMonth();
      var day = date.getDate();
      return events.filter(function (event) {
        var dateEvent = new Date(toMsConverter(event.date));
        return dateEvent.getFullYear() === year && dateEvent.getMonth() === month && dateEvent.getDate() === day;
      });
    };

  EventCalendar.prototype.getWeekEvents = function () {
      var date = new Date();
      var currentDay = date.getDay();
      var startTime = new Date();
      if (currentDay === 0) {
        startTime.setDate(date.getDate() - startTime.getDay() - 6);
      } else {
        startTime.setDate(date.getDate() - startTime.getDay() + 1);
      }
      var endTime = new Date();
      if (currentDay === 0) {
        endTime.setDate(date.getDate());
      } else {
        endTime.setDate(date.getDate() + 7 - endTime.getDay());
      }
      return getEventsByInterval(startTime, endTime);
    };

  EventCalendar.prototype.daysInMonth = function (month, year) {
      return new Date(year, month, 0).getDate();
    };

  EventCalendar.prototype.getMonthEvents = function () {
      var date = new Date();
      var startTime = new Date();
      startTime.setDate(1);

      //здесь останивилась я!!!

      return getEventsByInterval(startTime, endTime);
    };

  EventCalendar.prototype.deleteEvent = function (id) {
      events = events.map(function (event) {
        return event.id !== id;
      });
      updateLocalStorage(events);
    };

  EventCalendar.prototype.changeEventTitle = function (id, newTitle) {
      events = events.map(function (event) {
        if (event.id === id) {
          event.title = newTitle;
        }
        return event;
      });
      updateLocalStorage(events);
    };

  EventCalendar.prototype.changeEventDate = function (id, newDate) {
      events.forEach(function (item) {
        if (item.id === id) {
          item.date = newDate;
        }
      });
      updateLocalStorage(events);
    };

  return new EventCalendar();

});





/*const eventCalendar = (function () {
  let events = []
  if (window.localStorage.getItem('events') !== null) {
    events = eventsStorage.getAllEvents()
  }
  runEventsTimer();

  function runEventsTimer () {
    function loop () {
      let now = new Date();
      if (window.localStorage.getItem('events ') !== null) {
        let events = eventsStorage.getAllEvents();
        events.forEach(function (item) {
          if (item.repeat === 'no') {
            const date = new Date(toMsConverter(item.date));
            const year = date.getFullYear();
            const month = date.getMonth();
            const dateDay = date.getDate();
            const hours = date.getHours();
            const minutes = date.getMinutes();
            const func = new Function(item.callback.slice(11, item.callback.length));
            if (now.getFullYear() === year && now.getMonth() === month && now.getDate() === dateDay &&
              now.getHours() === hours && now.getMinutes() === minutes) {
              func();
            }
          }
        })
      }
      now = new Date(); // allow for time passing
      let delay = 60000 - (now % 60000); // exact ms to next minute interval
      setTimeout(function() {
        loop()
      }, delay)
    }
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
      if (window.localStorage.getItem('global') !== null) {
        JSON.parse(window.localStorage.getItem('global')).forEach(function (func) {
          event.extraFuncs.push(func)
        })
      }
      events = eventsStorage.getAllEvents()
      if (events === null) events = []
      events.push(event)
      eventsStorage.updateLocalStorage(events)
      return event
    },
    getDayEvents: function () {
      const date = new Date()
      const day = date.getDate()
      const year = date.getFullYear()
      const month = date.getMonth()
      const dayOfWeek = date.getDay()
      let result = []
      events.forEach(function (event) {
        if (event.repeat === 'everyDay') {
          result.push(event)
        }
        if (typeof event.repeat === 'object') {
          event.repeat.forEach(function (day) {
            if (day === dayOfWeek) {
              result.push(event)
            }
          })
        }
        if (event.repeat === 'no') {
          let dateEvent = new Date(toMsConverter(event.date))
          if (dateEvent.getFullYear() === year && dateEvent.getMonth() === month && dateEvent.getDate() === day) {
            result.push(event)
          }
        }
      })
      return result
    },
    getWeekEvents: function () {
      const date = new Date()
      const day = date.getDate()
      const year = date.getFullYear()
      const month = date.getMonth()
      const dayOfWeek = date.getDay();
      let result = []
      events.forEach(function (event) {
        if (event.repeat === 'everyDay' || typeof event.repeat === 'object') {
          result.push(event)
        }
        if (event.repeat === 'no') {
          let eventDate = new Date(toMsConverter(event.date))
          let eventWeekDay = eventDate.getDay()
          let n = 0
          // дальше использовать функцию для интервала (которая еще не написана)
        }
      })
    },
    getMonthEvents: function () {

    },
    getPeriodEvents: function (startTime, endTime) {
      const startDate = new Date(toMsConverter(startTime))
      const endDate = new Date(toMsConverter(endTime))

      return events.filter(function (event) {
        return toMsConverter(event.date) >= startMs &&
          toMsConverter(event.date) <= endMs &&
          event.repeat === 'everyDay'
      })
    },

    deleteEvent: function (id) {
      events = events.filter(function(e){
        return e.id !== id;
      });

      eventsStorage.updateLocalStorage(events)
    },

    changeEventTitle: function (id, newTitle) {
      events = events.map(function(e) {
        if (e.id === id) {
          return Object.assign({}, e, { title: newTitle })
        }
        return e;
      });
      eventsStorage.updateLocalStorage(events)
    },

    changeEventDate: function (id, newDate) {
      events.forEach(function (item) {
        if (item.id === id) {
          item.date = newDate
        }
      })
      eventsStorage.updateLocalStorage(events)
    },
    getAllEvents: function () {
      return events
    },
    updateEvents: function () {
      events = eventsStorage.getAllEvents()
    }
  }
})()*/
