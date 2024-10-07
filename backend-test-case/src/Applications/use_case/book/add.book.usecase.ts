import { HttpException, HttpStatus } from '@nestjs/common';
import { BookRepository } from 'src/Domains/book/book.repository.js';
import { BookM } from 'src/Domains/book/model/book.js';
import { CreateBookDto } from 'src/Interface/api/book/dto/create-book.dto.js';

export class AddBookUseCase {
  constructor(private bookRepository: BookRepository) {}

  async execute(createBookDto: CreateBookDto): Promise<BookM> {
    try {
      return await this.bookRepository.createBook(createBookDto);
    } catch (error) {
      if (error instanceof HttpException) {
        throw new HttpException(error.message, error.getStatus());
      }
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
