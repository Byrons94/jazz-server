//format with typescript
class Schedule {
    constructor(id, date, sport, division, title, games, touched) {
       this.id = id;
       this.date = date;
       this.sport = sport;
       this.division = division;
       this.title = title;
       this.games = games;
       this.touched = touched;
    } 
}

module.exports = Schedule;