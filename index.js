import Phaser from 'phaser'
import update from './update'

    var config = {
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        scene: {
            preload: preload,
            create: create,
            update: update
        }
    };

    var game = new Phaser.Game(config);

    function preload ()
    {
    }

    function create ()
    {
    }

if (module.hot) {
  module.hot.accept('./update.js', function() {

  })
}
