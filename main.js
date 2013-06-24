/*global createjs:true, require:true */


//Create a stage by getting a reference to the canvas
var stage = new createjs.Stage('can');
stage.canvas.width = window.innerWidth;
stage.canvas.height = window.innerHeight;

//Create a Shape DisplayObject.
var circle = new createjs.Shape();
circle.graphics.beginFill("green").drawCircle(0, 0, 40);

//Set position of Shape instance.
circle.x = circle.y = 50;

//Add Shape instance to stage display list.
stage.addChild(circle);

var finger = new createjs.Shape();
finger.graphics.beginFill("red").drawCircle(0, 0, 15);
finger.x = finger.y = 50;
stage.addChild(finger);

//Update stage will render next frame
stage.update();

//Update stage will render next frame
//http://www.createjs.com/Docs/EaselJS/classes/Ticker.html
createjs.Ticker.addEventListener("tick", handleTick);
createjs.Ticker.setFPS ( 30 );

function handleTick() {

    if (circle.x > stage.canvas.width) { circle.x = stage.canvas.width ; }
    if(circle.x < 0) circle.x = 0;
    if (circle.y > stage.canvas.height) { circle.y = stage.canvas.height; }
    if(circle.y < 0) circle.y = 0;
    stage.update();
}

var cursor = new Leap.UI.Cursor();

var log = function(str) {
     document.getElementById('out').innerHTML = "<pre>" + str + "</pre>"
}
    
var diffX, diffY, maxMomentum=50, momentum=maxMomentum;

var leapWorks = false;

Leap.loop(function(frame) {
    
    cursor(frame);
    
    leapWorks = true;

    var pos = frame.cursorPosition;
    log(pos);
    var newPos = {
        x: stage.canvas.width/2 + (stage.canvas.width * 3 * pos.x/400),
        y: stage.canvas.height -  (stage.canvas.height * 3 * pos.y/400) + 300
    }
    setPositions(pos);
    //done();

});
    var speed = 2.5;
function setPositions(pos){
    if(pos && pos.x && pos.y){
        
        
        momentum += (momentum < maxMomentum) ? 1 : 0;
        //-200 => +200
        var newX = pos.x;
        var diffX = newX - circle.x;
        circle.x += (diffX >0) ? Math.min(diffX, speed) : Math.max(diffX, -speed);
        //+400 (max 500)
        // +20 (min 0)
        var newY = pos.y;
        diffY = newY - circle.y;
        circle.y += (diffY >0) ? Math.min(diffY, speed) : Math.max(diffY, -speed);
        
        finger.x = newX;
        finger.y = newY;
          
    }else if(momentum > 0) {
        var mom = (momentum--)/maxMomentum;
        circle.x += ((diffX >0) ? speed : -speed) * mom;
        circle.y += ((diffY >0) ? speed : -speed) * mom;
        circle.color = "purple";
        //finger.x = newX;
        //finger.y = newY;
    }
}

function mouseLoop(){
    console.log('mouseLoop', mouseEvent);
    if(mouseEvent && mouseEvent.x && mouseEvent.y){
        setPositions(mouseEvent);
    }
}

var mouseEvent = false;

setTimeout(function() {
    if(!leapWorks){
        stage.canvas.addEventListener('mousemove', function(e){
            console.log('mousemove event', e);
            mouseEvent = e;
        }, false);
        
        createjs.Ticker.addEventListener("tick", mouseLoop);
        
    }
}, 100);
