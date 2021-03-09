var UserModel = require('../models/user.model');
const db = require("../models");
var bcrypt = require("bcryptjs");
const mailService = require('./mail.service');
var ObjectID = require('mongodb').ObjectID;

const User = db.user;
const Role = db.role;

exports.getAll = async () => {
  var result = [];
  var users = await UserModel.find({active: true}, function (err, users) {
    if (err) throw err;
    return users;
  });
  users.forEach(function (user) {
    result.push({
      id: user._id,
      username: user.username,
      email: user.email
    });
  });
  return result;
};

exports.getByEmail = async (email) => {
   return await UserModel.findOne(
    {
      email: email,
      active: true
    }, function (err, user) {
      if (err) throw err;
      if (user) {
        return {
          id: user._id,
          username: user.username,
          email: user.email
        };
      }
      return null;
    });
};

exports.delete = async (id) => {
  return await UserModel.updateOne(
   { _id: ObjectID(id) }, 
   { active: false }, 
   function (err, user) {
     if (err) throw err;
     return true;
   });
};

exports.save = async (req, res) => {
  const tmpPwd = "123456"; //generateRandomString();
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    active: true,
    password: bcrypt.hashSync(tmpPwd, 6)
  });

  user.save((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    Role.findOne({ name: "user" }, (err, role) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      user.roles = [role._id];
      user.save(err => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
        //mailService.sendEmail(req.body.email);
        return user;
      });
    });
  });
};

function generateRandomString() {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < 6; i++ ) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}