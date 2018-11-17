import platformUrl from './assets/platform.png'

class Wall {
  preload(scene) {
    scene.load.image('ground', platformUrl);
  }

  create(scene) {
    const walls = scene.physics.add.staticGroup();

    walls.create(400, 568, 'ground').setScale(2).refreshBody();

    walls.create(600, 400, 'ground');
    walls.create(50, 250, 'ground');
    walls.create(750, 220, 'ground');

    this.gameObject = walls
  }

  update(scene) {
  }
}

export default Wall
