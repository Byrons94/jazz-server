// --- server.js ---
// • This is the start (entry-point) of our application.
// • Mongoose is used to make communication with MongoDB easy and simple
// -----------------------------------------------------------------------------
const config = require('./src/config.json');
const express = require('express')
const cors = require('cors');
const path = require('path')
const bodyParser = require("body-parser");

const configController = require('./src/controllers/config.controller');
const scheduleController = require('./src/controllers/schedule.controller');
const lineController = require('./src/controllers/lines.controller');

// • Creating Express instance. Later we will use this to declare routes
const app = express()

var http = require('http').Server(app);
var io = require('socket.io')(http,
  {
    cors: {
      origin: config.cors.origins,
      credentials: true
    }
  });

var corsOptions = {
  origin: config.cors.origins,
  optionsSuccessStatus: 200 // For legacy browser support
}

const mongoose = require('mongoose');

// parse requests of content-type - application/json
app.use(bodyParser.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));


// • Connect to MongoDB database. Please be sure you have started MongoDB
// services before running application and replace `example-app` with your
// database's name.
mongoose.connect(config.mongoConnectionString, (err) => {
  if (err) {
    // We want to log if app can not connect to database
    console.log(err)
  } else { // If there is no error during db connection, continue proccess 

    app.use(express.static(path.join(__dirname, 'dist')))

    app.use(cors(corsOptions));

    app.use('/', function (req, res, next) {
      console.log('Time:', Date.now())
      next();
    });

    // routes
    app.use('/api', require('./src/routes/routes'));
    require('./src/routes/auth.routes')(app);
    require('./src/routes/user.routes')(app);

    app.get('*', (req, res) => {
      console.log(req.url)
      res.sendFile(path.join(__dirname, 'index.html'));
    });
    
    //initial load
    lineController.load();
    setInterval(function () {
        reloadLinesAndNotify();
    }, parseInt(config.socket.notifyEvery));


    io.on('connection', async (socket) => {
      socket.on('subscribe', function (room) {
        console.log('joining room', room);
        socket.join(room);
      });

      socket.on('unsubscribe', function (room) {
        console.log('leaving room', room);
        socket.leave(room);
      });
    })

    // • Start listening on port 3000 for requests.
    const PORT = 3000
    // var server = app.listen(PORT, () => console.log(`Application started successfully on port: ${PORT}!`))
    var server = http.listen(3000, () => {
      console.log('server is running on port', server.address().port);
    });
    
    initial();
  }
})


function reloadLinesAndNotify() {
  lineController.load().then(function () {
    configController.getRooms().then(function (rooms) {
      if (rooms.length > 0) {
        rooms.forEach(function (room) {
          var roomName = room.sport + ':' + room.division;
          scheduleController.getSchedulesByRoomName(roomName).then(function (result) {
            io.to(roomName).emit('onListen', JSON.stringify(result));
          });
        });
      }
    });
  });
}

const Role = require('./src/models/role.model')
const demoConfig = require('./src/services/plasma-configuration.service')

const userService = require('./src/services/user.service')
function initial() {
  Role.find({}, function(error, roles) {
    var roleAdmin = roles.find(x => x.name == 'admin');
    if (roleAdmin == undefined) {
      new Role({
        name: "admin"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }
        console.log("added 'admin' to roles collection");
      });
    } 

    var roleClient = roles.find(x => x.name == 'client');
    if (roleClient == undefined) {
      new Role({
        name: "client"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }
        console.log("added 'client' to roles collection");
      });
    }

    userService.saveTemplate();
  });
}
