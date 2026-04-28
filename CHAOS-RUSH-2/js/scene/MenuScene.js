export default class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' });
  }

  preload() {
    this.load.image('menuBg', 'assets/img/menu-init-1.png');
  }

  create() {
    const width = this.scale.width;
    const height = this.scale.height;

    this.userData = this.getUserData();
    if (!this.userData || !this.userData.email) {
      this.scene.start('LoginScene');
      return;
    }

    this.bgFar = this.add
      .tileSprite(0, 0, width, height, 'menuBg')
      .setOrigin(0)
      .setScrollFactor(0);

    this.bgNear = this.add
      .tileSprite(0, 0, width, height, 'menuBg')
      .setOrigin(0)
      .setScrollFactor(0)
      .setAlpha(0.35)
      .setDepth(-1);

    this.cameras.main.setBackgroundColor('#080a10');

    this.add
      .text(width / 2, 100, 'CHAOS RUSH', {
        fontSize: '64px',
        fill: '#00ffff',
        fontStyle: 'bold',
      })
      .setOrigin(0.5)
      .setDepth(10);

    this.add
      .text(width / 2, 160, 'Fractured Realms', {
        fontSize: '20px',
        fill: '#cccccc',
      })
      .setOrigin(0.5)
      .setDepth(10);

    this.createAccountHeader(width, height);

    const painelWidth = Math.min(760, width - 120);
    const painelHeight = Math.min(560, height - 260);
    this.painel = this.add
      .rectangle(width / 2, height / 2.4 + 40, painelWidth, painelHeight, 0x000000, 0.5)
      .setOrigin(0.5)
      .setStrokeStyle(2, 0x00ffff)
      .setDepth(5);

    const classes = [
      {
        Key: 'alquimista',
        name: 'A Alquimista Espectral',
        desc: 'Manipula frascos instáveis que causam efeitos aleatórios.\nCarregue sua passiva e acabe com seus inimigos.',
      },
      {
        Key: 'coveiro',
        name: 'O Coveiro Profano',
        desc: 'Profana a terra com a Foice Enferrujada, aplicando Podridão e Lentidão aos inimigos.',
      },
      {
        Key: 'sentinela',
        name: 'A Sentinela do Sino',
        desc: 'Toca o Sino da Purificação, causando dano em área e empurrando inimigos.\nDano bônus quando empurra inimigos.',
        estreia: 'EM BREVE!!!!',
      },
    ];

    const startY = height / 2 - 50;

    classes.forEach((cls, i) => {
      const btnY = startY + i * 90;

      const btnWidth = Math.min(600, painelWidth - 120);
      const btn = this.add
        .rectangle(width / 2, btnY, btnWidth, 80, 0x111122, 0.7)
        .setStrokeStyle(2, 0x00ffff)
        .setInteractive({ useHandCursor: true })
        .setDepth(6);

      this.add
        .text(btn.x, btnY - 20, cls.name, {
          fontSize: '22px',
          fill: '#00ffff',
          fontStyle: 'bold',
        })
        .setOrigin(0.5)
        .setDepth(7);

      this.add
        .text(btn.x, btnY + 15, cls.desc, {
          fontSize: '14px',
          fill: '#cccccc',
          align: 'center',
          wordWrap: { width: 550 },
        })
        .setOrigin(0.5)
        .setDepth(7);

      btn.on('pointerover', () => btn.setFillStyle(0x00ffff, 0.3));
      btn.on('pointerout', () => btn.setFillStyle(0x111122, 0.7));
      btn.on('pointerdown', () => {
        this.scene.start('MainScene', { selectedClassKey: cls.Key });
      });

      if (cls.estreia) {
        this.add
          .text(btn.x - 295, btnY - 35, cls.estreia, {
            fontSize: '20px',
            fill: '#ffff00',
            fontStyle: 'bold',
          })
          .setOrigin(0.01)
          .setDepth(7);
      }
    });

    this.accountStatus = this.add
      .text(width / 2, height - 120, '', {
        fontSize: '18px',
        fill: '#00ffff',
        align: 'center',
        wordWrap: { width: painelWidth },
      })
      .setOrigin(0.5)
      .setDepth(7);

    this.startInstruction = this.add
      .text(width / 2, height - 80, 'Pressione uma classe para começar!!', {
        fontSize: '22px',
        fill: '#FFF700',
      })
      .setOrigin(0.5)
      .setDepth(7);

    this.scale.on('resize', this.resize, this);
  }

  getUserData() {
    try {
      const stored = localStorage.getItem('chaos_user');
      if (!stored) return null;
      return JSON.parse(stored);
    } catch (error) {
      console.error('Erro lendo usuário do storage', error);
      return null;
    }
  }

  createAccountHeader(width, height) {
    const headerWidth = Math.min(380, width - 64);
    const headerHeight = 90;
    const padding = 16;
    const rightX = width - padding;
    const textX = width - headerWidth - 24;

    this.accountHeader = {
      box: this.add
        .rectangle(rightX, padding + headerHeight / 2, headerWidth, headerHeight, 0x000000, 0.55)
        .setOrigin(1, 0.5)
        .setStrokeStyle(2, 0x00ffff)
        .setDepth(10),
      nameText: this.add
        .text(textX, padding + 18, `Olá, ${this.userData.nome || 'Jogador'}`, {
          fontSize: '18px',
          fill: '#00ffff',
          fontStyle: 'bold',
        })
        .setOrigin(0, 0)
        .setDepth(11),
      emailText: this.add
        .text(textX, padding + 42, `${this.userData.email}`, {
          fontSize: '14px',
          fill: '#cccccc',
        })
        .setOrigin(0, 0)
        .setDepth(11),
      accountOption: this.add
        .text(rightX - 16, padding + 18, 'MINHA CONTA', {
          fontSize: '16px',
          fill: '#00ffff',
          fontStyle: 'bold',
        })
        .setOrigin(1, 0)
        .setInteractive({ useHandCursor: true })
        .setDepth(11),
      logoutOption: this.add
        .text(rightX - 16, padding + 48, 'SAIR', {
          fontSize: '16px',
          fill: '#ff5555',
          fontStyle: 'bold',
        })
        .setOrigin(1, 0)
        .setInteractive({ useHandCursor: true })
        .setDepth(11),
    };

    this.accountHeader.accountOption.on('pointerdown', () => {
      this.accountStatus.setText(`Conta:\nNome: ${this.userData.nome || '---'}\nE-mail: ${this.userData.email}`);
    });

    this.accountHeader.logoutOption.on('pointerdown', () => {
      localStorage.removeItem('chaos_user');
      this.scene.start('LoginScene');
    });
  }

  resize(gameSize) {
    const { width, height } = gameSize;
    this.bgFar.setSize(width, height);
    this.bgNear.setSize(width, height);

    const painelWidth = Math.min(760, width - 120);
    const painelHeight = Math.min(560, height - 260);

    if (this.painel) {
      this.painel.setPosition(width / 2, height / 2.4 + 40).setSize(painelWidth, painelHeight);
    }

    if (this.accountHeader) {
      const headerWidth = Math.min(380, width - 64);
      const headerHeight = 90;
      const rightX = width - 16;
      const textX = width - headerWidth - 24;
      const padding = 16;

      this.accountHeader.box.setPosition(rightX, padding + headerHeight / 2).setSize(headerWidth, headerHeight);
      this.accountHeader.nameText.setPosition(textX, padding + 18);
      this.accountHeader.emailText.setPosition(textX, padding + 42);
      this.accountHeader.accountOption.setPosition(rightX - 16, padding + 18);
      this.accountHeader.logoutOption.setPosition(rightX - 16, padding + 48);
    }

    if (this.accountStatus) {
      this.accountStatus.setPosition(width / 2, height - 120);
    }

    if (this.startInstruction) {
      this.startInstruction.setPosition(width / 2, height - 80);
    }
  }

  update(time, delta) {
    const speedFar = 0.03 * delta;
    const speedNear = 0.08 * delta;

    this.bgFar.tilePositionX += speedFar;
    this.bgNear.tilePositionX -= speedNear;
  }
}
