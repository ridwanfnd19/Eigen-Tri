import { HttpException, HttpStatus } from '@nestjs/common';
import { BookRepository } from 'src/Domains/book/book.repository.js';
import { BookM } from 'src/Domains/book/model/book.js';
import { CreateBookDto } from 'src/Interface/api/book/dto/create-book.dto.js';
import { AddBookUseCase } from '../add.book.usecase.js';

describe('AddBookUseCase', () => {
  let addBookUseCase: AddBookUseCase;
  let bookRepository: BookRepository;

  beforeEach(() => {
    bookRepository = {
      createBook: jest.fn(),
    } as unknown as BookRepository;

    addBookUseCase = new AddBookUseCase(bookRepository);
  });

  describe('execute', () => {
    it('should successfully create a book', async () => {
      const createBookDto: CreateBookDto = {
        code: 'Code Test',
        title: 'Test Book',
        author: 'Author Name',
        stock: 1,
      };
      const expectedBook: BookM = { id: '1', ...createBookDto }; // Adjust according to your BookM structure

      jest.spyOn(bookRepository, 'createBook').mockResolvedValue(expectedBook);

      const result = await addBookUseCase.execute(createBookDto);

      expect(result).toEqual(expectedBook);
      expect(bookRepository.createBook).toHaveBeenCalledWith(createBookDto);
    });

    it('should throw an HttpException if a HttpException is thrown from the repository', async () => {
      const createBookDto: CreateBookDto = {
        code: 'Code Test',
        title: 'Test Book',
        author: 'Author Name',
        stock: 1,
      };

      const error = new HttpException(
        'Error creating book',
        HttpStatus.BAD_REQUEST,
      );
      jest.spyOn(bookRepository, 'createBook').mockRejectedValue(error);

      await expect(addBookUseCase.execute(createBookDto)).rejects.toThrow(
        HttpException,
      );
      await expect(addBookUseCase.execute(createBookDto)).rejects.toThrow(
        'Error creating book',
      );
      await expect(
        addBookUseCase.execute(createBookDto),
      ).rejects.toHaveProperty('status', HttpStatus.BAD_REQUEST);
    });

    it('should throw an HttpException with INTERNAL_SERVER_ERROR status if an unknown error occurs', async () => {
      const createBookDto: CreateBookDto = {
        code: 'Code Test',
        title: 'Test Book',
        author: 'Author Name',
        stock: 1,
      };

      jest
        .spyOn(bookRepository, 'createBook')
        .mockRejectedValue(new Error('Unknown Error'));

      await expect(addBookUseCase.execute(createBookDto)).rejects.toThrow(
        HttpException,
      );
      await expect(addBookUseCase.execute(createBookDto)).rejects.toThrow(
        'Unknown Error',
      );
      await expect(
        addBookUseCase.execute(createBookDto),
      ).rejects.toHaveProperty('status', HttpStatus.INTERNAL_SERVER_ERROR);
    });
  });
});
