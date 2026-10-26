import { createBook, groupBooks, BOOK_STATUS } from '../model/book.js';
import { addBook, readAllBooks } from '../persistence/book-repository.js';

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
    return;
  }

  const groupedBooks = groupBooks(books);
  const pending = groupedBooks.filter((book) => book.status === BOOK_STATUS.PENDING);
  const read = groupedBooks.filter((book) => book.status === BOOK_STATUS.READ);

  container.innerHTML = createShell(`
    <div class="layout-grid">
      <aside class="form-panel" aria-label="Formulario para añadir un libro">
        <h2>Añadir libro</h2>
        <form id="book-form" novalidate>
          <div class="form-field">
            <label for="title">Título *</label>
            <input id="title" name="title" type="text" maxlength="200" required aria-describedby="title-error" />
            <div id="title-error" class="field-error" aria-live="polite"></div>
          </div>

          <div class="form-field">
            <label for="author">Autor</label>
            <input id="author" name="author" type="text" maxlength="200" />
          </div>

          <div class="form-field">
            <label for="cover">Portada</label>
            <input id="cover" name="cover" type="file" accept="image/*" />
          </div>

          <div class="notice-box" id="storage-note">
            Los datos se guardan en este navegador y origen local. Pueden perderse al borrar datos del navegador y no están protegidos por autenticación.
          </div>

          <div class="form-actions">
            <button class="primary-button" type="submit">Guardar libro</button>
          </div>
        </form>
      </aside>

      <main class="list-panel" aria-label="Lista de libros">
        <h2>Mi biblioteca</h2>
        ${renderBookSections(pending, read)}
      </main>
    </div>
  `);

  const form = document.getElementById('book-form');
  const titleInput = document.getElementById('title');
  const titleError = document.getElementById('title-error');

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    void (async () => {
      titleError.textContent = '';

      const titleInput = document.getElementById('title');
      const authorInput = document.getElementById('author');
      const coverInput = document.getElementById('cover');
      const title = String(titleInput?.value || '').trim();
      const author = String(authorInput?.value || '').trim();
      const file = coverInput && coverInput.files ? coverInput.files[0] : undefined;

      if (!title) {
        titleError.textContent = 'El título es obligatorio.';
        titleInput.focus();
        return;
      }

      try {
        let coverDataUrl = null;

        if (file) {
          if (file.size >= 2 * 1024 * 1024) {
            showNotice('La portada supera 2 MiB y se omite.', 'warning');
          } else {
            coverDataUrl = await readFileAsDataUrl(file);
          }
        }

        const book = createBook({ title, author, coverDataUrl });
        addBook(book);
        form.reset();
        renderHomeView(container, { onNavigate });
      } catch (error) {
        const message = error && error.message ? error.message : FALLBACK_MESSAGE;
        showNotice(message, 'error');
      }
    })();
  });

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
        <button class="primary-button" type="button" onclick="window.location.hash = '#/'">Añadir libro</button>
      </header>
      <div class="page-content">
        ${innerHtml}
      </div>
    </div>
  `;
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

async function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('No se pudo leer la imagen seleccionada.'));
    reader.readAsDataURL(file);
  });
}

function showNotice(message, type = 'warning') {
  const notice = document.getElementById('storage-note');
  if (!notice) {
    return;
  }

  notice.className = `notice-box ${type}`;
  notice.textContent = message;
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
