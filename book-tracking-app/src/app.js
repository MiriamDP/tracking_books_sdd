import { renderHomeView } from './views/home-view.js';
import { renderDetailView } from './views/detail-view.js';

const app = document.getElementById('app');

function navigate() {
  const hash = window.location.hash || '#/';

  if (hash.startsWith('#/books/')) {
    const bookId = decodeURIComponent(hash.replace('#/books/', ''));
    renderDetailView(app, bookId, { onNavigate: navigateToHash });
    return;
  }

  renderHomeView(app, { onNavigate: navigateToHash });
}

function navigateToHash(nextHash) {
  window.location.hash = nextHash;
}

window.addEventListener('hashchange', navigate);
navigate();
