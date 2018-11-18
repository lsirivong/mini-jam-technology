import Phaser from 'phaser'
import {LoadScene} from './load_scene.js'
import {MenuScene} from './menu_scene.js'
import GameScene from './GameScene'

var config = {
  type: Phaser.AUTO,
  width: 160,
  height: 160,
  canvas: document.querySelector('canvas'),
  pixelArt: true,
  scene: [
    LoadScene,
    MenuScene,
    GameScene,
  ],
  input: {
    gamepad: true
  },
};

var game = new Phaser.Game(config);
