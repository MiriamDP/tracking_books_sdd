import { BOOK_STATUS, toggleBookStatus } from '../model/book.js';
import { deleteBook, readAllBooks, updateBookStatus } from '../persistence/book-repository.js';

export function renderDetailView(container, bookId, options = {}) {
  const { onNavigate = defaultNavigate } = options;

  let book = null;

  try {
    const books = readAllBooks();
    book = books.find((candidate) => candidate.id === bookId) || null;
  } catch (error) {
    container.innerHTML = createShell(
      `<div class="notice-box error" role="alert">${escapeHtml(error.message || 'No se pudo cargar el libro.')}</div>`
    );
    return;
  }

  if (!book) {
    container.innerHTML = createShell(`
      <div class="not-found" role="alert">
        <h2>Libro no disponible</h2>
        <p>Este libro ya no está disponible en la biblioteca.</p>
        <button class="primary-button" type="button" data-back-home>Volver a la biblioteca</button>
      </div>
    `);

    const backButton = container.querySelector('[data-back-home]');
    backButton?.addEventListener('click', () => onNavigate('#/'));
    return;
  }

  const nextStatusText = book.status === BOOK_STATUS.PENDING ? 'Marcar como leído' : 'Marcar como pendiente';

  container.innerHTML = createShell(`
    <div class="detail-panel" aria-label="Detalle del libro">
      <div class="detail-header">
        <h2>Detalle del libro</h2>
        <button class="ghost-button" type="button" data-back-home>Volver</button>
      </div>

      <div class="detail-info">
        ${book.coverDataUrl ? `<img class="detail-cover" src="${book.coverDataUrl}" alt="Portada de ${escapeHtml(book.title)}" />` : '<div class="book-cover placeholder detail-cover">Sin portada</div>'}
        <div>
          <p><strong>Título:</strong> ${escapeHtml(book.title)}</p>
          <p><strong>Autor:</strong> ${escapeHtml(book.author || 'Sin autor')}</p>
          <p><strong>Estado:</strong> ${book.status === BOOK_STATUS.PENDING ? 'Pendiente' : 'Leído'}</p>
        </div>
      </div>

      <div class="detail-actions">
        <button class="secondary-button" type="button" data-toggle-status>${nextStatusText}</button>
        <button class="danger-button" type="button" data-delete-book>Eliminar</button>
      </div>
    </div>
  `);

  container.querySelector('[data-back-home]')?.addEventListener('click', () => onNavigate('#/'));

  container.querySelector('[data-toggle-status]')?.addEventListener('click', () => {
    try {
      const updated = toggleBookStatus(book);
      updateBookStatus(updated.id, updated.status);
      renderDetailView(container, updated.id, { onNavigate });
    } catch (error) {
      showFailureNotice(container, error.message || 'No se pudo cambiar el estado.');
    }
  });

  container.querySelector('[data-delete-book]')?.addEventListener('click', () => {
    const confirmed = window.confirm('¿Seguro que quieres eliminar este libro?');
    if (!confirmed) {
      return;
    }

    try {
      deleteBook(book.id);
      onNavigate('#/');
    } catch (error) {
      showFailureNotice(container, error.message || 'No se pudo eliminar el libro.');
    }
  });
}

function createShell(innerHtml) {
  return `
    <div class="app-shell">
      <header class="topbar">
        <h1>Bookify</h1>
        <button class="primary-button" type="button" onclick="window.location.hash = '#/'">Volver a inicio</button>
      </header>
      <div class="page-content">
        ${innerHtml}
      </div>
    </div>
  `;
}

function showFailureNotice(container, message) {
  const notice = document.createElement('div');
  notice.className = 'notice-box error';
  notice.setAttribute('role', 'alert');
  notice.textContent = message;
  container.prepend(notice);
}

function defaultNavigate(path) {
  if (typeof window !== 'undefined') {
    window.location.hash = path;
  }
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
