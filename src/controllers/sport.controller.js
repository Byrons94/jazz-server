const service = require('../services/sport.service');

module.exports = {
    async getSportsAsTree(req, res) {
        try {
            var response = await service.getSportsAsTree();
            return res.status(200).json(response);
        } catch (e) {
            res.status(500).send({ message: 'Internal Server Error: ' + e.message })
        }
    },
};
