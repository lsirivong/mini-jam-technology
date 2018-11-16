import Phaser from 'phaser'
import starUrl from './assets/star.png'
import dudeUrl from './assets/dude.png'
import updateFn from './update'

let state = {}

function preload ()
{
  this.load.image('star', starUrl)

  this.load.spritesheet(
    'dude', 
    dudeUrl,
    { frameWidth: 32, frameHeight: 48 }
  );
}

function create() {
  const player = this.physics.add.sprite(
    100,
    450,
    'dude'
  );

  player.setBounce(0.2);
  // player.setDamping(true);
  player.setDrag(800);
  player.setCollideWorldBounds(true);

  state.player = player

  this.add.image(400, 300, 'star')
}

function update ()
{
  updateFn(state, this)
}

var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
      default: 'arcade',
      arcade: {
        gravity: {
          y: 0
        },
        debug: false
      }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);

if (module.hot) {
  module.hot.accept('./update.js')
}
