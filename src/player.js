import dudeUrl from './assets/dude.png'
const PLAYER_SPEED = 200;

class Player {
  preload(scene) {
    scene.load.spritesheet(
      'dude', 
      dudeUrl,
      { frameWidth: 32, frameHeight: 48 }
    );
  }

  create(scene) {
    const player = scene.physics.add.sprite(
      100,
      450,
      'dude'
    );

    player.setBounce(0.2);
    // player.setDamping(true);
    player.setDrag(800);
    player.setCollideWorldBounds(true);

    this.player = player
  }

  update(scene) {
    const cursors = scene.input.keyboard.createCursorKeys();
    const player = this.player
    if (cursors.left.isDown) {
      player.setVelocityX(-PLAYER_SPEED);
    }
    else if (cursors.right.isDown) {
      player.setVelocityX(PLAYER_SPEED);

      // player.anims.play('right', true);
    }
    else {
      // player.setVelocityX(0);

      // player.anims.play('turn');
    }

    if (cursors.up.isDown) {
      player.setVelocityY(-PLAYER_SPEED);

      // player.anims.play('right', true);
    }
    else if (cursors.down.isDown) {
      player.setVelocityY(PLAYER_SPEED);

      // player.anims.play('right', true);
    }
    else {
      // player.setVelocityY(0)
    }
  }
}

export default Player
