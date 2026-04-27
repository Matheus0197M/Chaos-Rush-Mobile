export default class PauseMenu extends Phaser.Scene {
    constructor() {
        super({ key: 'PauseMenu' });
    }
    create() {
        // Fundo, malandro
        const fundoCor = this.add.graphics();
        fundoCor.fillStyle(0x111111, 0.7);
        fundoCor.fillRect(0, 0, 800, 800);

        // Container centralizado para UI, segundo a IA do BlackBox KKKKK
        this.pauseContainer = this.add.container(400, 400);

        // Agora sim vem o painel principal
        const painel = this.add.graphics();
        painel.fillStyle(0x2c4a9033, 1);
        painel.fillRoundedRect(-200, -150, 400, 300, 20);
        painel.lineStyle(3, 0x34495e);
        painel.strokeRoundedRect(-200, -150, 400, 300, 20);

        // Title do menu
        const title = this.add.text(0, -100, 'JOGO PAUSADO', {
            fontSize: '40px',
            fontFamily: 'Arial Black',
            fill: '#ecf0f1',
            stroke: '#2c3e50',
            strokeThickness: 6
        }).setOrigin(0.5);

        // Botões [Caio beiçudo]
        this.createButtons();

        // Adiciona elementos ao container
        this.pauseContainer.add([painel, title]);

        // Entrada com animação OIA
        this.tweens.add({
            targets: this.pauseContainer,
            scale: 1.2,
            alpha: 1.2,
            duration: 300,
            ease: 'Back.easeOut'
        });

        // ESC pra sair da tela de pause
        this.input.keyboard.on('keydown-ESC', () => {
            this.resumeGame();
        });
    }

    createButtons() {
        const buttons = [
            { text: 'Voltar', callback: () => this.resumeGame() },
            { text: 'Reiniciar', callback: () => this.restartGame() },
            { text: 'Menu', callback: () => this.goToMenu() }
        ];

        buttons.forEach((buttonData, index) => {
            // O que é um FOREACH mesmo?
            const botao = this.add.text(0, 20 + (index * 60), buttonData.text, {
                fontSize: '24px',
                fill: '#ecf0f1',
                fontFamily: 'Arial',
                stroke: '#2c3e50',
                strokeThickness: 4
            }).setOrigin(0.5);

            // Efeito hover 
            botao.setInteractive({ useHandCursor: true })
                .on('pointerover', () => {
                    botao.setStyle({ fill: '#3498db' });
                    this.tweens.add({
                        targets: botao,
                        scale: 1.1,
                        duration: 200,
                        yoyo: true,
                        repeat: 1
                    });
                })
                .on('pointerout', () => {
                    botao.setStyle({ fill: '#ecf0f1' });
                })
                .on('pointerdown', () => buttonData.callback());

            this.pauseContainer.add(botao);
        });
    }

    resumeGame() {
        const mainScene = this.scene.get('MainScene');
        if (mainScene) {
            mainScene.resumeGame();
        }
        this.scene.stop();
    }

    restartGame() {
        this.scene.stop('PauseMenu');
        this.scene.get('MainScene').scene.restart();
    }

    goToMenu() {
        this.scene.stop('PauseMenu');
        this.scene.get('MainScene').scene.stop();
        this.scene.start('MenuScene');
    }
}
