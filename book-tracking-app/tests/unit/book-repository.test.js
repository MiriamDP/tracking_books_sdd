import test from 'node:test';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';

import {
  STORAGE_KEY,
  addBook,
  deleteBook,
  readAllBooks,
  saveBooks,
  updateBookStatus,
} from '../../src/persistence/book-repository.js';

const setupDom = () => {
  const dom = new JSDOM('', { url: 'http://localhost' });
  globalThis.window = dom.window;
  globalThis.localStorage = dom.window.localStorage;
};

test.beforeEach(() => {
  setupDom();
  globalThis.localStorage.clear();
});

test.afterEach(() => {
  delete globalThis.window;
  delete globalThis.localStorage;
});

test('readAllBooks returns empty list when nothing is stored', () => {
  assert.deepEqual(readAllBooks(), []);
});

test('saveBooks writes versioned payload', () => {
  const list = [{ id: '1', title: 'Test', status: 'pending' }];
  saveBooks(list);

  const payload = JSON.parse(globalThis.localStorage.getItem(STORAGE_KEY));
  assert.equal(payload.version, 1);
  assert.deepEqual(payload.books, list);
});

test('addBook persists books through localStorage', () => {
  const added = addBook({ id: 'x', title: 'A', status: 'pending' });
  assert.equal(added.length, 1);
  assert.equal(readAllBooks()[0].id, 'x');
});

test('updateBookStatus updates existing status and keeps data', () => {
  addBook({ id: 'a', title: 'One', status: 'pending' });
  updateBookStatus('a', 'read');
  assert.equal(readAllBooks()[0].status, 'read');
});

test('deleteBook removes the selected book', () => {
  addBook({ id: 'a', title: 'One', status: 'pending' });
  addBook({ id: 'b', title: 'Two', status: 'read' });
  deleteBook('a');
  assert.deepEqual(readAllBooks().map((book) => book.id), ['b']);
});

test('readAllBooks throws on invalid JSON', () => {
  globalThis.localStorage.setItem(STORAGE_KEY, '{invalid json');
  assert.throws(() => readAllBooks(), /corruptos|leer/i);
});
