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
  }
  create(){
    this.scene.start("MENU");
  }
}
