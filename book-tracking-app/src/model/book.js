export const BOOK_STATUS = Object.freeze({
  PENDING: 'pending',
  READ: 'read',
});

const STORAGE_STATUS_VALUES = Object.values(BOOK_STATUS);

export function normalizeTitle(value) {
  return typeof value === 'string' ? value.trim() : '';
}

export function normalizeAuthor(value) {
  if (typeof value !== 'string') {
    return '';
  }

  const normalized = value.trim();
  return normalized;
}

export function isValidStatus(status) {
  return STORAGE_STATUS_VALUES.includes(status);
}

export function createBook({ id, title, author = '', status = BOOK_STATUS.PENDING, coverDataUrl = null, createdAt }) {
  const normalizedTitle = normalizeTitle(title);

  if (!normalizedTitle) {
    throw new Error('El título es obligatorio.');
  }

  if (status && !isValidStatus(status)) {
    throw new Error('El estado del libro no es válido.');
  }

  return {
    id: id || generateId(),
    title: normalizedTitle,
    author: normalizeAuthor(author),
    status: status || BOOK_STATUS.PENDING,
    coverDataUrl: coverDataUrl || null,
    createdAt: createdAt || new Date().toISOString(),
  };
}

export function groupBooks(books) {
  return [...books].sort((left, right) => {
    const statusOrder = statusRank(left.status) - statusRank(right.status);
    if (statusOrder !== 0) {
      return statusOrder;
    }

    const leftTime = new Date(left.createdAt).getTime();
    const rightTime = new Date(right.createdAt).getTime();

    if (leftTime !== rightTime) {
      return leftTime - rightTime;
    }

    return String(left.id).localeCompare(String(right.id));
  });
}

export function toggleBookStatus(book) {
  if (!book || !isValidStatus(book.status)) {
    throw new Error('No se puede cambiar el estado de un libro inválido.');
  }

  const nextStatus = book.status === BOOK_STATUS.PENDING ? BOOK_STATUS.READ : BOOK_STATUS.PENDING;
  return { ...book, status: nextStatus };
}

function statusRank(status) {
  return status === BOOK_STATUS.PENDING ? 0 : 1;
}

function generateId() {
  if (globalThis.crypto && typeof globalThis.crypto.randomUUID === 'function') {
    return globalThis.crypto.randomUUID();
  }

  return `book-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
