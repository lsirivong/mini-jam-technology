import cursorUrl from './assets/cursor.png'

import title_image from './assets/title_image.png'
import menu_background from './assets/menu_background.png'

import InputHelper from './input_helper'

export class MenuScene extends Phaser.Scene {
	constructor() {
		super({
			key: "MENU"
		})
	}
	preload() {
		this.load.image('cursor', cursorUrl);
		this.load.image('background', menu_background);
		this.load.image('title_image', title_image);
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
		let bg = this.add.image(0, 0, 'background');
		bg.setOrigin(0);
		this.title_image = this.add.image(this.game.config.width / 2, 0, 'title_image');
		this.inputHelper = new InputHelper(this)
		this.canSelect = true;
		this.arrow = this.input.keyboard.createCursorKeys();
		this.cursor = this.add.image(0, 100, 'cursor').setOrigin(0, 0);
		var small_style = {
			font: "12px Arial",
			color: "rgba(255,255,255,0.5)",
			align: 'center'
		};
		this.choices.forEach((choice, index) => {
			choice.text = this.add.bitmapText(this.game.config.width / 2, 100 + (20 * index), 'pixel_font', choice.name, 16).setCenterAlign();
			choice.text.setOrigin(0.5);

		});
	}
	update() {
		this.title_image.y = 60 + (Math.sin(this.game.loop.frame * 0.04) * 4);
		this.cursor.x = ((this.game.config.width / 2) - 20 + Math.sin(this.game.loop.frame * 0.1) * 4) - (this.choices[this.selection].text.width/2);
		this.cursor.y = 94 + (this.selection * 20);

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
