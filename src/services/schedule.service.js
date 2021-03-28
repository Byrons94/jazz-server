const cacheManager = require('../cache/manager.service');
const plasmaConfig = require('./plasma-configuration.service');
const _ = require('lodash');
const dateUtil  = require('../utils/date-formatter');
const config = require('../config.json')

module.exports = {
    async getSchedulesByRoomName(roomName) {
        var schedules = [];
        var schedulesCache = [...JSON.parse(getChachedData('schedules')) ];
        if (schedulesCache) {
            if(roomName === 'all:all') {
                schedules = getSchedulesWithNextEventsOnly(schedulesCache);
            } else {
                var schedule = getScheduleByRoomName(roomName, schedulesCache);
                if (schedule) {
                    schedules.push(schedule);
                }
            }
        }
        return schedules;
    },
    async getByConfigurationCode(code) {
        var schedules = [];
        var schedulesCache = [ ...JSON.parse(getChachedData('schedules')) ];
        plasmaConfig.get(code).then(function (configuration) {
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
                    var schedule = getScheduleByRoomName(roomName, schedulesCache);
                    if (schedule) {
                        schedules.push(schedule);
                    }
                });
            }
        });
        return schedules;
    }
};

function getChachedData(key) {
    return cacheManager.get('schedules');
}

function getScheduleByRoomName(roomName, schedules) {
    return schedules.find(x => roomName === (x.sport + ":" + x.division));
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