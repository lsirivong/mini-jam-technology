import _ from 'lodash'
import Phaser from 'phaser'
import starUrl from './assets/star.png'
import level1Url from './assets/level-1.png'
import tilesetUrl from './assets/tileset.png'
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
  this.load.image('level-1', level1Url)
  this.load.spritesheet('tileset', tilesetUrl, { frameWidth: CELL_SIZE, frameHeight: CELL_SIZE })

  _.each(state.actors, actor => {
    actor.preload.call(actor, this)
  })

  this.input.gamepad.once('connected', function (pad) {
    pad.threshold = 0.5
  });
}

function create() {
  this.add.image(400, 300, 'star')

  state.map = this.make.tilemap({
    tileWidth: 16,
    tileHeight: 16,
    width: 20,
    height: 16,
  })
  const { map } = state

  var tileset = map.addTilesetImage(
    'tileset',
  );
  const layer = map.createBlankDynamicLayer('Layer 1', tileset);

  const TILES = {
    TOP_LEFT_WALL: 24,
    TOP_WALL: 25,
    TOP_RIGHT_WALL: 26,
    LEFT_WALL: 32,
    RIGHT_WALL: 34,
    BOTTOM_LEFT_WALL: 40,
    BOTTOM_WALL: 41,
    BOTTOM_RIGHT_WALL: 41,
    FLOOR: 13,
  }

  level = loadLevelFromTexture(this.textures, 'level-1')
  _.each(level, (column, x) => {
    _.each(column, (cell, y) => {
      // this.add.sprite(400, 300, 'star')
      //       const tile = this.add.sprite(
      //         x * CELL_SIZE,
      //         y * CELL_SIZE,
      //         'tilemap'
      //       )
      // tile.setOrigin(0)
      if (cell == WALL) {
        map.putTileAt(TILES.TOP_LEFT_WALL, x, y)
      }
      else {
        map.putTileAt(TILES.FLOOR, x, y)
      }
    })
  })

  _.each(state.actors, actor => {
    actor.create.call(actor, this)
  })

  // this.physics.add.collider(state.actors.player.gameObject, state.actors.walls.gameObject);
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
