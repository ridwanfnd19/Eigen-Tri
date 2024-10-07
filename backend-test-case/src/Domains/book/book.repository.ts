import { CreateBookDto } from 'src/Interface/api/book/dto/create-book.dto.js';
import { BookM } from './model/book.js';

export interface BookRepository {
  createBook(createBookDto: CreateBookDto): Promise<BookM>;
  getBooks(): Promise<BookM[]>;
  getBookById(id: string): Promise<BookM>;
  updateBookStoctById(id: string, stoct: number);
}
