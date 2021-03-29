
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
    async getSchedulesByConfigurationCode(req, res) {
        try {
            var response = await service.getByConfigurationCode(req.params.code);
            return res.status(200).json(response);
        } catch (e) {
            throw e;
        }
    }
};
