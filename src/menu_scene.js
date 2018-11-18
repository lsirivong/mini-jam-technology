import cursorUrl from './assets/cursor.png'
import InputHelper from './input_helper'

export class MenuScene extends Phaser.Scene {
	constructor() {
		super({
			key: "MENU"
		})
	}
	preload() {
		this.load.image('cursor', cursorUrl);
	}
	init(data) {
		this.selection = 0;
		this.choices = [{
			name: "play",
			key: "INGAME"
		}, {
			name: "level selection",
			key: "SELECT"
		}, {
			name: "about",
			key: "ABOUT"
		}, ];
	}
	create() {
		this.inputHelper = new InputHelper(this)
		this.canSelect = true;
		this.arrow = this.input.keyboard.createCursorKeys();
		this.cursor = this.add.image(0, 100, 'cursor').setOrigin(0, 0);
		var style = {
			font: "bold 32px Arial",
			fill: "#fff"
		};
		let title = this.add.text(this.game.config.width / 2, 40, "title", style);
		var small_style = {
			font: "12px Arial",
			color: "rgba(255,255,255,0.5)",
			align: 'center'
		};
		this.choices.forEach((choice, index) => {
			choice.text = this.add.bitmapText(this.game.config.width / 2, 100 + (20 * index), 'pixel_font', choice.name, 16).setCenterAlign();
		});
	}
	update() {
		this.cursor.x = (this.game.config.width / 2) - 20 + Math.sin(this.game.loop.frame * 0.1) * 4;
		this.cursor.y = 100 + (this.selection * 20);

		const deltaY = this.inputHelper.getVerticalPressed()

		if (deltaY) {
			this.incrementSelection(deltaY);
                } else if (this.inputHelper.buttonPressed('x')) {
			this.scene.start(this.choices[this.selection].key);
                }
	}
	incrementSelection(value) {
		if (this.selection + value > -1 && this.selection + value < this.choices.length) {
			this.selection += value;
		}
	}
}
