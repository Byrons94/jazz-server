var service = require('../services/user.service');


exports.userBoard = (req, res) => {
  res.status(200).send("User Content.");
};

exports.getAll = async (req, res) => {
  try {
    var response = await service.getAll();
    return res.status(200).json(response);
  } catch (e) {
    res.status(500).send({ message: 'Internal Server Error: ' + e.message })
  }
};

exports.getByEmail = async (req, res) => {
  try {
    var user = null;
    var response = await service.getByEmail(req.params.email);
    if (response) {
      user = {
        username: response.username,
        email: response.email
      };
    }
    return res.status(200).json(user);
  } catch (e) {
    res.status(500).send({ message: 'Internal Server Error: ' + e.message })
  }
};

exports.save = async (req, res) => {
  try {
    var response = await service.save(req, res);
    return res.status(200).json(response);
  } catch (e) {
    res.status(500).send({ message: 'Internal Server Error: ' + e.message })
  }
};

exports.delete = async (req, res) => {
  try {
    var response = await service.delete(req.params.id);
    return res.status(200).json(response);
  } catch (e) {
    res.status(500).send({ message: 'Internal Server Error: ' + e.message })
  }
};