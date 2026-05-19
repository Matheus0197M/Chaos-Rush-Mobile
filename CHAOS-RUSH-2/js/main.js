// TEAM CR2 { MATHEUS, CAIO, ENZO, EDUARDO, PEDRO } - SECUNDÁRIO

import VirtualJoystick from "../VirtualJoystick.js";

export default class MainScene extends Phaser.Scene {

  constructor() {
    super("MainScene");
  }

  preload() {

    // =========================
    // PLAYER
    // =========================

    this.load.spritesheet(
      "alquimista",
      "assets/Sprites/Alquimista.png",
      {
        frameWidth: 32,
        frameHeight: 32
      }
    );

    this.load.spritesheet(
      "sentinela",
      "assets/Sprites/Sentinela.png",
      {
        frameWidth: 32,
        frameHeight: 32
      }
    );

    // =========================
    // MAPA / BACKGROUND
    // =========================

    this.load.image(
      "background",
      "assets/background.png"
    );

  }

  create() {

    // =========================
    // BACKGROUND
    // =========================

    this.add.image(
      this.scale.width / 2,
      this.scale.height / 2,
      "background"
    )
    .setDisplaySize(
      this.scale.width,
      this.scale.height
    );

    // =========================
    // PLAYER
    // =========================

    this.player = this.physics.add.sprite(
      this.scale.width / 2,
      this.scale.height / 2,
      "alquimista"
    );

    this.player.setCollideWorldBounds(true);

    // =========================
    // ANIMAÇÃO
    // =========================

    this.anims.create({
      key: "walk",
      frames: this.anims.generateFrameNumbers(
        "alquimista",
        {
          start: 0,
          end: 3
        }
      ),
      frameRate: 8,
      repeat: -1
    });

    // =========================
    // JOYSTICK
    // =========================

    this.joystick = new VirtualJoystick();

    // =========================
    // DASH
    // =========================

    this.canDash = true;

    // =========================
    // CAMERA
    // =========================

    this.cameras.main.startFollow(this.player);

    // =========================
    // RESUME AUDIO MOBILE
    // =========================

    this.input.once("pointerdown", () => {

      if (
        this.sound.context &&
        this.sound.context.state === "suspended"
      ) {

        this.sound.context.resume();

      }

    });

    // =========================
    // DESTROY JOYSTICK
    // =========================

    this.events.on("shutdown", () => {

      this.joystick?.destroy();

    });

  }

  update() {

    if (!this.player) return;

    let vx = 0;
    let vy = 0;

    // =========================
    // JOYSTICK MOVEMENT
    // =========================

    if (
      this.joystick &&
      this.joystick.active
    ) {

      vx = this.joystick.vx;
      vy = this.joystick.vy;

    }

    // =========================
    // KEYBOARD FALLBACK
    // =========================

    const speed = 220;

    this.player.setVelocity(
      vx * speed,
      vy * speed
    );

    // =========================
    // NORMALIZAR DIAGONAL
    // =========================

    this.player.body.velocity.normalize()
      .scale(speed);

    // =========================
    // ANIMAÇÃO
    // =========================

    if (
      Math.abs(vx) > 0 ||
      Math.abs(vy) > 0
    ) {

      this.player.anims.play(
        "walk",
        true
      );

    } else {

      this.player.anims.stop();

    }

    // =========================
    // FLIP PLAYER
    // =========================

    if (vx < 0) {

      this.player.setFlipX(true);

    } else if (vx > 0) {

      this.player.setFlipX(false);

    }

    // =========================
    // DASH
    // =========================

    if (
      this.joystick &&
      this.joystick.dashPressed &&
      this.canDash
    ) {

      this.executarDash();

      this.joystick.consumeDash();

    }

  }

  executarDash() {

    this.canDash = false;

    const dashSpeed = 700;

    let dx = this.joystick.vx;
    let dy = this.joystick.vy;

    // fallback se parado
    if (dx === 0 && dy === 0) {
      dx = 1;
    }

    this.player.setVelocity(
      dx * dashSpeed,
      dy * dashSpeed
    );

    // cooldown
    this.time.delayedCall(250, () => {

      this.canDash = true;

    });

  }

}