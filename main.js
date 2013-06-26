/*global createjs:true, require:true */


//Create a stage by getting a reference to the canvas
var stage = new createjs.Stage('can');
stage.canvas.width = window.innerWidth;
stage.canvas.height = window.innerHeight;

//Create a Shape DisplayObject.
var circle = new createjs.Shape();
circle.graphics.beginFill("red").drawCircle(0, 0, 40);

//Set position of Shape instance.
circle.x = circle.y = 50;

//Add Shape instance to stage display list.
stage.addChild(circle);

var finger = new createjs.Shape();
finger.graphics.beginFill("yellow").drawCircle(0, 0, 15);
finger.x = finger.y = 50;
finger.alpha = .5;
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
     document.getElementById('out').innerHTML = "<pre>" + str + "</pre>";
};

var diffX, diffY, maxMomentum=50, momentum=maxMomentum;

var leapWorks = false;

var lastPos = {x: 0, y: 0};

Leap.loop(function(frame) {

    cursor(frame);

    leapWorks = true;

    var pos = frame.cursorPosition;
    log(pos);
    var newPos = {
        x: stage.canvas.width/2 + (stage.canvas.width * 3 * pos.x/400),
        y: stage.canvas.height -  (stage.canvas.height * 3 * pos.y/400) + 300
    };
    if(lastPos.x != newPos.x || lastPos.y != newPos.y){
        setPositions(pos);
        lastPos = newPos;
    }

    //done();

});

function setPositions(pos){

    var newX = pos.x;
    var newY = pos.y;

    finger.x = newX;
    finger.y = newY;

    createjs.Tween.removeTweens(circle);
    createjs.Tween.get(circle, { override:true })
        .to({
            x: newX,
            y: newY
        }, 1000, createjs.Ease.backOut).call(tweenComplete);

}


function tweenComplete(){
    console.log('animation complete')
}

function mouseLoop(){
    //console.log('mouseLoop', mouseEvent);
    if(mouseEvent && mouseEvent.x && mouseEvent.y){
        setPositions(mouseEvent);
    }
}

var mouseEvent = false;

setTimeout(function() {
    if(!leapWorks){
        stage.canvas.addEventListener('mousemove', function(e){
            //console.log('mousemove event', e);
            mouseEvent = e;
        }, false);

        createjs.Ticker.addEventListener("tick", mouseLoop);

    }
}, 100);
