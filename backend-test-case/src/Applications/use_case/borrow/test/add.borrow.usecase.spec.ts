import { HttpException, HttpStatus } from '@nestjs/common';
import * as dayjs from 'dayjs';
import { BookRepository } from 'src/Domains/book/book.repository.js';
import { BorrowRepository } from 'src/Domains/borrow/borrow.repository.js';
import { MemberRepository } from 'src/Domains/member/member.repository.js';
import { CreateBorrowDto } from 'src/Interface/api/borrow/dto/create-borrow.dto.js';
import { AddBorrowUseCase } from '../add.borrow.usecase.js';
import { BookM } from 'src/Domains/book/model/book.js';

describe('AddBorrowUseCase', () => {
  let addBorrowUseCase: AddBorrowUseCase;
  let borrowRepository: BorrowRepository;
  let memberRepository: MemberRepository;
  let bookRepository: BookRepository;

  beforeEach(() => {
    borrowRepository = {
      createBorrow: jest.fn(),
    } as unknown as BorrowRepository;

    memberRepository = {
      getMemberById: jest.fn(),
      updateMemberBorrowedBooksById: jest.fn(),
    } as unknown as MemberRepository;

    bookRepository = {
      getBookById: jest.fn(),
      updateBookStoctById: jest.fn(),
    } as unknown as BookRepository;

    addBorrowUseCase = new AddBorrowUseCase(
      borrowRepository,
      memberRepository,
      bookRepository,
    );
  });

  it('should throw an error if the member does not exist', async () => {
    const dto: CreateBorrowDto = {
      memberId: '1',
      bookId: '1',
      borrowedDate: dayjs().toDate(),
    };
    jest.spyOn(memberRepository, 'getMemberById').mockResolvedValue(null);

    await expect(addBorrowUseCase.execute(dto)).rejects.toThrow(HttpException);
    await expect(addBorrowUseCase.execute(dto)).rejects.toThrow(
      'Member Not Found',
    );
    await expect(addBorrowUseCase.execute(dto)).rejects.toHaveProperty(
      'status',
      HttpStatus.NOT_FOUND,
    );
    await expect(addBorrowUseCase.execute(dto)).rejects.toHaveProperty(
      'response',
      'Member Not Found',
    );
  });

  it('should throw an error if the book does not exist', async () => {
    const dto: CreateBorrowDto = {
      memberId: '1',
      bookId: '1',
      borrowedDate: dayjs().toDate(),
    };
    jest
      .spyOn(memberRepository, 'getMemberById')
      .mockResolvedValue({ id: '1' });
    jest.spyOn(bookRepository, 'getBookById').mockResolvedValue(null);

    await expect(addBorrowUseCase.execute(dto)).rejects.toThrow(HttpException);
    await expect(addBorrowUseCase.execute(dto)).rejects.toThrow(
      'Book Not Found',
    );
    await expect(addBorrowUseCase.execute(dto)).rejects.toHaveProperty(
      'status',
      HttpStatus.NOT_FOUND,
    );
    await expect(addBorrowUseCase.execute(dto)).rejects.toHaveProperty(
      'response',
      'Book Not Found',
    );
  });

  it('should throw an error if the member has borrowed 2 books', async () => {
    const date = dayjs().add(5, 'day');
    const dto: CreateBorrowDto = {
      memberId: '1',
      bookId: '1',
      borrowedDate: dayjs().toDate(),
    };
    const member = {
      id: '1',
      code: 'Code Test 1',
      name: 'Member Name Test 1',
      borrowedBooks: 2,
      endPenalized: dayjs(date).toISOString(),
    };
    const book: BookM = {
      id: '1',
      code: 'Code Book 1',
      title: 'Book 1',
      author: 'Author 1',
      stock: 1,
    };

    jest.spyOn(memberRepository, 'getMemberById').mockResolvedValue(member);
    jest.spyOn(bookRepository, 'getBookById').mockResolvedValue(book);

    await expect(addBorrowUseCase.execute(dto)).rejects.toThrow(HttpException);
    await expect(addBorrowUseCase.execute(dto)).rejects.toThrow(
      'A member cannot borrow more than 2 books',
    );
    await expect(addBorrowUseCase.execute(dto)).rejects.toHaveProperty(
      'status',
      HttpStatus.FORBIDDEN,
    );
    await expect(addBorrowUseCase.execute(dto)).rejects.toHaveProperty(
      'response',
      'A member cannot borrow more than 2 books',
    );
  });

  it('should throw an error if the book stock is 0', async () => {
    const date = dayjs().add(5, 'day');
    const dto: CreateBorrowDto = {
      memberId: '1',
      bookId: '1',
      borrowedDate: dayjs().toDate(),
    };
    const member = {
      id: '1',
      code: 'Code Test 1',
      name: 'Member Name Test 1',
      borrowedBooks: 1,
      endPenalized: dayjs(date).toISOString(),
    };
    const book: BookM = {
      id: '1',
      code: 'Code Book 1',
      title: 'Book 1',
      author: 'Author 1',
      stock: 0,
    };

    jest.spyOn(memberRepository, 'getMemberById').mockResolvedValue(member);
    jest.spyOn(bookRepository, 'getBookById').mockResolvedValue(book);

    await expect(addBorrowUseCase.execute(dto)).rejects.toThrow(HttpException);
    await expect(addBorrowUseCase.execute(dto)).rejects.toThrow(
      'The book is already borrowed by another member.',
    );
    await expect(addBorrowUseCase.execute(dto)).rejects.toHaveProperty(
      'status',
      HttpStatus.FORBIDDEN,
    );
    await expect(addBorrowUseCase.execute(dto)).rejects.toHaveProperty(
      'response',
      'The book is already borrowed by another member.',
    );
  });

  it('should throw an error if the member is penalized', async () => {
    const date = dayjs().add(5, 'day');
    const dto: CreateBorrowDto = {
      memberId: '1',
      bookId: '1',
      borrowedDate: dayjs().toDate(),
    };
    const member = {
      id: '1',
      code: 'Code Test 1',
      name: 'Member Name Test 1',
      borrowedBooks: 0,
      endPenalized: dayjs(date).toISOString(),
    };
    const book: BookM = {
      id: '1',
      code: 'Code Book 1',
      title: 'Book 1',
      author: 'Author 1',
      stock: 1,
    };

    jest.spyOn(memberRepository, 'getMemberById').mockResolvedValue(member);
    jest.spyOn(bookRepository, 'getBookById').mockResolvedValue(book);

    await expect(addBorrowUseCase.execute(dto)).rejects.toThrow(HttpException);
    await expect(addBorrowUseCase.execute(dto)).rejects.toThrow(
      'Member is currently being penalized',
    );

    await expect(addBorrowUseCase.execute(dto)).rejects.toHaveProperty(
      'status',
      HttpStatus.FORBIDDEN,
    );
    await expect(addBorrowUseCase.execute(dto)).rejects.toHaveProperty(
      'response',
      'Member is currently being penalized',
    );
  });

  it('should successfully borrow a book', async () => {
    const date = dayjs().subtract(5, 'day');
    const dto: CreateBorrowDto = {
      memberId: '1',
      bookId: '1',
      borrowedDate: dayjs().toDate(),
    };
    const member = {
      id: '1',
      code: 'Code Test 1',
      name: 'Member Name Test 1',
      borrowedBooks: 0,
      endPenalized: dayjs(date).toISOString(),
    };
    const book: BookM = {
      id: '1',
      code: 'Code Book 1',
      title: 'Book 1',
      author: 'Author 1',
      stock: 1,
    };

    jest.spyOn(memberRepository, 'getMemberById').mockResolvedValue(member);
    jest.spyOn(bookRepository, 'getBookById').mockResolvedValue(book);

    await addBorrowUseCase.execute(dto);

    expect(memberRepository.updateMemberBorrowedBooksById).toHaveBeenCalledWith(
      member.id,
      member.borrowedBooks + 1,
    );
    expect(bookRepository.updateBookStoctById).toHaveBeenCalledWith(
      book.id,
      book.stock - 1,
    );
    expect(borrowRepository.createBorrow).toHaveBeenCalledWith(dto);
  });

  it('should throw an HttpException with INTERNAL_SERVER_ERROR status if an unknown error occurs', async () => {
    const dto: CreateBorrowDto = {
      memberId: '1',
      bookId: '1',
      borrowedDate: dayjs().toDate(),
    };

    jest.spyOn(memberRepository, 'getMemberById').mockImplementation(() => {
      throw new Error('Unknown Error');
    });

    await expect(addBorrowUseCase.execute(dto)).rejects.toThrow(HttpException);
    await expect(addBorrowUseCase.execute(dto)).rejects.toThrow(
      'Unknown Error',
    );

    await expect(addBorrowUseCase.execute(dto)).rejects.toHaveProperty(
      'status',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  });
});
