module.exports = {
    formatTime(time, hourToadd) {
        if (time) {
            let hours = parseInt(time.split(":")[0]);
            let minutes = parseInt(time.split(":")[1].replace("AM", "").replace("PM", "").trim());
            if (time.includes("PM")) {
              hours = hours + 12;
            }      
            let d = new Date(new Date().toUTCString().slice(0, -3));
            d.setHours(hours + 8, minutes, 0, 0);
            let hoursToAdd = parseInt(hourToadd.split(".")[0]);
            let minutesToadd = isNaN(parseInt(hourToadd.split(".")[1])) ? 0 : parseInt(hourToadd.split(".")[1]); 
            d.setHours(d.getHours() + hoursToAdd, d.getMinutes() + minutesToadd);
            if (d.getHours() > 12) {
              return (d.getHours() - 12) + ":" + (d.getMinutes() < 10  ? "0" + d.getMinutes():  d.getMinutes()) + " " + "PM";
            }
            else {
              return (d.getHours() < 10 ? "0" + d.getHours() : d.getHours()) +":" + (d.getMinutes() < 10  ? "0" + d.getMinutes():  d.getMinutes()) + " " + "AM";
            }
          }
    },
    getUTCDateTime24HoursFormat(date, time) {
      let hours = parseInt(time.split(":")[0]);
      let minutes = parseInt(time.split(":")[1].replace("AM", "").replace("PM", "").trim());
      if (time.includes("PM")) {
        hours = hours + 12;
      }
      let d = new Date(new Date(date).toUTCString().slice(0, -3));
      d.setHours(hours + 8, minutes, 0, 0);
      return d;
    },
    getCurrentUtcDateTime() {
      var date = new Date();
      var currentUTCDate = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
      return currentUTCDate;
    },
};