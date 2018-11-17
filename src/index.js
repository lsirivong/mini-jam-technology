import _ from 'lodash'
import Phaser from 'phaser'
import starUrl from './assets/star.png'
import level1Url from './assets/level-1.png'
import tilesetUrl from './assets/tileset.png'
import tiledJson from './tilemaps/level-1.json'
import updateFn from './update'
import Player from './player'
import Walls from './walls'

let state = {
  actors: {
    // walls: new Walls(),
    player: new Player(),
  },
  map: null
}


const GRID_WIDTH = 20
const GRID_HEIGHT = 16
const CELL_SIZE = 16

const EMPTY_HEX = '#ffffff'
const WALL_HEX  = '#000000'
const SPOT_HEX = '#00ff00'
const PLAYER_HEX = '#ff0000'
const EXIT_HEX = '#0000ff'

var EMPTY = 0;
var WALL = 1;
var SPOT = 2;
var EXIT = 3;
var PLAYER = 4;

var level = [];

function levelColorToObjectIndex(c) {
  const hex = Phaser.Display.Color.RGBToString(c.red, c.green, c.blue, c.alpha)
  switch (hex) {
    case EMPTY_HEX:
      return 0

    case WALL_HEX:
      return WALL

    case SPOT_HEX:
      return SPOT

    case EXIT_HEX:
      return EXIT

    case PLAYER_HEX:
      return PLAYER
  }

  return null
}

function loadLevelFromTexture(textures, key) {
  const level = []
  
  for (let i = 0; i < GRID_WIDTH; i++) {
    for (let j = 0; j < GRID_HEIGHT; j++) {
      if (!level[i]) {
        level[i] = []
      }

      const c = textures.getPixel(i, j, key);
      level[i][j] = levelColorToObjectIndex(c)
    }
  }

  return level
}

function preload() {
  this.load.image('star', starUrl)
  // this.load.image('level-1', level1Url)
  // this.load.spritesheet('tileset', tilesetUrl, { frameWidth: CELL_SIZE, frameHeight: CELL_SIZE })
  this.load.image('tileset', tilesetUrl)
  this.load.tilemapTiledJSON({
    key: 'level1',
    url: tiledJson
  });

  _.each(state.actors, actor => {
    actor.preload.call(actor, this)
  })

  this.input.gamepad.once('connected', function (pad) {
    pad.threshold = 0.5
  });
}

function create() {
  this.add.image(400, 300, 'star')

  state.map = this.make.tilemap({ key: 'level1' })
  const { map } = state

  var tiles = map.addTilesetImage('tileset');

  var layer = map.createStaticLayer(0, tiles, 0, 0);

  _.each(state.actors, actor => {
    actor.create.call(actor, this)
  })
}

function update()
{
  updateFn(state, this)
}

var config = {
  type: Phaser.AUTO,
  width: 320,
  height: 256,
  canvas: document.querySelector('canvas'),
  pixelArt: true,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: {
        y: 0
      },
      debug: false
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  },
  input: {
    gamepad: true
  },
};

var game = new Phaser.Game(config);
console.log(game.canvas)

if (module.hot) {
  module.hot.accept('./update.js')
}
