
// /Users/jacoscholtz/repos/threejsrobot/threejs/examples/webgl_animation_skinning_morph.html
// node robotserver.js
// http://localhost:40004/examples/webgl_animation_skinning_morph.html
// http://localhost:40004/examples/robot.html
// sudo apt-get install firefox-esr
// chromium-browser  --enable-webgl --ignore-gpu-blacklist

// https://www.w3schools.com/nodejs/nodejs_raspberrypi_webserver_websocket.asp

/*
1. use raspi-config to enable OpenGL (Full KMS)
2. remove "--disable-gpu-compositing'' from /etc/chromium-browser/customizations/00-rpi-var

is all you need to do to get the https://get.webgl.org cube spinning.
*/
 


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

var Gpio = require('onoff').Gpio; //include onoff to interact with the GPIO
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
    //timerint = setTimeout(timerf, 2*1000);
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

/*
var states = [ 'Idle', 'Walking', 'Running', 'Dance', 'Death', 'Sitting', 'Standing' ];
var emotes = [ 'Jump', 'Yes', 'No', 'Wave', 'ThumbsUp' ];
var expressions = ['Angry', 'Surprised', 'Sad'];
*/
/*
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
*/
/*
 pushButton.watch(function (err, value) { //Watch for hardware interrupts on pushButton
     if (err) { //if an error
         console.error('There was an error', err); //output error message to console
         return;
     }
     console.log('pushbutton ' + value);
     if(value == 1){
         var payload = {};
         payload.type = 'emote';
         payload.value = 'Jump';
         broadcast(JSON.stringify(payload));
     }
 });
*/

var on_button = function(err, value, id){
    if (err) {
        console.log('Error on pin ' + id);
        console.error(err);
        return;
    };
    console.log('button ' + id + ' ' + value);
    if(value == 1){
         var payload = {};
         payload.type = 'button';
         payload.id = id;
         broadcast(JSON.stringify(payload));
    }
};

var p1 = new Gpio(9 , 'in', 'both', {debounceTimeout: 10});
var p2 = new Gpio(10, 'in', 'both', {debounceTimeout: 10});
var p3 = new Gpio(11, 'in', 'both', {debounceTimeout: 10});
var p4 = new Gpio(12, 'in', 'both', {debounceTimeout: 10});
var p5 = new Gpio(17, 'in', 'both', {debounceTimeout: 10});
var p6 = new Gpio(20, 'in', 'both', {debounceTimeout: 10});
var p7 = new Gpio(21, 'in', 'both', {debounceTimeout: 10});
var p8 = new Gpio(22, 'in', 'both', {debounceTimeout: 10});
var p9 = new Gpio(23, 'in', 'both', {debounceTimeout: 10});
var p10 = new Gpio(24, 'in', 'both', {debounceTimeout: 10});
var p11 = new Gpio(25, 'in', 'both', {debounceTimeout: 10});
var p12 = new Gpio(26, 'in', 'both', {debounceTimeout: 10});
var p13 = new Gpio(27, 'in', 'both', {debounceTimeout: 10});

p1.watch(function(err, value){ on_button(err, value, 1); });
p2.watch(function(err, value){ on_button(err, value, 2); });
p3.watch(function(err, value){ on_button(err, value, 3); });
p4.watch(function(err, value){ on_button(err, value, 4); });
p5.watch(function(err, value){ on_button(err, value, 5); });
p6.watch(function(err, value){ on_button(err, value, 6); });
p7.watch(function(err, value){ on_button(err, value, 7); });
p8.watch(function(err, value){ on_button(err, value, 8); });
p9.watch(function(err, value){ on_button(err, value, 9); });
p10.watch(function(err, value){ on_button(err, value, 10); });
p11.watch(function(err, value){ on_button(err, value, 11); });
p12.watch(function(err, value){ on_button(err, value, 12); });
p13.watch(function(err, value){ on_button(err, value, 13); });


process.on('SIGINT', function () { //on ctrl+c
    wss.close();
    //LED.writeSync(0); // Turn LED off
    //LED.unexport(); // Unexport LED GPIO to free resources
    //pushButton.unexport(); // Unexport Button GPIO to free resources
    p1.unexport();
    p2.unexport();
    p3.unexport();
    p4.unexport();
    p5.unexport();
    p6.unexport();
    p7.unexport();
    p8.unexport();
    p9.unexport();
    p10.unexport();
    p11.unexport();
    p12.unexport();
    p13.unexport();
    process.exit(); //exit completely
});


