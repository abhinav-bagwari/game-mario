// 8. importing images
import base from '../images/base.png'
import platform from '../images/platform.png'
import background from '../images/background.jpg'
import platformsmall from '../images/jump_platform.png'
import smalljump from '../images/small_jump.png'
import spriterunleft from '../images/spriteRunLeft.png'
import spriterunright from '../images/spriteRunRight.png'
import spritestandleft from '../images/spriteStandLeft.png' 
import spritestandright from '../images/spriteStandRight.png'


// loading sound using howler js

const { Howl } = require('howler');
const intro = new Howl({
  src: ['./music/intromusic.mp3'],
   autoplay: true,
   loop: true,
});
const jump = new Howl({
  src: ['./music/jump.mp3']
});
const fall = new Howl({
  src: ['./music/fall.mp3']
});


// 1. Project Setup
const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')


// takes full height and width of window obj
canvas.width = window.innerWidth
canvas.height = window.innerHeight

const gravity = 1.5                   // creating global gravity
var difficulty = 0
const form = document.querySelector("form");
const scoreBoard = document.querySelector(".scoreBoard");
let scrollofset = 0                  // initializing end point

// Event Listener for Difficulty form
document.querySelector("input").addEventListener("click", (e) => {
  e.preventDefault();
 
 // making form invisble
  form.style.display = "none";
  
  // making scoreBoard visble
  scoreBoard.style.display = "block";
  
  //  getting diffculty selected by user
  const choose_speed = document.getElementById("speed").value;
  if (choose_speed === "Easy") {
      player.speed = 15
  }
  if (choose_speed === "Medium") {
      player.speed = 22
  }
  if (choose_speed === "Hard") {
      player.speed = 30
  }
});

//Game Over
const gameoverLoader = () => {
  // Creating endscreen div and play again button and high score element
  const gameOverBanner = document.createElement("div");
  const gameOverBtn = document.createElement("button");
  const highScore = document.createElement("div");

  highScore.innerHTML = `High Score : ${
    localStorage.getItem("highScore")
      ? localStorage.getItem("highScore")
      : scrollofset
  }`;

  const oldHighScore =
    localStorage.getItem("highScore") && localStorage.getItem("highScore");

  if (oldHighScore < scrollofset) {
    localStorage.setItem("highScore", scrollofset);

    // updating high score html
    highScore.innerHTML = `High Score: ${scrollofset}`;
  }

  // adding text to playagain button
  gameOverBtn.innerText = "Play Again";
  gameOverBanner.appendChild(highScore);
  gameOverBanner.appendChild(gameOverBtn);

  // Making reload on clicking playAgain button
  gameOverBtn.onclick = () => {
    window.location.reload();
  };
  gameOverBanner.classList.add("gameover");
  document.querySelector("body").appendChild(gameOverBanner);
};



// 2. Player Creation
class Player {
   constructor(){

    this.speed = difficulty
    this.position = {
     x:100,
     y:100
    }
    this.velocity = {
     x: 0,
     y: 0              // y is pushing player down (positive increasing)
    }

    this.width = 66
    this.height = 150

    this.image = createImage(spritestandright)
    this.frames = 0  // what frame are we currently on 

    this.sprites = {
      stand:{
        right:createImage(spritestandright),
        left:createImage(spritestandleft),
        cropwidth: 177,
        width:66
      },
      run:{
        right: createImage(spriterunright),
        left: createImage(spriterunleft),
        cropwidth: 341,
        width:128
      }
    }
    this.currentsprite = this.sprites.stand.right
    this.currentcropwidth = 177
   }

   draw(){
    c.drawImage(
      this.currentsprite,
      this.currentcropwidth * this.frames,                         //with what position we begin cropping
      0,
      this.currentcropwidth,                 // cropped width of img -> 177
      400,                // cropped height of character
      this.position.x,
        this.position.y,
        this.width,
         this.height)
   }

