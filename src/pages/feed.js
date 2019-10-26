import Button from '../components/button.js';
import Input from '../components/input.js';
import Card from '../components/card.js';
import CardUser from '../components/card-user.js';

function logout() {
  firebase.auth().signOut()
    .then(() => {
      window.location = '#login';
    });
}

function profile() {
  window.location = '#profile';
}

function editPost(event) {
  const id = event.currentTarget.dataset.id;
  document.querySelector(`textarea[id='${id}']`).disabled = false;
  const saveButton = document.querySelector(`.save[data-id='${id}']`);
  saveButton.style.display = 'inline-block';
}

function savePostEdited(event) {
  const id = event.currentTarget.dataset.id;
  const saveButton = document.querySelector(`.save[data-id='${id}']`);
  saveButton.style.display = 'none';
  const textArea = document.querySelector(`textarea[id='${id}']`);
  textArea.disabled = true;
  const postCollection = firebase.firestore().collection('posts');
  postCollection.doc(id).update({
    txt: textArea.value,
  });
}

function postDelete(event) {
  const dataId = event.currentTarget.dataset.id;
  const postCollection = firebase.firestore().collection('posts');
  postCollection.doc(dataId).delete();
  document.querySelector(`li[data-id='${dataId}']`).remove();
}

function printData(post, classe) {
  const postList = document.querySelector(classe);
  const idPost = post.id;
  const date = post.data().date.toDate().toLocaleString('pt-BR');
  const txt = post.data().txt;
  const userId = post.data().user_uid;

  const usersCollection = firebase.firestore().collection('users');
  usersCollection.onSnapshot((snap) => {
    snap.forEach((user) => {
      if (user.data().user_uid === userId) {
        const nome = ` ${user.data().nome} ${user.data().sobrenome}`;
        if (userId === firebase.auth().currentUser.uid) {
          const postTemplateUser = `
          ${CardUser(idPost, date, txt, nome)}
          `;
          postList.innerHTML += postTemplateUser;

          const posts = document.getElementById(idPost);
          posts.style.height = `${posts.scrollHeight}px`;
        } else {
          const postTemplate = `
            ${Card(idPost, date, txt, nome)}
            `;
          postList.innerHTML += postTemplate;

          const posts = document.getElementById(idPost);
          posts.style.height = `${posts.scrollHeight}px`;
        }
      }
    });
  });
}

function loadData(classe) {
  const postCollection = firebase.firestore().collection('posts');
  const postList = document.querySelector(classe);
  postList.innerHTML = 'Carregando...';
  postCollection.orderBy('date', 'desc').onSnapshot((snap) => {
    postList.innerHTML = '';
    snap.forEach((post) => {
      printData(post, '.js-post');
    });
  });
}

function savePost() {
  const txt = document.querySelector('.js-text-input');
  const post = {
    txt: txt.value,
    date: new Date(),
    comments: [],
    likes: 0,
    user_uid: firebase.auth().currentUser.uid,
  };
  const postCollection = firebase.firestore().collection('posts');
  postCollection.add(post)
    .then(() => {
      txt.value = '';
      txt.style.height = '34px';
    });
}

function showMenubar() {
  const list = document.getElementById('lista-menu');
  if (list.style.display === 'block') {
    list.style.display = 'none';
  } else {
    list.style.display = 'block';
  }
}

function printName() {
  const userId = firebase.auth().currentUser.uid;
  firebase.firestore().collection('users').where('user_uid', '==', userId).get()
    .then((querySnapshot) => {
      querySnapshot.forEach((user) => {
        const nome = user.data().nome;
        document.getElementById('name').innerHTML = ` Olá, ${nome}`;
      });
    });
}

function Feed() {
  const template = `
  <nav class="navbar">
    <div class="nav-btn-div">
      ${Button({ class: 'nav-btn', onclick: showMenubar, title: '<i class="fas fa-bars"></i>' })}
      <ul class="toggle-content" id="lista-menu">
        <li> ${Button({ class: 'profile', title: 'Perfil', onclick: profile })} </li>
        <li> ${Button({ class: 'profile', title: 'Sair', onclick: logout })}</li>
        </ul>
    </div>
    <a class="navbar-brand title">&lt Yellow Bag &gt</a>
  </nav>

  <section class="box-intro">
    <h4 class='name' id='name'></h4>
    <p>Compartilhe suas aventuras!</p>

  </section>

  <section class="box-post">
    <form>
      <textarea class='js-text-input input-feed' placeholder= 'Escreva sua publicação aqui...'></textarea><br>
      ${Button({ class: 'publicar', title: 'Publicar', onclick: savePost })}<br>
    </form>
  <ul class="js-post"></ul>
  </section>
  `;
  window.location = '#feed';

  return template;
}

window.app = {
  loadData,
  printData,
  postDelete,
  printName,
  editPost,
  savePostEdited,
  showMenubar,
  logout,
};

export default Feed;
