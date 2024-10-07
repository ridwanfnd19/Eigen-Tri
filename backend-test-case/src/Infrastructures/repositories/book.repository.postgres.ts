import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BookRepository } from 'src/Domains/book/book.repository.js';
import { Book } from '../entities/book.entity.js';
import { Repository } from 'typeorm';
import { BookM } from 'src/Domains/book/model/book.js';
import { CreateBookDto } from 'src/Interface/api/book/dto/create-book.dto.js';

@Injectable()
export class BookRepositoryOrm implements BookRepository {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
  ) {}

  async createBook(createBookDto: CreateBookDto): Promise<BookM> {
    return await this.bookRepository.save(createBookDto);
  }

  async getBooks(): Promise<BookM[]> {
    return await this.bookRepository.find();
  }

  async getBookById(id: string): Promise<BookM> {
    return await this.bookRepository.findOneBy({
      id,
    });
  }

  async updateBookStoctById(id: string, stock: number) {
    return await this.bookRepository.update(id, { stock });
  }
}
