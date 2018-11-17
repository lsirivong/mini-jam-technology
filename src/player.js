import dudeUrl from './assets/dude.png'
const PLAYER_SPEED = 200;
const AXIS_THRESHOLD = 0.2;

const getAxisValue = (scene, negativeButton, positiveButton, axisIndex) => {
  const cursors = scene.input.keyboard.createCursorKeys()
  const pad = _.get(scene, 'input.gamepad.gamepads[0]')

  if (_.get(cursors, [negativeButton, 'isDown']) || _.get(pad, negativeButton) ? -1 : 0) {
    return -1
  } else if (_.get(cursors, [positiveButton, 'isDown']) || _.get(pad, positiveButton) ? -1 : 0) {
    return 1
  } else {
    const val = _.get(pad, `axes[${axisIndex}].value`) || 0
    return Math.abs(val) > AXIS_THRESHOLD ? val : 0
  }
}

class Player {
  preload(scene) {
    scene.load.spritesheet(
      'dude', 
      dudeUrl,
      { frameWidth: 32, frameHeight: 48 }
    );
  }

  create(scene) {
    const gameObject = scene.physics.add.sprite(
      100,
      450,
      'dude'
    );

    gameObject.setBounce(0.2);
    // gameObject.setDamping(true);
    gameObject.setDrag(800);
    gameObject.setCollideWorldBounds(true);

    this.gameObject = gameObject
  }

  update(scene) {
    const gameObject = this.gameObject

    const xMult = getAxisValue(scene, 'left', 'right', 0)
    gameObject.setVelocityX(xMult * PLAYER_SPEED);

    const yMult = getAxisValue(scene, 'up', 'down', 1)
    gameObject.setVelocityY(yMult * PLAYER_SPEED);
  }
}

export default Player
