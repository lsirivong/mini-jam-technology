import Phaser from 'phaser'
import starUrl from './assets/star.png'
import dudeUrl from './assets/dude.png'
import updateFn from './update'
import Player from './player'

let state = {
  actors: [
    new Player()
  ]
}

function preload() {
  this.load.image('star', starUrl)
  _.each(state.actors, actor => {
    actor.preload.call(actor, this)
  })
}

function create() {
  this.add.image(400, 300, 'star')
  _.each(state.actors, actor => {
    actor.create.call(actor, this)
  })
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
    }
};

var game = new Phaser.Game(config);

if (module.hot) {
  module.hot.accept('./update.js')
}
