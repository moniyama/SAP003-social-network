import Register from './pages/register.js';
import Login from './pages/login.js';
import Feed from './pages/feed.js';
import Config from './pages/config.js';
import Profile from './pages/profile.js';

function autoresize(event) {
  event.preventDefault();
  const txt = document.querySelector('.js-text-input');
  txt.style.cssText = 'height: auto';
  txt.style.height = `${txt.scrollHeight}px`;
}

function verificaUser() {
  firebase.auth().onAuthStateChanged((user) => {
    const currentHash = window.location.hash;
    const main = document.querySelector('main');
    if (user) {
      switch (currentHash) {
        case '#profile':
          main.innerHTML = Profile();
          window.profile.loadProfile();
          window.profile.userPosts();
          break;
        case '#config':
          main.innerHTML = Config();
          break;
        default:
          main.innerHTML = Feed();
          window.app.printName();
          window.app.loadData('.js-post'); 
          document.querySelector('.js-text-input').addEventListener('input', autoresize);
      }
    } else if (!user) {
      switch (currentHash) {
        case '#register':
          main.innerHTML = Register();
          break;
        default:
          main.innerHTML = Login();
      }
    }
  });
}

window.addEventListener('load', verificaUser);
window.addEventListener('hashchange', () => {
  verificaUser();
}, false);
