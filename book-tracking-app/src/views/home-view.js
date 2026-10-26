import { groupBooks, BOOK_STATUS } from '../model/book.js';
import { readAllBooks } from '../persistence/book-repository.js';

const FALLBACK_MESSAGE = 'No se pudo cargar la colección de libros.';

export function renderHomeView(container, options = {}) {
  const { onNavigate = defaultNavigate } = options;

  let books = [];

  try {
    books = readAllBooks();
  } catch (error) {
    container.innerHTML = createShell(
      `<div class="notice-box error" role="alert">${escapeHtml(error.message || FALLBACK_MESSAGE)}</div>`
    );
    bindAddBookAction(container, onNavigate);
    return;
  }

  const groupedBooks = groupBooks(books);
  const pending = groupedBooks.filter((book) => book.status === BOOK_STATUS.PENDING);
  const read = groupedBooks.filter((book) => book.status === BOOK_STATUS.READ);

  container.innerHTML = createShell(`
    <main class="list-panel" aria-label="Lista de libros">
      <h2>Mi biblioteca</h2>
      ${renderBookSections(pending, read)}
    </main>
  `);

  bindAddBookAction(container, onNavigate);

  container.querySelectorAll('[data-book-id]').forEach((card) => {
    const openBook = () => {
      const id = card.getAttribute('data-book-id');
      onNavigate(`#/books/${encodeURIComponent(id)}`);
    };

    card.addEventListener('click', openBook);
    card.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openBook();
      }
    });
  });
}

function createShell(innerHtml) {
  return `
    <div class="app-shell">
      <header class="topbar">
        <h1>Bookify</h1>
        <button class="primary-button" type="button" data-action="add-book">Añadir libro</button>
      </header>
      <div class="page-content">
        ${innerHtml}
      </div>
    </div>
  `;
}

function bindAddBookAction(container, onNavigate) {
  container.querySelector('[data-action="add-book"]')?.addEventListener('click', () => {
    onNavigate('#/books/new');
  });
}

function renderBookSections(pending, read) {
  const pendingSection = renderSection('Pendientes', pending);
  const readSection = renderSection('Leídos', read);
  return `
    <div class="section-list">
      ${pendingSection}
      ${readSection}
    </div>
  `;
}

function renderSection(title, books) {
  if (!books.length) {
    return `
      <section class="section-card" aria-label="${title}">
        <h3>${title}</h3>
        <div class="empty-state">
          <p>No hay libros en esta sección.</p>
        </div>
      </section>
    `;
  }

  return `
    <section class="section-card" aria-label="${title}">
      <h3>${title}</h3>
      <div class="book-grid">
        ${books
          .map(
            (book) => `
              <article class="book-card" data-book-id="${book.id}" tabindex="0" role="button" aria-label="Abrir detalle de ${escapeHtml(book.title)}">
                ${renderCover(book)}
                <div class="book-meta">
                  <h4>${escapeHtml(book.title)}</h4>
                  ${book.author ? `<p>${escapeHtml(book.author)}</p>` : '<p>Sin autor</p>'}
                </div>
                <span class="book-status ${book.status === BOOK_STATUS.PENDING ? 'status-pending' : 'status-read'}">
                  ${book.status === BOOK_STATUS.PENDING ? 'Pendiente' : 'Leído'}
                </span>
              </article>
            `
          )
          .join('')}
      </div>
    </section>
  `;
}

function renderCover(book) {
  if (!book.coverDataUrl) {
    return '<div class="book-cover placeholder">Sin portada</div>';
  }

  return `<img class="book-cover" src="${book.coverDataUrl}" alt="Portada de ${escapeHtml(book.title)}" />`;
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
