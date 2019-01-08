function toMsConverter(date) {
    var dateForParse = date.slice(0,10) + 'T' + date.slice(11,17);
    var ms = Date.parse(dateForParse);
    return ms;
}

var eventCalendar = {
  events: [],

  setEvent: function(titleEvent, dateEvent, callback) {

      var event = {
          title: titleEvent,
          date: dateEvent,
          id: Math.random().toString(36).substr(2,9)
      };

      this.events.push(event);

      var interval = toMsConverter(event.date) - Date.now();
      setTimeout(callback, interval);
  },

  getEvents: function(startTime, endTime) {

      var startMs = toMsConverter(startTime);
      var endMs = toMsConverter(endTime);

      var result = this.events.filter(function(event) {
        return toMsConverter(event.date) >= startMs && toMsConverter(event.date) <= endMs;
      });
      return result;
  },

  deleteEvent: function(id) {
      this.events.forEach(function(item, i, arr) {
          if(item.id === id) {
              delete arr.splice(i,1);
          }
      });
  },

  changeEventTitle: function(id, newTitle) {
      this.events.forEach(function(item) {
          if(item.id === id) {
              item.title = newTitle;
          }
      });
  },

  changeEventDate: function(id, newDate) {
      this.events.forEach(function(item) {
          if(item.id === id) {
              item.date = newDate;
          }
      });
  }
};

