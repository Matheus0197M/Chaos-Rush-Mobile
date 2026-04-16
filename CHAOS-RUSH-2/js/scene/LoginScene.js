export default class LoginScene extends Phaser.Scene {
  constructor(){ super({ key:'LoginScene' }); }

  create(){
    const { width, height } = this.scale;
    this.cameras.main.setBackgroundColor('#080a10');

    this.add.text(width/2, 80, 'CHAOS RUSH', {
      fontSize:'52px', color:'#00ffff', fontStyle:'bold'
    }).setOrigin(0.5);

    this.add.rectangle(width/2, height/2, 520, 420, 0x000000, 0.65)
      .setStrokeStyle(2, 0x00ffff);

    this.add.text(width/2, 150, 'LOGIN', {
      fontSize:'34px', color:'#ffffff', fontStyle:'bold'
    }).setOrigin(0.6);

    const email = this.add.dom(width/2, 240).createFromHTML(`
      <input id='email' type='email' placeholder='E-mail' style='width:320px;height:44px;padding:10px;border-radius:8px;border:1px solid #00ffff;background:#111;color:#fff; position:relative; z-index:1;'>
    `);

    const senha = this.add.dom(width/2, 310).createFromHTML(`
      <input id='senha' type='password' placeholder='Senha' style='width:320px;height:44px;padding:10px;border-radius:8px;border:1px solid #00ffff;background:#111;color:#fff;'>
    `);

    const entrar = this.add.rectangle(width/2, 390, 320, 52, 0x00aaff, 0.9)
      .setInteractive({ useHandCursor:true });

    this.add.text(width/2, 390, 'ENTRAR', {
      fontSize:'24px', color:'#ffffff', fontStyle:'bold'
    }).setOrigin(0.5);

    const status = this.add.text(width/2, 455, '', {
      fontSize:'18px', color:'#ffff00'
    }).setOrigin(0.5);

    entrar.on('pointerdown', () => {
      const emailValue = email.node.querySelector('#email').value.trim();
      const senhaValue = senha.node.querySelector('#senha').value.trim();

      if(!emailValue || !senhaValue){
        status.setText('Preencha e-mail e senha');
        return;
      }

      localStorage.setItem('chaos_user', emailValue);
      status.setText('Login realizado!');
      this.time.delayedCall(700, () => this.scene.start('MenuScene'));
    });

    this.add.text(width/2, height-60, 'Primeiro acesso? Clique em ENTRAR para testar.', {
      fontSize:'16px', color:'#cccccc'
    }).setOrigin(0.5);
  }
}
