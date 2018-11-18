import _ from 'lodash'
import Phaser from 'phaser'

import {LoadScene} from './load_scene.js'
import {MenuScene} from './menu_scene.js'

import level1Url from './assets/level-1.png'
import tilesetUrl from './assets/tileset.png'
// import playerUrl from './assets/player_spritesheet.png'
import tiledJson from './tilemaps/level-1.json'
import updateFn from './update'
import Player from './player'
import pickCable from './pickCable'


let state = {
  player: new Player(),
  actors: {
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
  this.load.image('tileset', tilesetUrl)
  // this.load.image('player_spritesheet', playerUrl)
  this.load.tilemapTiledJSON({
    key: 'level1',
    url: tiledJson
  });

  _.each(state.actors, actor => {
    actor.preload.call(actor, this)
  })
  state.player.preload.call(state.player, this)

  this.input.gamepad.once('connected', function (pad) {
    pad.threshold = 0.5
  });
}

function create() {
  state.map = this.make.tilemap({ key: 'level1' })
  const { map } = state

  var tiles = map.addTilesetImage('tileset');
  // var playerTiles = map.addTilesetImage('player_spritesheet');

  map.createStaticLayer('background', tiles, 0, 0);
  map.createStaticLayer('level', tiles, 0, 0);
  state.cableLayer = map.createDynamicLayer('cables', tiles, 0, 0);
  map.createDynamicLayer('items', tiles, 0, 0);
  state.playerLayer = map.createDynamicLayer('player', tiles, 0, 0);

  map.setLayer(state.playerLayer)

  var playerTile = map.findTile(
    // find the player tile
    (tile, i) => {
      if (tile.index < 0) {
        return false
      }

      const firstgid = _.get(tile, 'tileset[0].firstgid')

      return (
        tile.index === (22 + firstgid)
      )
    }
  )

  _.each(state.actors, actor => {
    actor.create.call(actor, this)
  })

  state.player.create.call(state.player, this, playerTile.x, playerTile.y)
  state.player.emitter.on('move', handlePlayerMove, this)
  map.removeTileAt(playerTile.x, playerTile.y)
}

function handlePlayerMove(x, y, deltaX, deltaY) {
  const { map } = state

  // put a cable where we used to be
  // const prevItemTile = map.getTileAt(x - deltaX, y - deltaY, false, 'items')
  // if (!prevItemTile) {
    const cableIndex = pickCable(deltaX, deltaY, state.player.moveHistory)
    map.putTileAt(cableIndex, x - deltaX, y - deltaY, true, 'cables')
  // }

  // check for items in the new tile
  const itemTile = map.getTileAt(x, y, false, 'items')
  if (_.get(itemTile, 'properties.off_switch')) {
    // if there's a switch on new position, flip it on
    const SPR = {
      ON_SWITCH: 31
    }
    map.putTileAt(SPR.ON_SWITCH, x, y, true, 'items')
  } else if (_.get(itemTile, 'properties.exit')) {
    // if we're on the exit, check win condition
    console.log('WIN')
  }

  // if (!_.get(itemTile, 'properties.prevent_cable')){
    // unless tile prevents it, draw a cable
    const underCableIndex = pickCable(-deltaX, -deltaY, null)
    map.putTileAt(underCableIndex, x, y, true, 'cables')
  // }
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
  scene:[LoadScene,MenuScene],
  /*
  scene: {
    preload: preload,
    create: create,
    update: update
  },*/
  input: {
    gamepad: true
  },
};

var game = new Phaser.Game(config);

if (module.hot) {
  module.hot.accept('./update.js')
}
