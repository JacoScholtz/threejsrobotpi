
// /Users/jacoscholtz/repos/threejsrobot/threejs/examples/webgl_animation_skinning_morph.html
// node robotserver.js
// http://localhost:40004/examples/webgl_animation_skinning_morph.html
// http://localhost:40004/examples/robot.html


// https://www.w3schools.com/nodejs/nodejs_raspberrypi_webserver_websocket.asp

//This server is for non frontend APIs
var express = require('express');
//var exphbs  = require('express-handlebars');
var path = require('path');
var http = require('http');
//var https = require('https');
//var request = require("request");
//var querystring = require('querystring');

var async = require('async');
var _ = require('lodash');

const WebSocket = require('ws');

//var Gpio = require('onoff').Gpio; //include onoff to interact with the GPIO
//var LED = new Gpio(4, 'out'); //use GPIO pin 4 as output
//var pushButton = new Gpio(17, 'in', 'both'); //use GPIO pin 17 as input, and 'both' button presses, and releases should be handled


//var methodOverride = require('method-override');

//var io = require('socket.io')(http) //require socket.io module and pass the http object (server)

var port = 40004;

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, authentication, X-API-KEY');
    res.header('Access-Control-Allow-Credentials', true);
    next();
};
var dontcache = function(req, res, next) {
    res.header("Cache-Control", "no-cache, no-store, must-revalidate");
    res.header("Pragma", "no-cache");
    res.header("Expires", 0);
    next();
};

var new_uuid_simple = function() {
    return Math.random().toString(26).slice(2);
};

//create express instance and set it up
var app = express();
app.set('port', port);

//app.use(rawBody);
//app.use(methodOverride());
app.use(allowCrossDomain);
app.use(dontcache);

app.get('*', express.static(path.join(__dirname, 'threejs')));

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({
//     extended: false
// }));

var server = http.createServer(app);

const wss = new WebSocket.Server({server, autoAcceptConnections: false});

wss.on('connection', function(ws, req){
    console.log('New Socket Connection: ', req.headers.origin);
    ws.uuid2 = new_uuid_simple();

    ws.on('message', function(data){
        console.log('message ', data);
    });

    ws.on('close', function(){
        console.log('Socket Closed: ', req.headers.origin);
    });

    ws.on('error', function(err){
        if(err.code !== 'ECONNRESET') {
            console.log('Errored: ',err);
        }
    });
});



// log all sockets connected
// setInterval(function(){
//     console.log('***Connected***');
//     wss.clients.forEach(function(s){
//         console.log('uuid ', s.uuid);
//     });
// }, 5000)


server.listen(app.get('port'), function(){
    console.log('listening on port ' + app.get('port'));
    timerint = setTimeout(timerf, 2*1000);
});

var broadcast = function(data){
    try {
        wss.clients.forEach(function(s){
            //console.log('uuid ', s.uuid2, s.readyState);
            s.send(data);
        });

    } catch(err){

    }
}

var states = [ 'Idle', 'Walking', 'Running', 'Dance', 'Death', 'Sitting', 'Standing' ];
var emotes = [ 'Jump', 'Yes', 'No', 'Wave', 'ThumbsUp' ];
var expressions = ['Angry', 'Surprised', 'Sad'];

var state_id = 0;
var timerint;
var timerf = function(){
    state_id = state_id + 1;
    if(state_id == states.length){
        state_id = 0;
    }
    var payload = {};
    payload.type = 'state';
    payload.value = states[state_id];
    broadcast(JSON.stringify(payload));
    timerint = setTimeout(timerf, 3*1000);
}

// pushButton.watch(function (err, value) { //Watch for hardware interrupts on pushButton
//     if (err) { //if an error
//         console.error('There was an error', err); //output error message to console
//         return;
//     }
//     var payload = {};
//     payload.type = 'emote';
//     payload.value = 'Wave';
//     broadcast(JSON.stringify(payload));
// });

process.on('SIGINT', function () { //on ctrl+c
    wss.close();
    //LED.writeSync(0); // Turn LED off
    //LED.unexport(); // Unexport LED GPIO to free resources
    //pushButton.unexport(); // Unexport Button GPIO to free resources
    process.exit(); //exit completely
});


