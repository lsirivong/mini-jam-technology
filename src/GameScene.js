import _ from 'lodash'
import Phaser from 'phaser'
import level1Url from './assets/level-1.png'
import tilesetUrl from './assets/tileset.png'
import tiledJson from './tilemaps/level-1.json'
import level2Json from './tilemaps/level-2.json'
import Player from './player'
import pickCable from './pickCable'
import InputHelper from './input_helper'

const tileIndexIn = (tile, indexes) => {
  if (tile.index < 0) {
    return false
  }

  const firstgid = _.get(tile, 'tileset[0].firstgid')
  console.log(tile)
  return (
    _.includes(indexes, tile.index - firstgid)
  )
}

class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'INGAME'})

    this.player = new Player(this)

    this.levels = [
      {
        key: 'level1',
        url: tiledJson,
      },
      {
        key: 'level2',
        url: level2Json
      }
    ]

    this.currentLevel = 0
  }

  preload() {
    this.load.image('tileset', tilesetUrl)
    // this.load.image('player_spritesheet', playerUrl)
    _.each(this.levels, level => {
      this.load.tilemapTiledJSON(level);
    })

    this.player.preload.call(this.player)

    this.input.gamepad.once('connected', function (pad) {
      pad.threshold = 0.5
    });
  }

  loadLevel() {
    const level = this.levels[this.currentLevel]

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
    console.log(this.switches)

    this.switchesFound = 0

    map.setLayer(playerLayer)
    var playerTile = map.findTile(
      // find the player tile
      tile => tileIndexIn(tile, [22])
    )

    map.removeTileAt(playerTile.x, playerTile.y)

    this.player.initialize(playerTile.x, playerTile.y)
  }

  create() {
    this.inputHelper = new InputHelper(this)
    const { player } = this
    player.create.call(player)
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
      map.putTileAt(SPR.ON_SWITCH, x, y, true, 'items')
    } else if (_.get(itemTile, 'properties.exit')) {
      // if we're on the exit, check win condition
      if (this.switches.length <= this.switchesFound) {
        console.log('WIN')
        this.currentLevel = (this.currentLevel + 1) % this.levels.length
        this.loadLevel()
      }
    }
  }

  update() {
    const { player } = this
    player.update.call(player)
  }
}

export default GameScene
