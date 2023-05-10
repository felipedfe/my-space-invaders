import Player from './classes/player.js';

const myCanvas = document.getElementById("myCanvas");
const backgroundImg = document.getElementById("background");
const playerSprite = document.getElementById("ship");
const enemySpriteSheet = document.getElementById("enemies");
let enemySpritePos = 0;
console.log(myCanvas)

window.ctx = myCanvas.getContext("2d");
console.log(ctx);

ctx.fillStyle = "#ecf53d";

export const CANVAS_WIDTH = 800;
export const CANVAS_HEIGHT = 500;


let player;
const playerWidth = 35;
const playerHeight = 45;