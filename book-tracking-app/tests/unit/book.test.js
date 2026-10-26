import test from 'node:test';
import assert from 'node:assert/strict';

import { BOOK_STATUS, createBook, groupBooks, toggleBookStatus } from '../../src/model/book.js';

test('createBook rejects empty titles', () => {
  assert.throws(() => createBook({ title: '   ' }), /título/i);
});

test('createBook defaults to pending status', () => {
  const book = createBook({ title: 'Dune' });
  assert.equal(book.status, BOOK_STATUS.PENDING);
});

test('createBook normalizes optional author and keeps cover field', () => {
  const book = createBook({ title: 'Neuromancer', author: '   William Gibson   ', coverDataUrl: 'data:image/png;base64,aaa' });
  assert.equal(book.author, 'William Gibson');
  assert.equal(book.coverDataUrl, 'data:image/png;base64,aaa');
});

test('groupBooks sorts pending before read and keeps createdAt order', () => {
  const books = [
    createBook({ id: 'b2', title: 'Book B', status: BOOK_STATUS.READ, createdAt: '2024-01-02T00:00:00.000Z' }),
    createBook({ id: 'a1', title: 'Book A', status: BOOK_STATUS.PENDING, createdAt: '2024-01-01T00:00:00.000Z' }),
    createBook({ id: 'a2', title: 'Book C', status: BOOK_STATUS.PENDING, createdAt: '2024-01-03T00:00:00.000Z' }),
  ];

  const ordered = groupBooks(books);
  assert.deepEqual(ordered.map((book) => book.id), ['a1', 'a2', 'b2']);
});

test('toggleBookStatus swaps pending/read status', () => {
  const pending = createBook({ title: 'Foundation' });
  const read = toggleBookStatus(pending);
  assert.equal(read.status, BOOK_STATUS.READ);
  assert.equal(toggleBookStatus(read).status, BOOK_STATUS.PENDING);
});
