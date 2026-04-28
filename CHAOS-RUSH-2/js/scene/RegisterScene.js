import { supabase } from '../supabaseClient.js';

export default class RegisterScene extends Phaser.Scene {
  constructor() {
    super({ key: 'RegisterScene' });
  }

  create() {
    const { width, height } = this.scale;
    this.cameras.main.setBackgroundColor('#080a10');

    this.add.text(width / 2, 80, 'CHAOS RUSH', {
      fontSize: '52px', color: '#00ffff', fontStyle: 'bold'
    }).setOrigin(0.5);

    this.add.rectangle(width / 2, height / 2, 520, 520, 0x000000, 0.65)
      .setStrokeStyle(2, 0x00ffff);

    this.add.text(width / 2, 220, 'REGISTRE-SE', {
      fontSize: '34px', color: '#ffffff', fontStyle: 'bold', fontFamily: 'Tektur'
    }).setOrigin(0.6);

    const nome = this.add.dom(width / 2, 300).createFromHTML(`
      <input id='nome' type='text' placeholder='Nome' style='width:320px;height:44px;padding:10px;border-radius:8px;border:1px solid #00ffff;background:#111;color:#fff;'>
    `);

    const email = this.add.dom(width / 2, 360).createFromHTML(`
      <input id='email' type='email' placeholder='E-mail' style='width:320px;height:44px;padding:10px;border-radius:8px;border:1px solid #00ffff;background:#111;color:#fff;'>
    `);

    const senha = this.add.dom(width / 2, 420).createFromHTML(`
      <div style='position:relative;width:320px;height:44px;'>
        <input id='senha' type='password' placeholder='Senha' style='width:100%;height:44px;padding:10px 46px 10px 10px;border-radius:8px;border:1px solid #00ffff;background:#111;color:#fff;box-sizing:border-box;'>
        <button id='toggle-senha' type='button' aria-label='Mostrar senha' style='position:absolute;right:8px;top:50%;transform:translateY(-50%);width:32px;height:32px;border:none;background:transparent;color:#00ffff;font-size:18px;cursor:pointer;'>&#128065;</button>
      </div>
    `);

    const confirmar = this.add.dom(width / 2, 480).createFromHTML(`
      <div style='position:relative;width:320px;height:44px;'>
        <input id='confirmar-senha' type='password' placeholder='Confirmar senha' style='width:100%;height:44px;padding:10px 46px 10px 10px;border-radius:8px;border:1px solid #00ffff;background:#111;color:#fff;box-sizing:border-box;'>
        <button id='toggle-confirmar-senha' type='button' aria-label='Mostrar senha' style='position:absolute;right:8px;top:50%;transform:translateY(-50%);width:32px;height:32px;border:none;background:transparent;color:#00ffff;font-size:18px;cursor:pointer;'>&#128065;</button>
      </div>
    `);

    const senhaInput = senha.node.querySelector('#senha');
    const toggleSenha = senha.node.querySelector('#toggle-senha');
    const confirmarInput = confirmar.node.querySelector('#confirmar-senha');
    const toggleConfirmarSenha = confirmar.node.querySelector('#toggle-confirmar-senha');

    toggleSenha.addEventListener('click', () => {
      const mostrando = senhaInput.type === 'text';
      senhaInput.type = mostrando ? 'password' : 'text';
      toggleSenha.setAttribute('aria-label', mostrando ? 'Mostrar senha' : 'Ocultar senha');
    });

    toggleConfirmarSenha.addEventListener('click', () => {
      const mostrando = confirmarInput.type === 'text';
      confirmarInput.type = mostrando ? 'password' : 'text';
      toggleConfirmarSenha.setAttribute('aria-label', mostrando ? 'Mostrar senha' : 'Ocultar senha');
    });

    const cadastrar = this.add.rectangle(width / 2, 550, 320, 52, 0x00aaff, 0.9)
      .setInteractive({ useHandCursor: true });

    this.add.text(width / 2, 550, 'CADASTRAR', {
      fontSize: '24px', color: '#ffffff', fontStyle: 'bold'
    }).setOrigin(0.5);

    const status = this.add.text(width / 2, 515, '', {
      fontSize: '18px', color: '#ffff00'
    }).setOrigin(0.5);

    cadastrar.on('pointerdown', async () => {
      const nomeValue = nome.node.querySelector('#nome').value.trim();
      const emailValue = email.node.querySelector('#email').value.trim();
      const senhaValue = senhaInput.value.trim();
      const confirmarValue = confirmarInput.value.trim();

      if (!nomeValue || !emailValue || !senhaValue || !confirmarValue) {
        status.setText('Preencha todos os campos');
        return;
      }

      if (senhaValue !== confirmarValue) {
        status.setText('As senhas não coincidem');
        return;
      }

      status.setText('Registrando...');

      const { data, error } = await supabase.auth.signUp({
        email: emailValue,
        password: senhaValue,
        options: {
          data: {
            nome: nomeValue
          }
        }
      });

      if (error) {
        console.error('Erro ao registrar:', error);
        status.setText(error.message || 'Erro ao registrar');
        return;
      }

      if (data.user && !data.session) {
        status.setText('Verifique seu e-mail para confirmar!');
      } else {
        status.setText('Registro realizado! Faça login.');
      }

      this.time.delayedCall(2000, () => this.scene.start('LoginScene'));
    });

    const loginLink = this.add.text(width / 2, height - 60, 'Já tem conta? Faça login.', {
      fontSize: '16px', color: '#cccccc'
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    loginLink.on('pointerdown', () => {
      this.scene.start('LoginScene');
    });
  }
}
