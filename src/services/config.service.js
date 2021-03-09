var cacheManager = require('../cache/manager.service');

module.exports = {
  setInitialConfig() {
    setInitialCache();
  },
  async getRooms() {
    var rooms = getCacheObject('rooms');
    if (rooms != null) {
      return JSON.parse(rooms);
    }
    return {};
  },
};

function setInitialCache() {
  var rooms = [];
  cacheManager.set('rooms', rooms);

  var schedules = [];
  cacheManager.set('schedules', schedules);
}

function getCacheObject(key) {
  var exist = cacheManager.checkIfExist(key);
  return exist ? cacheManager.get(key) : null;
}

