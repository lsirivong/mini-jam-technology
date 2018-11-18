import _ from 'lodash'
const STEP_THROTTLE = 200
const AXIS_THRESHOLD = 0.2;

const BUTTON_MAP = {
  x: {
    pad: 'A',
    key: 'x'
  }
}


class InputHelper {
  constructor(scene) {
    this.padStamps = {}
    this.keyStamps = {}
    this.axisStamps = {}
    this.scene = scene

    this.keys = {
      x: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X)
    }
  }
  
  // todo, add listeners to clear the stamp on up

  // return true if button pressed, if button is held, will only trigger
  // overy STEP_THROTTLE ms
  padPressed(padButton) {
    const pad = _.get(this.scene, 'input.gamepad.gamepads[0]')

    const now = +new Date()
    const lastDown = _.get(this.padStamps, padButton) || 0
    if (now - lastDown < STEP_THROTTLE) {
      return false
    }

    const pressed = _.get(pad, padButton)
    if (pressed) {
      _.set(this.padStamps, padButton, now)
    }

    return pressed
  }

  keyPressed(char) {
    const key = this.keys[char]

    if (!key) {
      console.warn('Tried to get key state of unwatched key: ', char)
    }

    const now = +new Date()
    const lastDown = _.get(this.keyStamps, key) || 0
    if (now - lastDown < STEP_THROTTLE) {
      return false
    }

    const pressed = _.get(key, 'isDown')
    if (pressed) {
      _.set(this.keyStamps, char, now)
    }

    return pressed
  }

  buttonPressed(button) {
    const pad = _.get(BUTTON_MAP, [button, 'pad'])
    const key = _.get(BUTTON_MAP, [button, 'key'])

    if (pad && key) {
      return this.padPressed(pad) || this.keyPressed(key)
    }
  }


  getAxisValue(negativeButton, positiveButton, axisIndex) {
    const cursors = this.scene.input.keyboard.createCursorKeys()
    const pad = _.get(this.scene, 'input.gamepad.gamepads[0]')

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

  getAxisPressed(negativeButton, positiveButton, axisIndex) {
    const now = +new Date()
    const value = this.getAxisValue(negativeButton, positiveButton, axisIndex)
    const lastDown = _.get(this.axisStamps, value) || 0
    if (now - lastDown < STEP_THROTTLE) {
      return 0
    }

    if (value) {
      _.set(this.axisStamps, value, now)
    }

    return value
  }

  getHorizontalPressed() {
    return this.scene.inputHelper.getAxisPressed('left', 'right', 0)
  }

  getVerticalPressed() {
    return this.scene.inputHelper.getAxisPressed('up', 'down', 1)
  }
}

export default InputHelper
