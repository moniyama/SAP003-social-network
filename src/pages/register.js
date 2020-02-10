import Button from '../components/button.js';
import Input from '../components/input.js';
import Image from '../components/image.js';

const saveUser = () => {
  const nome = document.querySelector('.js-text-input');
  const sobrenome = document.querySelector('.js-text2-input');
  const bio = document.querySelector('.js-bio-input');
  const status = document.querySelector('.js-status-input');
  const nascimento = document.querySelector('.js-date-input');
  const user = {
    nome: nome.value,
    sobrenome: sobrenome.value,
    bio: bio.value,
    status: status.value,
    nascimento: nascimento.value,
    user_uid: firebase.auth().currentUser.uid,
  };
  firebase.firestore().collection('users').add(user);
};

const create = () => {
  const email = document.querySelector('.js-email-register-input').value;
  const password = document.querySelector('.js-password-register-input').value;
  const passwordConfirmation = document.querySelector('.js-confirm-password-input').value;
  const nome = document.querySelector('.js-text-input').value;
  const sobrenome = document.querySelector('.js-text2-input').value;
  const errorMessage = document.querySelector('.error');

  if (nome === '' || sobrenome === '' || email === '' || password === '') {
    errorMessage.textContent = 'Preencha os campos em branco';
  } else if (password !== passwordConfirmation) {
    errorMessage.textContent = 'Senha não confere';
  } else if (password === passwordConfirmation) {
    firebase.auth().createUserWithEmailAndPassword(email, password).then(() => {
      window.location = '#feed';
      window.saveUser();
    }).catch((error) => {
      window.erro(error);
    });
  }
};

const Register = () => {
  const template = `
  <main class='tela'>
    ${Image({ class: 'logo', alt: 'logo', src: './imagens/yellowbag.png' })}
    <section class='box-register'>
    <h1>Criar Conta</h1>
    <form>
      ${Input({ type: 'email', class: 'js-email-register-input input-register', placeholder: ' email' })}
      ${Input({ type: 'password', class: 'js-password-register-input input-register', placeholder: ' senha' })}
      ${Input({ type: 'password', class: 'js-confirm-password-input input-register', placeholder: ' confirmar senha' })}
      ${Input({ type: 'text', class: 'js-text-input input-register', placeholder: ' nome' })}
      ${Input({ type: 'text', class: 'js-text2-input input-register', placeholder: ' sobrenome' })}
      ${Input({
    type: 'text', maxlength: '100', class: 'js-bio-input input-register', placeholder: ' bio'
  })}
      <select class='js-status-input  input-register'>
        <option value= >Status de Relacionamento</option>
        <option value='Solteiro(a)'>Solteiro(a)</option>
        <option value='Relacionamento Sério'>Relacionamento Sério</option> 
        <option value='Relacionamento Aberto'>Relacionamento Aberto</option> 
        <option value='Casado(a)'>Casado(a)</option>
        <option value='Divorciado(a)'>Divorciado(a)</option>
        <option value='Viúvo(a)'>Viúvo(a)</option>
      </select>
      <label>Data de nascimento:</label>
      ${Input({ type: 'date', class: 'js-date-input input-register', placeholder: ' data de nascimento' })}<div>
      ${Button({ classType: 'button', title: 'Criar conta', onclick: create })}
    </form>
    <p class='error'></p>
    <p>Já tem uma conta? <a href='#login'>Fazer Login</a></p>
    </section>
  </main>
  `;

  return template;
};

window.saveUser = saveUser;

export default Register;
