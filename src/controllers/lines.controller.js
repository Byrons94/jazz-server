const service = require('../services/line.service');

module.exports = {
    async loadLines(req, res) {
        try {
            var response = await service.loadLines();
            return res.status(200).json({ status: 200, data: response});
        } catch (e) {
            res.status(500).send({ message: 'Internal Server Error: ' + e.message })
        }
    },
    async load() {
        return await service.loadLines();
    },
};
