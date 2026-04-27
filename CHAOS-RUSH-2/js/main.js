// TEAM CR2 { MATHEUS, CAIO, ENZO, EDUARDO, PEDRO } - SECUNDÁRIO

import LoginScene from './scene/LoginScene.js';
import RegisterScene from './scene/RegisterScene.js';
import MenuScene from './scene/MenuScene.js';
import MainScene from './scene/MainScene.js';
import PauseMenu from './scene/PauseMenu.js';

const config = {
  type: Phaser.AUTO,

  dom: {
    createContainer: true
  },

  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: window.innerWidth,
    height: window.innerHeight,
    parent: 'game-container'
  },

  render: {
    pixelArt: true
  },

  physics: {
    default: 'arcade',
    arcade: {
      debug: false
    }
  },

  scene: [LoginScene, RegisterScene, MenuScene, MainScene, PauseMenu]
};

window.game = new Phaser.Game(config);