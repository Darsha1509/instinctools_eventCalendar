const eventsStorage = (function () {
  return {
    getAllEvents: function () {
      return JSON.parse(window.localStorage.getItem('events')) || [];
    },
    updateLocalStorage: function (events) {
      window.localStorage.removeItem('events');
      window.localStorage.setItem('events', JSON.stringify(events));
    }
  }
})();

function EventCalendar() {
  this.events = eventsStorage.getAllEvents();
}

EventCalendar.prototype.toMsConverter = function (date) {
    const dateForParse = date.slice(0, 10) + 'T' + date.slice(11, 17);
    return Date.parse(dateForParse);
  };

EventCalendar.prototype.runEventTimer = function () {
  const self = this;
  (function loop() {
    let now = new Date();
    if (self.events.length > 0) {
      self.events.forEach(function (item) {
        let date = new Date(self.toMsConverter(item.date));
        let year = date.getFullYear();
        let month = date.getMonth();
        let dateDay = date.getDate();
        let hours = date.getHours();
        let minutes = date.getMinutes();
        let func = new Function(item.callback.slice(11, item.callback.length));
        if (now.getFullYear() === year && now.getMonth() === month && now.getDate() === dateDay &&
          now.getHours() === hours && now.getMinutes() === minutes) {
          func();
        }
      });
    }
    setTimeout(function () {loop()}, 60000);
  })();
};

EventCalendar.prototype.setEvent = function (titleEvent, dateEvent, callback) {
  const event = {
    title: titleEvent,
    date: dateEvent,
    id: Math.random().toString(36).substr(2, 9),
    callback: String(callback)
  };
  this.events.push(event);
  eventsStorage.updateLocalStorage(this.events);
  return event
};

EventCalendar.prototype.getDayEvent = function () {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  return this.events.map(function (event) {
    let dateEvent = new Date(this.toMsConverter(event.date));
    return dateEvent.getFullYear() === year && dateEvent.getMonth() === month && dateEvent.getDate() === day;
  });
};

EventCalendar.prototype.deleteEvent = function (id) {
    this.events = this.events.map(function(event){
      return event.id !== id;
    });
    eventsStorage.updateLocalStorage(this.events);
};

EventCalendar.prototype.changeEventTitle = function (id, newTitle) {
  this.events = this.events.map(function(event) {
    if (event.id === id) {
      return Object.assign({}, event, { title: newTitle });
    }
    return event;
  });
  eventsStorage.updateLocalStorage(this.events);
};

EventCalendar.prototype.changeEventDate = function (id, newDate) {
    this.events.forEach(function (item) {
      if (item.id === id) {
        item.date = newDate;
      }
    });
    eventsStorage.updateLocalStorage(this.events);
};

let eventCalendar1 = new EventCalendar();

eventCalendar1.runEventTimer();

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
