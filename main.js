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
finger.alpha = 0.6;
stage.addChild(finger);

var start = new createjs.Shape();
start.graphics.beginFill("yellow").drawRect(0, 0, 20, 80);
stage.addChild(start);

var finish = new createjs.Shape();
finish.graphics.beginFill("green").drawRect(stage.canvas.width-100, stage.canvas.height/2, 20, 80);
stage.addChild(finish);

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

var log = function(str, cons) {
     document.getElementById('out').innerHTML = "<pre>" + str + "</pre>";
     if(cons){
        console.log(str);
     }
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

    finger.x = newX - 10;
    finger.y = newY - 10;

    createjs.Tween.removeTweens(circle);
    createjs.Tween.get(circle, { override:true })
        .to({
            x: newX,
            y: newY
        }, 4000, createjs.Ease.backOut);

}

function mouseLoop(){
    //console.log('mouseLoop', mouseEvent);
    if(mouseEvent && mouseEvent.x && mouseEvent.y){
        log(mouseEvent);
        setPositions(mouseEvent);
    }
}

var mouseEvent = false;

setTimeout(function() {
    if(!leapWorks){
        log("leap doesn't work", true);
        stage.canvas.addEventListener('mousemove', function(e){
            //console.log('mousemove event', e);
            mouseEvent = e;
        }, false);

        createjs.Ticker.addEventListener("tick", mouseLoop);

    }else{
        log('Leap Motion works', true);
    }
}, 1000);


createjs.Sound.addEventListener("fileload", createjs.proxy(this.loadHandler, this));
//from http://openmusicarchive.org/browse_tag.php?tag=classical
 createjs.Sound.registerSound("Intro_And_Tarantelle.mp3", "sound");
 function loadHandler(event) {
     // This is fired for each sound that is registered.
     var instance = createjs.Sound.play("sound");  // play using id.  Could also use full sourcepath or event.src.
     instance.addEventListener("complete", createjs.proxy(this.handleComplete, this));
     instance.setVolume(0.5);
 }
