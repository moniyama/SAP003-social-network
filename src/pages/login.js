import Button from '../components/button.js';
import Input from '../components/input.js';
import Image from '../components/image.js';

const signIn = () => {
  const email = document.querySelector('.js-email-input').value;
  const password = document.querySelector('.js-password-input').value;

  firebase.auth().signInWithEmailAndPassword(email, password).then(() => {
    window.location = '#feed';
  }).catch((error) => {
    window.erro(error);
  });
};

const google = () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithPopup(provider).then((currentUser) => {
    firebase.firestore()
      .collection('users')
      .where('user_uid', '==', currentUser.user.uid)
      .get()
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
};

const Login = () => {
  window.location.href = '#login';
  const template = `
    <main class='tela'>
      <section class='box-logo'>
        ${Image({ class: 'logo', alt: 'logo', src: './imagens/yellowbag.png' })}
      </section>
    
      <section class='box-login'>
        <h1 class='title'>&lt Yellow Bag &gt</h1>
        <h3 class='subtitle'>Bem vindo, viajante!</h3>
        <form>
          ${Input({ type: 'email', class: 'js-email-input input-entrada', placeholder: '  Email' })}
          ${Input({ type: 'password', class: 'js-password-input input-entrada', placeholder: '  Senha' })}
          ${Button({ classType: 'button', title: 'Entrar', onclick: signIn })}
        </form>
        <p class='error'></p>
        <label>Entrar com a conta do Google</label>
          ${Button({
    icone: 'fab fa-google', class: 'google', classType: 'round-button', title: 'google', onclick: google,
  })}
        <p>Ainda não tem uma conta? <a href='#register'>Registre-se</a></p>
      </section>
    </main>
  `;

  return template;
};

export default Login;