   update() {
    this.frames++

    if(this.frames > 59 && (this.currentsprite === this.sprites.stand.right || this.currentsprite === this.sprites.stand.left) ) 
    this.frames = 0

    else if(this.frames > 29 && (this.currentsprite === this.sprites.run.right || this.currentsprite === this.sprites.run.left))
    this.frames = 0
    this.draw()
    this.position.x += this.velocity.x     // move player in x-direction
    this.position.y += this.velocity.y     // move player in y-direction
    
    if(this.position.y + this.height + this.velocity.y <= canvas.height)
    this.velocity.y += gravity     // accelerating velocity overtime due to  gravity
    
   }
}


class Platform {           // 5. create a platform where player will move
 constructor ({x, y, image}) {
 this.position = {
   x,
   y
 }

 this.image = image
 this.width = image.width
 this.height = image.height
 }
 draw() {
   c.drawImage(this.image, this.position.x, this.position.y)
 }
}


class GenericObject {           
 constructor ({x, y, image}) {
 this.position = {
   x,
   y
 }

 this.image = image
 this.width = image.width
 this.height = image.height

 
 }
 draw() {
   c.drawImage(this.image, this.position.x, this.position.y)
 }
}


 

function createImage(imageSrc) {
const image = new Image()
image.src = imageSrc
return image
}

let platformImage = createImage(platform)
let platformsmalltall = createImage(platformsmall)
let baseplatform = createImage(base)

let player = new Player()    // creating player object
let platforms =  []     
let genricobjects = []
let lastkey


const keys = {                // initially right and left keys are not pressed
 right: {
  pressed: false
 },
 left : {
  pressed: false
 }
}


