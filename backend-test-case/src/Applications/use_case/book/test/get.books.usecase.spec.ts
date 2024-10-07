import { BookRepository } from 'src/Domains/book/book.repository.js';
import { GetBooksUseCase } from '../get.books.usecase.js';
import { BookM } from 'src/Domains/book/model/book.js';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('GetBooksUseCase', () => {
  let getBooksUseCase: GetBooksUseCase;
  let bookRepository: BookRepository;

  beforeEach(() => {
    bookRepository = {
      getBooks: jest.fn(),
    } as unknown as BookRepository;

    getBooksUseCase = new GetBooksUseCase(bookRepository);
  });

  it('should return a list of books', async () => {
    const mockBooks: BookM[] = [
      {
        id: '1',
        code: 'Code Book 1',
        title: 'Book 1',
        author: 'Author 1',
        stock: 1,
      },
      {
        id: '2',
        code: 'Code Book 2',
        title: 'Book 2',
        author: 'Author 2',
        stock: 1,
      },
    ];

    jest.spyOn(bookRepository, 'getBooks').mockResolvedValue(mockBooks);

    const books = await getBooksUseCase.execute();

    expect(books).toEqual(mockBooks);
    expect(bookRepository.getBooks).toHaveBeenCalled();
  });

  it('should throw an HttpException if a HttpException is thrown from the repository', async () => {
    const error = new HttpException('Error get books', HttpStatus.BAD_REQUEST);
    jest.spyOn(bookRepository, 'getBooks').mockRejectedValue(error);

    await expect(getBooksUseCase.execute()).rejects.toThrow(HttpException);
    await expect(getBooksUseCase.execute()).rejects.toThrow('Error get books');

    await expect(getBooksUseCase.execute()).rejects.toHaveProperty(
      'status',
      HttpStatus.BAD_REQUEST,
    );
  });

  it('should throw an HttpException with INTERNAL_SERVER_ERROR status if an unknown error occurs', async () => {
    jest
      .spyOn(bookRepository, 'getBooks')
      .mockRejectedValue(new Error('Unknown Error'));

    await expect(getBooksUseCase.execute()).rejects.toThrow(HttpException);
    await expect(getBooksUseCase.execute()).rejects.toThrow('Unknown Error');

    await expect(getBooksUseCase.execute()).rejects.toHaveProperty(
      'status',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  });
});
