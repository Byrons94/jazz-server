var UserModel = require('../models/user.model');
const db = require("../models");
var ObjectID = require('mongodb').ObjectID;
const User = db.user;
const Role = db.role;
// var bcrypt = require("bcryptjs");
// const mailService = require('./mail.service');


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
      email: user.email,
      password: user.password.replace(/./g, '*').slice(0,6) 
    });
  });
  return result;
};

exports.getUserPassword = async (id) => {
  return await UserModel.findOne(
    {
      _id: ObjectID(id),
      active: true
    }, function (err, user) {
      if (err) throw err;
      if (user) {
        return {
          password: user.password
        };
      }
      return null;
    });
};

exports.getById = async (id) => {
  return await UserModel.findOne({ _id: ObjectID(id) })
    .populate("roles")
    .then(function(user, err) {
      if (err) throw err;
      if (user) {
        return {
          id: user._id,
          username: user.username,
          email: user.email,
          roles: user.roles
        };
      }
     });
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
  const tmpPwd = generateRandomString();
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    active: true,
    password: tmpPwd
  });

  user.save((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    Role.findOne({ name: req.body.roles[0].name }, (err, role) => {
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
  return "123456";
  // var result           = '';
  // var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  // var charactersLength = characters.length;
  // for ( var i = 0; i < 6; i++ ) {
  //    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  // }
  // return result;
}

exports.saveTemplate = () => {
  User.count((err, count) => {
    if (!err && count === 0) {
      const tmpPwd = "123456"; 
      const user = new User({
        username: "admin",
        email: "admin@admin.com",
        active: true,
        password: tmpPwd
      });
    
      user.save((err, user) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
        Role.findOne({ name: "admin" }, (err, role) => {
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
            return user;
          });
        });
      });
    }
  });
}
