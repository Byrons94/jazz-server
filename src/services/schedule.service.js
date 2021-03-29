const cacheManager = require('../cache/manager.service');
const plasmaConfig = require('./plasma-configuration.service');
const _ = require('lodash');
const dateUtil  = require('../utils/date-formatter');
const config = require('../config.json')

module.exports = {
    async getSchedulesByRoomName(roomName) {
        var schedules = [];
        var schedulesCache = [];
        var cachedData = getChachedData('schedules');
        if (cachedData != null) {
            schedulesCache = [...JSON.parse(cachedData) ];
        }
        if (schedulesCache) {
            if(roomName === 'all:all') {
                schedules = getSchedulesWithNextEventsOnly(schedulesCache);
            } else {
                var schedulesByRoomName = getScheduleRoomName(roomName, schedulesCache);
                if (schedulesByRoomName && schedulesByRoomName.length > 0) {
                    schedules = schedules.concat(schedulesByRoomName);
                }
            }
        }
        return schedules;
    },
    async getByConfigurationCode(code) {
        var schedules = [];
        var schedulesCache = [];
        var cachedData = getChachedData('schedules');
        if (cachedData != null) {
            schedulesCache = [...JSON.parse(cachedData) ];
        }
        await plasmaConfig.get(code).then(function (configuration) {
            if (configuration) {
                if (configuration.showOnlyNextEvents) {
                    schedules = getSchedulesWithNextEventsOnly(schedulesCache);
                } else {
                    var roomNames = []; 
                    configuration.sections.forEach(function(section) {
                        if (section.events) {
                            section.events.forEach(function(event) { 
                                var roomName = event.sport + ':' + event.division;
                                roomNames.push(roomName);
                            });
                        }
                    });
                    roomNames.forEach(function(roomName){
                        var schedulesByRoomName = getScheduleRoomName(roomName, schedulesCache);
                        if (schedulesByRoomName && schedulesByRoomName.length > 0) {
                            schedules = schedules.concat(schedulesByRoomName);
                        }
                    });
                }
            }
        });
        return schedules;
    }
};

function getChachedData(key) {
    var cachedData = cacheManager.get('schedules')
    return cachedData ? cachedData: null;
}

function getScheduleRoomName(roomName, schedules) {
    return schedules.filter(x => roomName === (x.sport + ":" + x.division));
}

function getSchedulesWithNextEventsOnly(schedules) {
    var nextOnlySchedules = [];
    var nextEventsLimitTime =  parseInt(config.nextEventsLimit.value);
    var currentUTCDate = dateUtil.getCurrentUtcDateTime(); 
    var currentUtcLimit = dateUtil.getCurrentUtcDateTime();
    currentUtcLimit.setUTCMinutes(currentUtcLimit.getUTCMinutes() + nextEventsLimitTime);
    schedules.forEach(schedule => {
        if (schedule.games) {
            var futureGames = [];
            schedule.games.forEach(game => {
                var gameDateInUTC =  dateUtil.getUTCDateTime24HoursFormat(schedule.date, game.time);  
                if (gameDateInUTC >= currentUTCDate && gameDateInUTC <= currentUtcLimit) {
                    futureGames.push(game);
                }
            });
            if (futureGames.length > 0) {
                schedule.games = futureGames;
                nextOnlySchedules.push(schedule);
            }
        }
    });
    return nextOnlySchedules;
}