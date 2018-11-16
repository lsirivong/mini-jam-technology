const PLAYER_SPEED = 200;

export default function update(state, phaser) {
  const { player } = state

  const cursors = phaser.input.keyboard.createCursorKeys();
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
