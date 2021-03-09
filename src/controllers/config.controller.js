const service = require('../services/config.service');

module.exports = {
    async getRooms() {
      return await service.getRooms();
    },
};