function init(){
//  platformImage = createImage(platform)
 

 player = new Player()
 platforms =  [
   new Platform({
    x: platformImage.width * 4 + 300 + platformImage.width - platformsmalltall.width,                   // created long platform
    y: 300,
    image: createImage(platformsmall)
  }),
   new Platform({
    x: platformImage.width * 6 + 750 + platformImage.width - platformsmalltall.width,                   // created long platform
    y: 300,
    image: createImage(smalljump)
  }),
  new Platform({
    x: platformImage.width * 8 + 1200 + platformImage.width - platformsmalltall.width,                   // created long platform
    y: 300,
    image: createImage(smalljump)
  }),
  new Platform({
    x: platformImage.width * 9 + 1215 + platformImage.width - platformsmalltall.width,                   // created long platform
    y: 450,
    image: createImage(smalljump)
  }),
  new Platform({
    x: platformImage.width * 10 + 1225 + platformImage.width - platformsmalltall.width,                   // created long platform
    y: 300,
    image: createImage(smalljump)
  }),
  new Platform({
    x: platformImage.width * 14 + 1700 + platformImage.width - platformsmalltall.width,                   // created long platform
    y: 300,
    image: createImage(platformsmall)
  }),
  new Platform({
    x: platformImage.width * 16 + 2100 + platformImage.width - platformsmalltall.width,                   // created long platform
    y: 300,
    image: createImage(smalljump)
  }),
  new Platform({
    x: platformImage.width * 17 + 2150 + platformImage.width - platformsmalltall.width,                   // created long platform
    y: 200,
    image: createImage(smalljump)
  }),
  new Platform({
    x: platformImage.width * 22 + 3180 + platformImage.width - platformsmalltall.width,                   // created long platform
    y: 300,
    image: createImage(platformsmall)
  }),
  new Platform({
    x: platformImage.width * 24 + 3350 + platformImage.width - platformsmalltall.width,                   // created long platform
    y: 300,
    image: createImage(smalljump)
  }),
  new Platform({
    x: platformImage.width * 25 + 3360 + platformImage.width - platformsmalltall.width,                   // created long platform
    y: 300,
    image: createImage(smalljump)
  }),
  new Platform({
    x: platformImage.width * 26 + 3580 + platformImage.width - platformsmalltall.width,                   // created long platform
    y: 300,
    image: createImage(platformsmall)
  }),

  new Platform({                                  // creating array of multiple platform  1st one is basically ground
  x: 0, 
  y: 500,
  image: baseplatform
}), 
  new Platform({
    x: platformImage.width, 
    y: 500,
    image: baseplatform
  }),
  new Platform({
    x: platformImage.width * 2 + 200,                   // created long platform
    y: 500,
    image: baseplatform
  }),
  new Platform({
    x: platformImage.width * 3 + 400,                   // created long platform
    y: 500,
    image: baseplatform
  }),
  new Platform({
    x: platformImage.width * 4 + 300,                   // created long platform
    y: 500,
    image: baseplatform
  }),
  new Platform({
    x: platformImage.width * 5 + 750,                   // created long platform
    y: 500,
    image: baseplatform
  }),
  new Platform({
    x: platformImage.width * 7 + 1000, 
    y: 300,
    image: platformImage
  }),
  new Platform({
    x: platformImage.width * 11 + 1225 + platformImage.width - platformsmalltall.width,                   // created long platform
    y: 500,
    image: baseplatform
  }),
  new Platform({
    x: platformImage.width * 12 + 1350 + platformImage.width - platformsmalltall.width,                   // created long platform
    y: 300,
    image: platformImage
  }),
  new Platform({
    x: platformImage.width * 13 + 1550 + platformImage.width - platformsmalltall.width,                   // created long platform
    y: 300,
    image: platformImage
  }),
  new Platform({
    x: platformImage.width * 14 + 1700 + platformImage.width - platformsmalltall.width,                   // created long platform
    y: 500,
    image: baseplatform
  }),
  new Platform({
    x: platformImage.width * 15 + 2000 + platformImage.width - platformsmalltall.width,              // created long platform
    y: 500,
    image: baseplatform
  }),
  new Platform({
    x: platformImage.width * 18 + 2200 + platformImage.width - platformsmalltall.width,                   // created long platform
    y: 500,
    image: baseplatform
  }),
  new Platform({
    x: platformImage.width * 19 + 2400 + platformImage.width - platformsmalltall.width,                   // created long platform
    y: 500,
    image: baseplatform
  }),
  new Platform({
    x: platformImage.width * 20 + 2600 + platformImage.width - platformsmalltall.width,                   // created long platform
    y: 300,
    image: platformImage
  }),
  new Platform({
    x: platformImage.width * 21 + 2800 + platformImage.width - platformsmalltall.width,                   // created long platform
    y: 300,
    image: platformImage
  }),
  new Platform({
    x: platformImage.width * 22 + 3000 + platformImage.width - platformsmalltall.width,                   // created long platform
    y: 500,
    image: baseplatform
  }),
  new Platform({
    x: platformImage.width * 23 + 3300 + platformImage.width - platformsmalltall.width,                   // created long platform
    y: 500,
    image: baseplatform
  }),
   new Platform({
    x: platformImage.width * 26 + 3400 + platformImage.width - platformsmalltall.width,                   // created long platform
    y: 500,
    image: baseplatform
  }),
  new Platform({
    x: platformImage.width * 27 + 3700 + platformImage.width - platformsmalltall.width,                   // created long platform
    y: 500,
    image: baseplatform
  }),
  new Platform({
    x: platformImage.width * 27 + 3700 + platformImage.width,                  // created long platform
    y: 500,
    image: baseplatform
  })
]     


 genricobjects = [
  new GenericObject({
    x:-1,
    y:-1,
    image:createImage(background)
  })
]

 scrollofset = 0        // initializing end point

}

// 3. Gravity (adding velocity to our player at constructor class)

