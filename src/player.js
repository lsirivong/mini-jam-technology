import spritesheet from './assets/player_spritesheet.png'
const PLAYER_SPEED = 300;
const AXIS_THRESHOLD = 0.2;

const getAxisValue = (scene, negativeButton, positiveButton, axisIndex) => {
  const cursors = scene.input.keyboard.createCursorKeys()
  const pad = _.get(scene, 'input.gamepad.gamepads[0]')

  const axisValueRaw = _.get(pad, `axes[${axisIndex}].value`) || 0
  const axisValue = Math.abs(axisValueRaw) > AXIS_THRESHOLD ? axisValueRaw : 0
  if (
    _.get(cursors, [negativeButton, 'isDown'])
    || _.get(pad, negativeButton)
    || axisValue < 0
  ) {
    return -1
  } else if (
    _.get(cursors, [positiveButton, 'isDown'])
    || _.get(pad, positiveButton)
    || axisValue > 0
  ) {
    return 1
  }

  return 0
}

class Player {
  preload(scene) {
    scene.load.spritesheet(
      'player', 
      spritesheet,
      { frameWidth: 16, frameHeight: 16 }
    );
  }

  create(scene, x, y) {
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

    this.x = x
    this.y = y
    gameObject.setOrigin(0)
    gameObject.x = this.x * 16
    gameObject.y = this.y * 16

    this.gameObject = gameObject

    this.play('right')

  }

  tryMove(map, deltaX, deltaY) {
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
      const tile = map.getTileAt(newX, newY, false, 'level')
      if (!tile) {
        this.x = newX
        this.y = newY
        this.lastMove = +new Date()
      }
    }
  }

  update(state, scene) {
    const now = +new Date()
    const STEP_THROTTLE = 200
    const deltaX = getAxisValue(scene, 'left', 'right', 0)
    const deltaY = getAxisValue(scene, 'up', 'down', 1)

    if (
      this.lastMove && now - this.lastMove < STEP_THROTTLE
      && ((deltaX && this.lastDeltaX)
      || (deltaY && this.lastDeltaY))
    ) {
      return
    }


    const { map } = state

    if (deltaX) {
      this.tryMove(map, deltaX, 0)
    } else if (deltaY) {
      this.tryMove(map, 0, deltaY)
    }

    const gameObject = this.gameObject

    const newX = this.x * 16
    const newY = this.y * 16
    if (deltaX || deltaY) {
      scene.tweens.add({
        targets: gameObject,
        x: newX,
        y: newY,
        duration: 200,
      });
    }

    this.lastDeltaX = deltaX
    this.lastDeltaY = deltaY
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
