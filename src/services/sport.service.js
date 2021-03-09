const cacheManager = require('../cache/manager.service');
const _ = require('lodash');

module.exports = {
    async getSportsAsTree() {
        var sports = [];
        var data = JSON.parse(getChachedData('schedules'));
        if (data) {
            sports = getSports(data);
        }
        return sports;
    }
};

function getChachedData(key) {
    return cacheManager.get(key);
}   

function getSports(list) {
    var sports = [];
    var sportsList = _.uniqBy(list, 'sport').map(function (obj) { return obj.sport });
    sportsList.forEach(function (sportName) {
        var sportModel = {
            name: sportName,
            divisions: []
        }
        sportModel.divisions = getDivisionsBySport(list, sportName);
        sports.push(sportModel);
    });
    return sports;
}

function getDivisionsBySport(list, sportName) {
    var divisions = [];
    var divisionsBySport = _.uniqBy(_.filter(list, function (schedule) { return schedule.sport == sportName }), 'division').map(function (obj) { return obj.division });
    divisionsBySport.forEach(function (divisionName) {
        var divisionModel = {
            name: divisionName,
            titles: []
        };
        divisionModel.titles = getTitlesByDivision(list, sportName, divisionName);
        divisions.push(divisionModel);
    });
    return divisions;
}

function getTitlesByDivision(list, sportName, divisionName) {
    var titles = [];
    var titlesByDivision = _.filter(list, function (schedule) { return schedule.sport == sportName && schedule.division == divisionName })
        .map(function (obj) { return obj.title });
    titlesByDivision.forEach(function (titleName) {
        titles.push({
            name: titleName
        });
    });
    return titles;
}