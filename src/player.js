import _ from 'lodash'
import spritesheet from './assets/player_spritesheet.png'
import pickCable from './pickCable'

class Player {
  constructor(scene) {
    this.scene = scene
  }

  initialize(x, y) {
    this.play('right')

    this.moveHistory = []

    this.x = x
    this.y = y
    this.gameObject.x = this.x * 16
    this.gameObject.y = this.y * 16

    this.gameObject.setDepth(10)
  }

  preload() {
    const { scene } = this
    scene.load.spritesheet(
      'player', 
      spritesheet,
      { frameWidth: 16, frameHeight: 16 }
    );
  }

  create(x, y) {
    const { scene } = this
    const gameObject = scene.add.sprite(
      0,
      0,
      'player'
    );

    scene.anims.create({
      key: 'idle',
      frames: scene.anims.generateFrameNumbers('player', { start: 0, end: 1 }),
      frameRate: 2,
      repeat: -1
    });

    scene.anims.create({
      key: 'right',
      frames: scene.anims.generateFrameNumbers('player', { start: 8, end: 15 }),
      frameRate: 8,
      repeat: -1
    });

    scene.anims.create({
      key: 'left',
      frames: scene.anims.generateFrameNumbers('player', { start: 16, end: 23 }),
      frameRate: 8,
      repeat: -1
    });

    gameObject.setOrigin(0)
    this.gameObject = gameObject
    this.emitter = new Phaser.Events.EventEmitter();

    this.initialize(x = 0, y = 0)
  }

  canMove(map, deltaX, deltaY) {
    const gameObject = this.gameObject

    if (deltaX || deltaY) {
      const newX = this.x + deltaX
      const newY = this.y + deltaY

      if (deltaX > 0) {
        this.play('right')
      } else if (deltaX < 0) {
        this.play('left')
      }

      // check for walls
      const levelTile = map.getTileAt(newX, newY, false, 'level')
      const cableTile = map.getTileAt(newX, newY, false, 'cables')
      const itemTile = map.getTileAt(newX, newY, false, 'items')

      if (_.get(itemTile , 'properties.exit')) {
        return this.scene.canExit()
      }

      return (!levelTile && !cableTile)
    }
  }

  update() {
    const { scene } = this

    const deltaX = this.scene.inputHelper.getAxisPressed('left', 'right', 0)
    const deltaY = this.scene.inputHelper.getAxisPressed('up', 'down', 1)

    const { map } = scene

    const gameObject = this.gameObject
    const moveX = (deltaX && this.canMove(map, deltaX, 0)) ? deltaX : 0
    // only moveY if not moving X
    const moveY = (!deltaX && deltaY && this.canMove(map, 0, deltaY)) ? deltaY : 0

    if (moveX || moveY) {
      this.x = this.x + moveX
      this.y = this.y + moveY

      const prevMove = _.last(this.moveHistory)
      this.moveHistory.push([ moveX, moveY ])

      this.emitter.emit('move', this.x, this.y, moveX, moveY, prevMove)

    }

    if (deltaX || deltaY) {
      const newX = this.x * 16
      const newY = this.y * 16
      scene.tweens.add({
        targets: gameObject,
        x: newX,
        y: newY,
        duration: 100,
      });
    }
  }

  play(key) {
    if (this.activeAnim !== key) {
      const gameObject = this.gameObject
      this.activeAnim = key
      gameObject.anims.play(key, true)
    }
  }
}

export default Player
