import _ from 'lodash'
import Phaser from 'phaser'
import level1Url from './assets/level-1.png'
import tilesetUrl from './assets/tileset.png'
import levels from './levels'
import Player from './player'
import Exit from './Exit'
import pickCable from './pickCable'
import InputHelper from './input_helper'

// checks if a tile index exists in the list supplied
const tileIndexIn = (tile, indexes) => {
  if (tile.index < 0) {
    return false
  }

  const firstgid = _.get(tile, 'tileset[0].firstgid')
  return (
    _.includes(indexes, tile.index - firstgid)
  )
}

class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'INGAME'})

    this.player = new Player(this)
    this.exit = new Exit(this)

    this.currentLevel = 0
  }

  preload() {
    this.load.image('tileset', tilesetUrl)
    _.each(levels, level => {
      this.load.tilemapTiledJSON(level);
    })

    this.player.preload.call(this.player)
    this.exit.preload.call(this.exit)

    this.input.gamepad.once('connected', function (pad) {
      pad.threshold = 0.5
    });
  }

  loadLevel() {
    const level = levels[this.currentLevel]

    if (this.map) {
      this.map.destroy()
    }

    this.map = this.make.tilemap({ key: level.key })
    const { map } = this

    var tiles = map.addTilesetImage('tileset');
    // var playerTiles = map.addTilesetImage('player_spritesheet');

    map.createStaticLayer('background', tiles, 0, 0);
    map.createStaticLayer('level', tiles, 0, 0);
    map.createDynamicLayer('cables', tiles, 0, 0);
    const itemLayer = map.createDynamicLayer('items', tiles, 0, 0);
    const playerLayer = map.createDynamicLayer('player', tiles, 0, 0);

    // get switches
    map.setLayer(itemLayer)
    this.switches = map.filterTiles(
      tile => tileIndexIn(tile, [31])
    )
    const exitTile = map.findTile(
      tile => _.get(tile, 'properties.exit')
    )

    this.switchesFound = 0

    // map.removeTileAt(playerTile.x, playerTile.y)
    this.exit.initialize(exitTile.x, exitTile.y)


    map.setLayer(playerLayer)
    var playerTile = map.findTile(
      tile => tileIndexIn(tile, [22])
    )
    map.removeTileAt(playerTile.x, playerTile.y)
    this.player.initialize(playerTile.x, playerTile.y)

    if (this.canExit()) {
      this.exit.activate()
    }
  }

  create() {
    this.inputHelper = new InputHelper(this)
    const { player, exit } = this
    player.create.call(player)
    exit.create.call(exit)

    player.emitter.on('move', this.handlePlayerMove, this)

    this.loadLevel()
  }

  canExit() {
    return this.switches.length <= this.switchesFound
  }

  handlePlayerMove(x, y, deltaX, deltaY, lastMove) {
    const { map, player } = this

    // put a cable where we used to be
    const cableIndex = pickCable(deltaX, deltaY, lastMove)
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
      this.switchesFound++
      if (this.canExit()) {
        this.exit.activate()
      }
      map.putTileAt(SPR.ON_SWITCH, x, y, true, 'items')
    } else if (_.get(itemTile, 'properties.exit')) {
      // if we're on the exit, check win condition
      if (this.switches.length <= this.switchesFound) {
        this.currentLevel = this.currentLevel + 1
        if (this.currentLevel < levels.length) {
          this.loadLevel()
        }
        else {
          this.currentLevel = 0
          this.scene.start('MENU')
        }
      }
    }
  }

  update() {
    if (this.inputHelper.buttonPressed('z')) {
      this.loadLevel()
    }

    const { player } = this
    player.update.call(player)
  }
}

export default GameScene
