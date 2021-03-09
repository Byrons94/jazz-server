const _ = require('lodash');
const XmlClient = require('../client/xmlClient');
const config = require('../config.json');
const cacheManager = require('../cache/manager.service');
const Game = require('../cache/data/game.model');
const Room = require('../cache/data/room.model');
const Schedule = require('../cache/data/schedule.model');
const Participant = require('../cache/data/participant.model');
const Line = require('../cache/data/line.model');
const Total = require('../cache/data/total.model');

module.exports = {
    async loadLines() {
        return XmlClient.get(config.jazzsportsFeedUrl).then(response => {
            setDataInCache(response);
            return cacheManager.get('schedules');
        })
        .catch(error => {
            throw error;
        });
    },
};

function setDataInCache(xmlAsJson) {
    if (xmlAsJson && xmlAsJson.odds[0].schedule) {
        var rooms = getRooms(xmlAsJson.odds[0].schedule);
        var schedules = getSchedules(xmlAsJson.odds[0].schedule);
        cacheManager.set('rooms', JSON.stringify(rooms));
        cacheManager.set('schedules', JSON.stringify(schedules));
    }
}

function getRooms(scheduleList) {
    var rooms = [];
    if (scheduleList) {
        scheduleList.forEach(function (schedule) {
            var room = new Room(schedule.$.sport, schedule.$.division, true, false);
            rooms.push(room);
        });
    }
    if (rooms.length > 0) {
        rooms = _.uniqWith(rooms, _.isEqual);
    }
    return rooms;
}

function getSchedules(scheduleList) {
    var schedules = [];
    if (scheduleList) {
        scheduleList.forEach(function (schedule) {
            var games = getGames(schedule);
            var scheduleModel = new Schedule(schedule.$.id, schedule.$.date, schedule.$.sport,
                schedule.$.division, schedule.$.title, games, false);
            schedules.push(scheduleModel);
        });
    }
    return schedules;
}

function getGames(schedule) {
    var games = [];
    if (schedule && schedule.game) {
        schedule.game.forEach(function (game) {
            var participants = getParticipants(game);
            var total = getTotal(game);
            var gameModel = new Game(game.$.id, game.$.time, participants, total);
            games.push(gameModel);
        });
    }
    return games;
}

function getParticipants(game) {
    var participants = [];
    if (game && game.participant) {
        game.participant.forEach(function (participant) {
           var line = getLine(participant);
           var participantModel = new Participant(participant.$.rotation_number, participant.$.name, line); 
           participants.push(participantModel);
        });
    }
    return participants;
}

function getLine(participant) {
    var lineModel = null;
    if (participant && participant.line[0]) {
        var line = participant.line[0];
        lineModel = new Line(line.$.publisher, line.$.money_line, line.$.spread, line.$.spread_odds);
        return lineModel;
    }
    return lineModel;
}

function getTotal(game) {
    var totalModel = null;
    if (game && game.total && game.total[0]) {
        var total = game.total[0];
        totalModel = new Total(total.$.publisher, total.$.over_odds, total.$.under_odds, total.$.value);
        return totalModel;
    }
    return totalModel;
}

