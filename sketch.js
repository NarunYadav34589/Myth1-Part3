var PLAY = 1;
var END = 0;
var gameState = PLAY;

var arrow, arrowImage;
var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4;
var backgroundImg
var score = 0;
var jumpSound, collidedSound;

var gameOver, restart;


function preload() {
  jumpSound = loadSound("assets/sounds/jump.wav")
  collidedSound = loadSound("assets/sounds/collided.wav")

  backgroundImg = loadImage("assets/good.jpg")
 

  trex_running = loadAnimation("assets/ramji.png");


  obstacle1 = loadImage("assets/k1.png");
  obstacle2 = loadImage("assets/k2.png");
  obstacle3 = loadImage("assets/k1.png");
  obstacle4 = loadImage("assets/k2.png");

  gameOverImg = loadImage("assets/oops.png");
  restartImg = loadImage("assets/final2.png");
  arrowImage = loadImage("assets/ARROW (2).png");
}

function setup() {
  createCanvas(1360, 600);

  trex = createSprite(150, 491);
 

  trex.addAnimation("running", trex_running);
  //trex.debug=true
  trex.setCollider('rectangle', 0, 0, 1500,2500)
  trex.scale = 0.07;
 

  invisibleGround = createSprite(188, 510, 20000, 10);
  invisibleGround.visible=false;

  ground = createSprite(115, 513,80000,0.1);
  gameOver = createSprite(633, 216);
  gameOver.addImage(gameOverImg);


  restart = createSprite(644, 324);
  restart.addImage(restartImg);

  gameOver.scale = 0.2;
  restart.scale = 0.15;

  gameOver.visible = false;
  restart.visible = false;


  // invisibleGround.visible =false
  obstaclesGroup = new Group();
 
  score = 0;
  arrowGroup= new Group();
}

function draw() {
  //trex.debug = true;
  background(backgroundImg);
  textSize(20);
  fill("black")
  text("Score: " + score, 30, 50);
  text(mouseX + ',' + mouseY, 33, 23);

  if (gameState === PLAY) {
    
  // release arrow when space key is pressed
  if (keyDown("space")) {
    createArrow();
  }

  if (arrowGroup.isTouching(obstaclesGroup)) {
    obstaclesGroup.destroyEach();
    arrowGroup.destroyEach();
      score=score+1;
  }

    score = score + Math.round(getFrameRate() / 60);

    //trex.velocityY = trex.velocityY + 0.8

    if (ground.x < 0) {
      ground.x = ground.width / 2;
    }

    trex.collide(invisibleGround);
    spawnObstacles();

    if (obstaclesGroup.isTouching(trex)) {
      collidedSound.play()
      
      gameState = END;
    }
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    if(mousePressedOver(restart)) {
      reset();
    }
    //set velcity of each game object to 0
    ground.velocityX = 0;
    trex.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
  
    obstaclesGroup.destroyEach();
  }

  drawSprites();
}

function spawnObstacles() {
  if (frameCount % 100 === 0) {
    var obstacle = createSprite(1300, 370);
    obstacle.setCollider('circle', 0, 0, 645)
    // obstacle.debug = true
    
    obstacle.velocityX = -(6 + 16 * score / 100);

    //generate random obstacles
    var rand = Math.round(random(1, 2));
    switch (rand) {
      case 1: obstacle.addImage(obstacle1);
      
      
        break;
      case 2: obstacle.addImage(obstacle2);
     
        break;
      default: break;
    }

    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.13;
    obstacle.lifetime = 500;
    obstacle.depth = trex.depth;
    trex.depth += 1;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

// Creating  arrows for bow
function createArrow() {
  var arrow= createSprite(250, 367, 60, 10);
  arrow.addImage(arrowImage);
  //arrow.y=bow.y;
  arrow.velocityX = 10;
  arrow.lifetime = 500;
  arrow.scale = 0.07;
  arrowGroup.add(arrow);
   
}

function reset() {
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  obstaclesGroup.destroyEach();
  score = 0;

}
