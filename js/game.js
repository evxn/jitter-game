// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 800;
document.body.appendChild(canvas);

// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
	bgReady = true;
};
bgImage.src = "images/field.png";

// Hero image
var heroReady = false;
var heroImage = new Image();
heroImage.onload = function () {
	heroReady = true;
};
heroImage.src = "images/greeboy.png";

// dog image
var dogReady = false;
var dogImage = new Image();
dogImage.onload = function () {
	dogReady = true;
};
dogImage.src = "images/grumpydog.png";

// dog image
var dogHouseReady = false;
var dogHouseImage = new Image();
dogHouseImage.onload = function () {
	dogHouseReady = true;
};
dogHouseImage.src = "images/doghouse.png";

// Game objects
var hero = {
	speed: 18 // movement in pixels per second
};

var dogs = [];
var lvl = 1;
var dogsCount = 1;

// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

function init() {
	hero.x = canvas.width-160;
	hero.y = canvas.height-140;

	// Throw the dog somewhere on the screen randomly
	reset();
};


// Reset the game when the player catches a dog
function reset() {
	dogsCount = Math.round(Math.log(3*lvl) + Math.abs(Math.sin(lvl))* lvl/3);
	// Throw the dog somewhere on the screen randomly
	for(var i = 0; i<dogsCount; i++){
		dogs.push({})
	}

	dogs.forEach(function(dog){
		dog.x = -dogsCount*40 + (Math.random() *40*dogsCount);
		dog.y = 70 + (Math.random() * (canvas.height - 200));
	});
};

// Update game objects
var update = function (modifier) {
	modifier += 0.002*lvl;

	if (38 in keysDown) { // Player holding up
		hero.y -= hero.speed * modifier;
	}
	if (40 in keysDown) { // Player holding down
		hero.y += hero.speed * modifier;
	}
	if (37 in keysDown) { // Player holding left
		hero.x -= hero.speed * modifier;
		// hero.y += 12*Math.sin(hero.x/2.3)*modifier;;
	}
	if (39 in keysDown) { // Player holding right
		hero.x += hero.speed * modifier;
		// hero.y += 12*Math.sin(hero.x/2.3)*modifier;;
	}


	// Are they touching?
	dogs.forEach(function(dog, i, dogs){
		dog.x+= 14*modifier;
		dog.y+= 18*Math.sin(dog.x/2.3)*modifier;

		if (
			hero.x <= (dog.x+32)
			&& dog.x <= (hero.x + 128)
			&& hero.y <= (dog.y+32)
			&& dog.y <= (hero.y + 128)
		) {
			// dogs.pop();
			dogs = dogs.splice(i, 1);
		}
	});

	if (dogs.length === 0) {
		lvl+=1;
		reset();
	}
};

// Draw everything
var render = function () {
	if (bgReady) {
		ctx.drawImage(bgImage, 0, 0);
	}

	if (heroReady) {
		ctx.drawImage(heroImage, hero.x, hero.y);
	}

	if (dogReady) {
		dogs.forEach(function(dog){
			ctx.drawImage(dogImage, dog.x, dog.y);
		});
	}

	if (dogHouseReady) {
		ctx.drawImage(dogHouseImage, canvas.width-160, canvas.height-230);
	}

	// Score
	ctx.fillStyle = "rgb(255, 50, 0)";
	ctx.font = "68px Unkempt";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Jitter: lvl" + lvl, 32, 0);
};

// The main game loop
var main = function () {
	var now = Date.now();
	var delta = now - then;

	update(delta / 300);
	render();

	then = now;

	// Request to do this again ASAP
	requestAnimationFrame(main);
};

// Cross-browser support for requestAnimationFrame
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

// Let's play this game!
var then = Date.now();
init();
main();
