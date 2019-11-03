/*
 3v    5v
 02    5v
 03    G
 04    14
 G     15
-17    18
-27    G
-22    23-
 3v    24-
-10    G
-09    25-
-11    08
 G     07
 xx    xx
 05    G
 06    12-
 13    G
 19    16
-26    20-
 G     21-
*/

/*
9
10
11
12
17
20
21
22
23
24
25
26
27
*/

var pins_a = [9,10,11,12,17,20,21,22,23,24,25,26,27];

var on_button = function(err, value, id){
    if (err) {
        console.log('Error on pin ' + id);
        console.error(err);
        return;
    };
    var payload = {};
    payload.type = 'button';
    payload.id = id;
    broadcast(JSON.stringify(payload));
};

var p1 = new Gpio(9 , 'in', 'both');
var p2 = new Gpio(10, 'in', 'both');
var p3 = new Gpio(11, 'in', 'both');
var p4 = new Gpio(12, 'in', 'both');
var p5 = new Gpio(17, 'in', 'both');
var p6 = new Gpio(20, 'in', 'both');
var p7 = new Gpio(21, 'in', 'both');
var p8 = new Gpio(22, 'in', 'both');
var p9 = new Gpio(23, 'in', 'both');
var p10 = new Gpio(24, 'in', 'both');
var p11 = new Gpio(25, 'in', 'both');
var p12 = new Gpio(26, 'in', 'both');
var p13 = new Gpio(27, 'in', 'both');

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

