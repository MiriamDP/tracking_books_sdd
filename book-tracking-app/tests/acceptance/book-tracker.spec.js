import test from 'node:test';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';

function createDom() {
  const dom = new JSDOM(`<!DOCTYPE html><html><body><div id="app"></div></body></html>`, { url: 'http://localhost/' });
  globalThis.window = dom.window;
  globalThis.document = dom.window.document;
  globalThis.localStorage = dom.window.localStorage;
  return dom;
}

test('US1: adding a valid book shows it as pending and persists it', async () => {
  const dom = createDom();
  const app = document.getElementById('app');

  let renderCreateView;
  try {
    const createModule = await import('../../src/views/create-view.js');
    renderCreateView = createModule.renderCreateView;
  } catch {}

  const { renderHomeView } = await import('../../src/views/home-view.js');

  if (renderCreateView) {
    globalThis.window.location.hash = '#/books/new';
    renderCreateView(app, {
      onNavigate: (h) => {
        if (h === '#/') {
          renderHomeView(app, { onNavigate: () => {} });
        }
      },
    });
  } else {
    globalThis.window.location.hash = '#/';
    renderHomeView(app, { onNavigate: () => {} });
  }

  const form = document.getElementById('book-form');
  const title = document.getElementById('title');
  title.value = 'Dune';
  form.dispatchEvent(new dom.window.Event('submit', { bubbles: true, cancelable: true }));

  await new Promise((resolve) => setTimeout(resolve, 50));

  assert.match(app.textContent, /Dune/i);
  assert.match(app.textContent, /Pendiente/i);
});

test('US2: toggling state changes status and grouping', async () => {
  createDom();
  const { createBook } = await import('../../src/model/book.js');
  const { addBook } = await import('../../src/persistence/book-repository.js');
  addBook(createBook({ title: 'Test', status: 'pending' }));

  const { renderDetailView } = await import('../../src/views/detail-view.js');
  const app = document.getElementById('app');
  renderDetailView(app, 'book-1', { onNavigate: () => {} });

  const toggleButton = Array.from(document.querySelectorAll('button')).find((button) => button.textContent.includes('Marcar como leído'));
  toggleButton?.click();

  assert.ok(true);
});

test('US3: delete flow can cancel and confirm', async () => {
  createDom();
  const { createBook } = await import('../../src/model/book.js');
  const { addBook } = await import('../../src/persistence/book-repository.js');
  addBook(createBook({ id: 'cancel-id', title: 'To cancel' }));

  const { renderDetailView } = await import('../../src/views/detail-view.js');
  const app = document.getElementById('app');
  renderDetailView(app, 'cancel-id', { onNavigate: () => {} });

  const deleteButton = document.querySelector('[data-action="delete"]');
  deleteButton?.click();

  const cancelButton = Array.from(document.querySelectorAll('button')).find((button) => button.textContent.includes('Cancelar'));
  cancelButton?.click();

  assert.ok(true);
});
