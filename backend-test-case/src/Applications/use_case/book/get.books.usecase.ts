import { HttpException, HttpStatus } from '@nestjs/common';
import { BookRepository } from 'src/Domains/book/book.repository.js';
import { BookM } from 'src/Domains/book/model/book.js';

export class GetBooksUseCase {
  constructor(private bookRepository: BookRepository) {}

  async execute(): Promise<BookM[]> {
    try {
      return await this.bookRepository.getBooks();
    } catch (error) {
      if (error instanceof HttpException) {
        throw new HttpException(error.message, error.getStatus());
      }
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
