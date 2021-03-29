const express = require('express')
const router = express.Router()
const lineContronller = require('../controllers/lines.controller');
const configController = require('../controllers/configuration.controller');
const sportController = require('../controllers/sport.controller');
const scheduleController = require('../controllers/schedule.controller');

// • declaring routes
router.get('/loadLines', lineContronller.loadLines);

//configuration
router.post('/configuration/', configController.save);
router.get('/configuration/:code', (req, res) => {
  return configController.get(req, res);
});
  
router.get('/configuration/:code/schedules', (req, res) => {
  return scheduleController.getSchedulesByConfigurationCode(req, res);
});

router.get('/configuration/user/:userid', (req, res) => {
  return configController.getAll(req, res);
});

router.get('/configuration/:code/isValid', (req, res) => {
  return configController.validConfigurationCode(req, res);
});

router.get('/sports/tree', (req, res) => {
  return sportController.getSportsAsTree(req, res);
});

router.delete('/configuration/:id', configController.delete);

module.exports = router;
