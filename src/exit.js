import _ from 'lodash'
import spritesheet from './assets/exit.png'
import pickCable from './pickCable'

class Exit {
  constructor(scene) {
    this.scene = scene
  }

  initialize(x, y) {
    this.x = x
    this.y = y
    this.gameObject.x = this.x * 16
    this.gameObject.y = this.y * 16
    this.gameObject.setFrame(0)

    this.gameObject.setDepth(1)
  }

  activate() {
    this.gameObject.anims.play('exit_activated', true)
  }

  preload() {
    const { scene } = this
    scene.load.spritesheet(
      'exit', 
      spritesheet,
      { frameWidth: 16, frameHeight: 16 }
    );
  }

  create(x, y) {
    const { scene } = this
    const gameObject = scene.add.sprite(
      0,
      0,
      'exit'
    );

    if (!scene.anims.get('exit_activated')) {
      const frames = scene.anims.generateFrameNumbers('exit', { start: 0, end: 6 })
      scene.anims.create({
        key: 'exit_activated',
        frames,
        frameRate: 8,
      });
    }

    gameObject.setOrigin(0)
    this.gameObject = gameObject

    this.initialize(x = 0, y = 0)
  }
}

export default Exit