function animate(){
 requestAnimationFrame(animate)    // looping over same function

 // Updating Player Score in Score board in html
  scoreBoard.innerHTML = `Score : ${scrollofset}`;

 c.fillStyle = 'white'
 c.fillRect(0, 0, canvas.width, canvas.height)
                   // adding y-axis again and again infinitely

 genricobjects.forEach((genericobject) => {
   genericobject.draw()
 })


 platforms.forEach((platform) => {
  platform.draw()
 })
 player.update()
 

 if (keys.right.pressed && player.position.x < 400){
  player.velocity.x = player.speed         // if right/left key is pressed move else stop
 }
 else if ((keys.left.pressed && player.position.x > 100) || (keys.left.pressed && scrollofset === 0 && player.position.x > 0)){
  player.velocity.x = -player.speed
}
else {
player.velocity.x = 0

if(keys.right.pressed){           //when player is moving right-> start moving the platform to the left 
  scrollofset += player.speed                   // if player moving right increament score

  // Rendering player Score in scoreboard html element
  scoreBoard.innerHTML = `Score : ${scrollofset}`;
  
  platforms.forEach((platform) => {
  platform.position.x -= player.speed
 }) 

   genricobjects.forEach((genericobject) => {
    genericobject.position.x -= (player.speed * 0.66)
  })

} else if (keys.left.pressed && scrollofset > 0){       // 6. Scroll the platform
  scrollofset -= player.speed                      // if left decreament
  
  // Updating Player Score in Score board in html
  scoreBoard.innerHTML = `Score : ${scrollofset}`;

  platforms.forEach((platform) => {
  platform.position.x += player.speed
 })

 genricobjects.forEach((genericobject) => {              
    genericobject.position.x += (player.speed * 0.66)
  }) 
  }
}

// platform collision detection

platforms.forEach((platform) => {

if ( player.position.y + player.height <= platform.position.y && player.position.y + player.height + player.velocity.y >= platform.position.y && player.position.x + player.width >= platform.position.x && player.position.x <= platform.position.x + platform.width)
 {
  player.velocity.y = 0
}
})


// Sprite Switching
if(
  keys.right.pressed && lastkey === 'right' && player.currentsprite !== player.sprites.run.right){
  player.frames = 1
  player.currentsprite = player.sprites.run.right
   player.currentcropwidth = player.sprites.run.cropwidth
   player.width = player.sprites.run.width
}
else if (keys.left.pressed && lastkey === 'left' && player.currentsprite !== player.sprites.run.left){
   player.currentsprite = player.sprites.run.left
   player.currentcropwidth = player.sprites.run.cropwidth
   player.width = player.sprites.run.width
}
else if (!keys.left.pressed && lastkey === 'left' && player.currentsprite !== player.sprites.stand.left){
   player.currentsprite = player.sprites.stand.left
   player.currentcropwidth = player.sprites.stand.cropwidth
   player.width = player.sprites.stand.width
}
else if (!keys.right.pressed && lastkey === 'right' && player.currentsprite !== player.sprites.stand.right){
   player.currentsprite = player.sprites.stand.right
   player.currentcropwidth = player.sprites.stand.cropwidth
   player.width = player.sprites.stand.width
}


if(scrollofset > platformImage.width * 27 + 3700 ){             // 7. win scenario
console.log("you win")
}                        


if(player.position.y > canvas.height){        // Lose Scenario 
  fall.play()
   init()
   return gameoverLoader()
 }
}

init()
 animate()

// 4. PLayer Movement

window.addEventListener('keydown', ({keyCode}) => {       // keys are pressed now 

 switch(keyCode){
  case 37:
   console.log('left')
   keys.left.pressed = true
   lastkey = 'left'
   break

   case 40:
   console.log('down')
  //  player.velocity.y += 2000
   break

   case 39:
   console.log('right')
   keys.right.pressed = true
   lastkey = 'right'
   break

   case 38:
   console.log('up')
   jump.play()
   player.velocity.y -= 25
   break

 }
})

window.addEventListener('keyup', ({ keyCode }) => {   // keys are not pressed

 switch(keyCode){
  case 37:
   console.log('left')
   keys.left.pressed = false
   break

   case 40:
   console.log('down')
   break

   case 39:
   console.log('right')
   keys.right.pressed = false
   break

   case 38:
   console.log('up')
   break
 }
})
