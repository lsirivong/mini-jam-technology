import fonttTexture from './assets/font.png'
import fontRule from './assets/font.fnt'

export class LoadScene extends Phaser.Scene{
  constructor(){
    super({
      key:"LOAD"
    })
  }
  init(){
    var style = { font: "bold 32px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };
    let title = this.add.text(this.game.config.width/2, 20, "loading...", style);
  }
  preload(){
    this.load.bitmapFont('pixel_font', fonttTexture, fontRule);

  }
  create(){
    this.scene.start("MENU");
  }
}
