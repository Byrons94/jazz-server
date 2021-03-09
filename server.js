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
var io = require('socket.io')(http,  {
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
const { count } = require('./src/models/user.model');

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

    app.use('/api', require('./src/routes/routes'));
    // routes
    require('./src/routes/auth.routes')(app);
    require('./src/routes/user.routes')(app);

    app.get('*', (req, res) => {
      console.log(req.url)
      res.sendFile(path.join(__dirname, 'dist/index.html'));
    });

  
    lineController.load();
    io.on('connection', async (socket) => {
      //TEMPORAL, verificar si hay alguien escuchando por room para enviar mensaje
      setInterval(function() {
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
      }, parseInt(config.socket.notifyEvery) * 1000);
     

      socket.on('subscribe', function(room) { 
        console.log('joining room', room);
        socket.join(room); 
      });
      
      socket.on('unsubscribe', function(room) {  
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

    //testing
    initial();
  }
})

const Role = require('./src/models/role.model')
const demoConfig = require('./src/services/plasma-configuration.service')
function initial() {
  // Role.count((err, count) => {
  //   if (!err && count === 0) {
  //     new Role({
  //       name: "admin"
  //     }).save(err => {
  //       if (err) {
  //         console.log("error", err);
  //       }
  //       console.log("added 'admin' to roles collection");
  //     });
  //   }
  // });
  // demoConfig.saveTestModel();
}
