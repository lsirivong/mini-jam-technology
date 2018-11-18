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

class GamePlayScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GamePlay'})
  }

  preload() {
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

  loadLevel(key) {
    state.map = this.make.tilemap({ key: key })
    const { map } = state

    var tiles = map.addTilesetImage('tileset');
    // var playerTiles = map.addTilesetImage('player_spritesheet');

    map.createStaticLayer('background', tiles, 0, 0);
    map.createStaticLayer('level', tiles, 0, 0);
    map.createDynamicLayer('cables', tiles, 0, 0);
    map.createDynamicLayer('items', tiles, 0, 0);
    const playerLayer = map.createDynamicLayer('player', tiles, 0, 0);

    map.setLayer(playerLayer)

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

    map.removeTileAt(playerTile.x, playerTile.y)

    return [playerTile.x, playerTile.y]
  }

  create() {
    const [x, y] = this.loadLevel('level1')

    _.each(state.actors, actor => {
      actor.create.call(actor, this)
    })

    state.player.create.call(state.player, this, x, y)
    state.player.emitter.on('move', this.handlePlayerMove, this)
  }

  handlePlayerMove(x, y, deltaX, deltaY) {
    const { map } = state

    // put a cable where we used to be
    const cableIndex = pickCable(deltaX, deltaY, state.player.moveHistory)
    map.putTileAt(cableIndex, x - deltaX, y - deltaY, true, 'cables')

    // draw cable attached to the player
    const underCableIndex = pickCable(-deltaX, -deltaY, null)
    map.putTileAt(underCableIndex, x, y, true, 'cables')

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
  }

  update()
  {
    updateFn(state, this)
  }
}

var config = {
  type: Phaser.AUTO,
  width: 320,
  height: 256,
  canvas: document.querySelector('canvas'),
  pixelArt: true,
  scene:[LoadScene,MenuScene,GamePlayScene],
  input: {
    gamepad: true
  },
};

var game = new Phaser.Game(config);

if (module.hot) {
  module.hot.accept('./update.js')
}
