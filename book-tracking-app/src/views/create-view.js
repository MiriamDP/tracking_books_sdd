import { createBook } from '../model/book.js';
import { addBook } from '../persistence/book-repository.js';

const FALLBACK_MESSAGE = 'No se pudo guardar el libro.';

export function renderCreateView(container, options = {}) {
  const { onNavigate = defaultNavigate } = options;

  container.innerHTML = `
    <div class="app-shell">
      <header class="topbar">
        <h1>Bookify</h1>
        <button class="ghost-button" type="button" data-action="cancel-create">Volver a mi biblioteca</button>
      </header>
      <div class="page-content">
        <main class="form-panel create-panel" aria-label="Formulario para añadir un libro">
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
              <button class="ghost-button" id="cancel-create" type="button">Cancelar</button>
              <button class="primary-button" type="submit">Guardar libro</button>
            </div>
          </form>
        </main>
      </div>
    </div>
  `;

  const form = container.querySelector('#book-form');
  const titleInput = container.querySelector('#title');
  const titleError = container.querySelector('#title-error');

  container.querySelectorAll('[data-action="cancel-create"], #cancel-create').forEach((button) => {
    button.addEventListener('click', () => onNavigate('#/'));
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    titleError.textContent = '';

    const title = String(titleInput.value || '').trim();
    const author = String(container.querySelector('#author').value || '').trim();
    const coverInput = container.querySelector('#cover');
    const file = coverInput.files ? coverInput.files[0] : undefined;

    if (!title) {
      titleError.textContent = 'El título es obligatorio.';
      titleInput.focus();
      return;
    }

    void saveBook({ container, form, title, author, file, onNavigate });
  });
}

async function saveBook({ container, form, title, author, file, onNavigate }) {
  try {
    let coverDataUrl = null;

    if (file) {
      if (file.size >= 2 * 1024 * 1024) {
        showNotice(container, 'La portada supera 2 MiB y se omite.', 'warning');
      } else {
        coverDataUrl = await readFileAsDataUrl(file, container.ownerDocument.defaultView);
      }
    }

    addBook(createBook({ title, author, coverDataUrl }));
    form.reset();
    onNavigate('#/');
  } catch (error) {
    const message = error && error.message ? error.message : FALLBACK_MESSAGE;
    showNotice(container, message, 'error');
  }
}

function readFileAsDataUrl(file, windowObject) {
  return new Promise((resolve, reject) => {
    const reader = new windowObject.FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('No se pudo leer la imagen seleccionada.'));
    reader.readAsDataURL(file);
  });
}

function showNotice(container, message, type = 'warning') {
  const notice = container.querySelector('#storage-note');
  if (!notice) {
    return;
  }

  notice.className = `notice-box ${type}`;
  notice.setAttribute('role', type === 'error' ? 'alert' : 'status');
  notice.textContent = message;
}

function defaultNavigate(path) {
  if (typeof window !== 'undefined') {
    window.location.hash = path;
  }
}
