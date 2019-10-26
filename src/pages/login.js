import Button from '../components/button.js';
import Input from '../components/input.js';
import RoundButton from '../components/round-button.js';
import Image from '../components/image.js';

function signIn() {
  const email = document.querySelector('.js-email-input').value;
  const password = document.querySelector('.js-password-input').value;
  firebase.auth().signInWithEmailAndPassword(email, password).then(() => {
    window.location = '#feed';
  }).catch((error) => {
    const errorCode = error.code;
    const errorMessage = document.querySelector('.error');
    if (errorCode === 'auth/invalid-email') errorMessage.textContent = 'Email inválido';
    if (errorCode === 'auth/user-disabled') errorMessage.textContent = 'Usuário desabilitado';
    if (errorCode === 'auth/user-not-found') errorMessage.textContent = 'Usuário não encontrado';
    if (errorCode === 'auth/wrong-password') errorMessage.textContent = 'Senha incorreta';
  });
}

function google() {
  const provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithPopup(provider)
    .then((currentUser) => {
      const usersCollection = firebase.firestore().collection('users');
      usersCollection.where('user_uid', '==', currentUser.user.uid).get()
        .then((snap) => {
          if (snap.size === 0) {
            const user = {
              nome: currentUser.additionalUserInfo.profile.given_name,
              sobrenome: currentUser.additionalUserInfo.profile.family_name,
              user_uid: currentUser.user.uid,
            };
            firebase.firestore().collection('users').add(user);
            window.location = '#feed';
          } else {
            window.location = '#feed';
          }
        });
    });
}

function Login() {
  window.location.href = '#login';
  const template = `
    ${Image({ class: 'logo', alt: 'logo', src: './imagens/yellowbag.png' })}
    <section class="box-login">
      <h1 class="title">&lt Yellow Bag &gt</h1>
      <h3 class="subtitle">Bem vindo, viajante!</h3>
        <form>
          ${Input({ type: 'email', class: 'js-email-input input-entrada', placeholder: ' Email' })}
          ${Input({ type: 'password', class: 'js-password-input input-entrada', placeholder: ' Senha' })}
          ${Button({ class: 'signIn', title: 'Entrar', onclick: signIn })}
       </form>
      <section class="error"></section>
      <label>Entrar com a conta do Google</label>
        ${RoundButton({ icone: 'fab fa-google', class: 'google', title: 'google', onclick: google })}
      <p>Ainda não tem uma conta? <a href="#register">Registre-se</a></p>
    </section>
    `;

  return template;
}

export default Login;
