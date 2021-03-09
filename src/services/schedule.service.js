const cacheManager = require('../cache/manager.service');
const _ = require('lodash');

module.exports = {
    async getSchedulesByRoomName(roomName) {
        var schedules = [];
        var data = JSON.parse(getChachedData('schedules'));
        if (data) {
            data.forEach(schedule => {
                var room = schedule.sport + ":" + schedule.division;
                if (_.isEqual(room, roomName)) {
                    schedules.push(schedule);
                }
            });
        }
        return schedules;
    }
};

function getChachedData(key) {
    return cacheManager.get('schedules');
}
