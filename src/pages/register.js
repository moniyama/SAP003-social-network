import Button from '../components/button.js';
import Input from '../components/input.js';
import Image from '../components/image.js';

function saveUser() {
  const firestoreUserCollection = firebase.firestore().collection('users');
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
  firestoreUserCollection.add(user);
}

function create() {
  const email = document.querySelector('.js-email-register-input').value;
  const password = document.querySelector('.js-password-register-input').value;
  const passwordConfirmation = document.querySelector('.js-confirm-password-input').value;
  const nome = document.querySelector('.js-text-input').value;
  const sobrenome = document.querySelector('.js-text2-input').value;
  const errorMessage = document.querySelector('.error');

  if (nome === '' || sobrenome === '') {
    errorMessage.textContent = 'Preencha os campos em branco';
  } else if (password === passwordConfirmation) {
    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then(() => {
        window.location = '#feed';
        window.saveUser();
      }).catch((error) => {
        const errorCode = error.code;
        if (errorCode === 'auth/weak-password') errorMessage.textContent = 'A senha deve possuir no mínimo 6 caracteres';
        if (errorCode === 'auth/email-already-in-use') errorMessage.textContent = 'O e-mail informado já está em uso';
        if (errorCode === 'auth/operation-not-allowed') errorMessage.textContent = 'Conta não ativada';
        if (errorCode === 'auth/invalid-email') errorMessage.textContent = 'Email inválido';
      });
  } else if (password !== passwordConfirmation) {
    errorMessage.textContent = 'Senha não confere';
  } else if (email === '' || password === '') {
    errorMessage.textContent = 'Preencha os campos em branco';
  }
}


function Register() {
  const template = `
    ${Image({ class: 'logo', alt: 'logo', src: './imagens/yellowbag.png' })}
    <section class="box-login">
    <h1>Criar Conta</h1>
    <form>
      ${Input({ type: 'email', class: 'js-email-register-input input-register', placeholder: 'email' })}
      ${Input({ type: 'password', class: 'js-password-register-input input-register', placeholder: 'senha' })}
      ${Input({ type: 'password', class: 'js-confirm-password-input input-register', placeholder: 'confirmar senha' })}
      ${Input({ type: 'text', class: 'js-text-input input-register', placeholder: 'nome' })}
      ${Input({ type: 'text', class: 'js-text2-input input-register', placeholder: 'sobrenome' })}
      ${Input({ type: 'text', class: 'js-bio-input input-register', placeholder: 'bio' })}
      <select class='js-status-input  input-register'>
        <option value= >Status de Relacionamento</option>
        <option value='Solteiro(a)'>Solteiro(a)</option>
        <option value='Relacionamento Sério'>Relacionamento Sério</option> 
        <option value='Relacionamento Aberto'>Relacionamento Aberto</option> 
        <option value='Casado(a)'>Casado(a)</option>
        <option value='Divorciado(a)'>Divorciado(a)</option>
        <option value='Viúvo(a)'>Viúvo(a)</option>";
      </select>
      <label>Data de nascimento:</label>
      ${Input({ type: 'date', class: 'js-date-input input-register', placeholder: 'data de nascimento' })}<div>
      ${Button({ class: 'create', title: 'Criar conta', onclick: create })}
    </form>
    <p class="error"></p>
    <p>Já tem uma conta? <a href="#login">Fazer Login</a></p>
    </section>
  `;
  return template;
}

window.saveUser = saveUser;

export default Register;
