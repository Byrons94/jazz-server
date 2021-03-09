
const service = require('../services/schedule.service');

module.exports = {
    async getSchedulesByRoomName(roomName) {
        try {
            var response = await service.getSchedulesByRoomName(roomName);
            return response;
        } catch (e) {
            throw e;
        }
    },
};
