export const STORAGE_KEY = 'bookify-books-v1';

export class StorageFailure extends Error {
  constructor(message) {
    super(message);
    this.name = 'StorageFailure';
  }
}

export function getStorage() {
  const storageTarget = typeof window !== 'undefined' ? window.localStorage : globalThis.localStorage;

  if (!storageTarget) {
    throw new StorageFailure('El navegador no permite acceder al almacenamiento local.');
  }

  return storageTarget;
}

export function readAllBooks() {
  try {
    const storage = getStorage();
    const rawValue = storage.getItem(STORAGE_KEY);

    if (rawValue === null) {
      return [];
    }

    const parsed = JSON.parse(rawValue);
    if (!parsed || !Array.isArray(parsed.books)) {
      throw new StorageFailure('Los datos guardados están corruptos o incompletos.');
    }

    return parsed.books;
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new StorageFailure('Los datos guardados están corruptos y no se han podido leer.');
    }

    if (error instanceof StorageFailure) {
      throw error;
    }

    if (error && error.name === 'QuotaExceededError') {
      throw new StorageFailure('No hay espacio suficiente para guardar la colección.');
    }

    if (error && error.name === 'SecurityError') {
      throw new StorageFailure('El acceso al almacenamiento local está bloqueado.');
    }

    throw new StorageFailure('No se pudo leer la colección de libros.');
  }
}

export function saveBooks(books) {
  const payload = { version: 1, books: books };
  const serialized = JSON.stringify(payload);

  try {
    const storage = getStorage();
    storage.setItem(STORAGE_KEY, serialized);

    const written = storage.getItem(STORAGE_KEY);
    if (written !== serialized) {
      throw new StorageFailure('La escritura no se pudo confirmar en el almacenamiento local.');
    }

    return payload.books;
  } catch (error) {
    if (error instanceof StorageFailure) {
      throw error;
    }

    if (error && error.name === 'QuotaExceededError') {
      throw new StorageFailure('La operación de guardado excedió la cuota del almacenamiento local.');
    }

    if (error && error.name === 'SecurityError') {
      throw new StorageFailure('El acceso al almacenamiento local está bloqueado.');
    }

    throw new StorageFailure('No se pudo guardar la colección de libros.');
  }
}

export function addBook(book) {
  const books = readAllBooks();
  const nextBooks = [...books, book];
  return saveBooks(nextBooks);
}

export function updateBookStatus(id, nextStatus) {
  const books = readAllBooks();
  const updated = books.map((book) => {
    if (book.id !== id) {
      return book;
    }

    return { ...book, status: nextStatus };
  });

  return saveBooks(updated);
}

export function deleteBook(id) {
  const books = readAllBooks();
  const filtered = books.filter((book) => book.id !== id);
  return saveBooks(filtered);
}
