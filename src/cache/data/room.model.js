//format with typescript
class Room {
    constructor(sport, division, roomNew, roomDeleted) {
        this.sport = sport;
        this.division = division;
        this.roomNew = roomNew;
        this.roomDeleted = roomDeleted;
      }

      getRoomName() {
          return this.sport + ':' + this.division;
      }
      getRoomSport() {
          return this.sport;
      }
      getRoomDivision() {
          return this.division;
      }
      isNew() {
          return this.roomNew;
      }
      isDeleted() {
          return this.roomDeleted
      }

}

module.exports = Room;