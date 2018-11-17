import _ from 'lodash'
import Phaser from 'phaser'
import starUrl from './assets/star.png'
import dudeUrl from './assets/dude.png'
import updateFn from './update'
import Player from './player'
import Walls from './walls'

let state = {
  actors: {
    walls: new Walls(),
    player: new Player(),
  }
}

function preload() {
  this.load.image('star', starUrl)
  _.each(state.actors, actor => {
    actor.preload.call(actor, this)
  })

  this.input.gamepad.once('connected', function (pad) {
      //   'pad' is a reference to the gamepad that was just connected
    console.log('PAD CONNECTED', pad)
    pad.threshold = 0.5
  });
}

function create() {
  this.add.image(400, 300, 'star')
  _.each(state.actors, actor => {
    actor.create.call(actor, this)
  })

  this.physics.add.collider(state.actors.player.gameObject, state.actors.walls.gameObject);
}

function update()
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
  },
  input: {
    gamepad: true
  },
};

var game = new Phaser.Game(config);

if (module.hot) {
  module.hot.accept('./update.js')
}
