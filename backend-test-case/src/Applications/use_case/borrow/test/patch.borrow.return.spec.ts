import { HttpException, HttpStatus } from '@nestjs/common';
import * as dayjs from 'dayjs';
import { BookRepository } from 'src/Domains/book/book.repository.js';
import { BorrowRepository } from 'src/Domains/borrow/borrow.repository.js';
import { MemberRepository } from 'src/Domains/member/member.repository.js';
import { PatchBorrowReturnDto } from 'src/Interface/api/borrow/dto/update-borrow.dto.js';
import { PatchBorrowReturnUseCase } from '../patch.borrow.return.usecase.js';

describe('PatchBorrowReturnUseCase', () => {
  let patchBorrowReturnUseCase: PatchBorrowReturnUseCase;
  let borrowRepository: BorrowRepository;
  let memberRepository: MemberRepository;
  let bookRepository: BookRepository;

  beforeEach(() => {
    borrowRepository = {
      getBorrowById: jest.fn(),
      patchBorrowReturnBookById: jest.fn(),
    } as unknown as BorrowRepository;

    memberRepository = {
      updateMemberPenalizedById: jest.fn(),
      updateMemberBorrowedBooksById: jest.fn(),
    } as unknown as MemberRepository;

    bookRepository = {
      updateBookStoctById: jest.fn(),
    } as unknown as BookRepository;

    patchBorrowReturnUseCase = new PatchBorrowReturnUseCase(
      borrowRepository,
      memberRepository,
      bookRepository,
    );
  });

  it('should throw an error if the borrow record does not exist', async () => {
    const id = '1';
    const dto: PatchBorrowReturnDto = { returnDate: dayjs().toDate() };

    jest.spyOn(borrowRepository, 'getBorrowById').mockResolvedValue(null);

    await expect(patchBorrowReturnUseCase.execute(id, dto)).rejects.toThrow(
      HttpException,
    );
    await expect(patchBorrowReturnUseCase.execute(id, dto)).rejects.toThrow(
      'Borrow Not Found',
    );

    await expect(
      patchBorrowReturnUseCase.execute(id, dto),
    ).rejects.toHaveProperty('status', HttpStatus.NOT_FOUND);
    await expect(
      patchBorrowReturnUseCase.execute(id, dto),
    ).rejects.toHaveProperty('response', 'Borrow Not Found');
  });

  it('should throw an error if the book is already returned', async () => {
    const id = '1';
    const dto: PatchBorrowReturnDto = { returnDate: dayjs().toDate() };
    const borrow = {
      is_returned: true,
      member: { id: '1', borrowedBooks: 1 },
      book: { id: '1', stock: 0 },
    };

    jest.spyOn(borrowRepository, 'getBorrowById').mockResolvedValue(borrow);

    await expect(patchBorrowReturnUseCase.execute(id, dto)).rejects.toThrow(
      HttpException,
    );
    await expect(patchBorrowReturnUseCase.execute(id, dto)).rejects.toThrow(
      'Book Already Returned',
    );
    await expect(
      patchBorrowReturnUseCase.execute(id, dto),
    ).rejects.toHaveProperty('status', HttpStatus.FORBIDDEN);
    await expect(
      patchBorrowReturnUseCase.execute(id, dto),
    ).rejects.toHaveProperty('response', 'Book Already Returned');
  });

  it('should penalize the member if the book is returned late', async () => {
    const id = '1';
    const dto: PatchBorrowReturnDto = {
      returnDate: dayjs().add(5, 'day').toDate(),
    };
    const borrow = {
      is_returned: false,
      borrowedDate: dayjs(),
      member: { id: '1', borrowedBooks: 1 },
      book: { id: '1', stock: 0 },
    };

    jest.spyOn(borrowRepository, 'getBorrowById').mockResolvedValue(borrow);

    await patchBorrowReturnUseCase.execute(id, dto);

    expect(memberRepository.updateMemberPenalizedById).toHaveBeenCalledWith(
      borrow.member.id,
      expect.any(Date),
    );

    expect(memberRepository.updateMemberBorrowedBooksById).toHaveBeenCalledWith(
      borrow.member.id,
      borrow.member.borrowedBooks - 1,
    );
    expect(bookRepository.updateBookStoctById).toHaveBeenCalledWith(
      borrow.book.id,
      borrow.book.stock + 1,
    );
    expect(borrowRepository.patchBorrowReturnBookById).toHaveBeenCalledWith(
      id,
      true,
      dto,
    );
  });

  it('should successfully process the return if on time', async () => {
    const id = '1';
    const dto: PatchBorrowReturnDto = {
      returnDate: dayjs().add(5, 'day').toDate(),
    };
    const borrow = {
      is_returned: false,
      borrowedDate: dayjs(),
      member: { id: '1', borrowedBooks: 1 },
      book: { id: '1', stock: 0 },
    };

    jest.spyOn(borrowRepository, 'getBorrowById').mockResolvedValue(borrow);

    await patchBorrowReturnUseCase.execute(id, dto);

    expect(memberRepository.updateMemberBorrowedBooksById).toHaveBeenCalledWith(
      borrow.member.id,
      borrow.member.borrowedBooks - 1,
    );
    expect(bookRepository.updateBookStoctById).toHaveBeenCalledWith(
      borrow.book.id,
      borrow.book.stock + 1,
    );
    expect(borrowRepository.patchBorrowReturnBookById).toHaveBeenCalledWith(
      id,
      true,
      dto,
    );
  });

  it('should throw an HttpException with INTERNAL_SERVER_ERROR status if an unknown error occurs', async () => {
    const id = '1';
    const dto: PatchBorrowReturnDto = { returnDate: dayjs().toDate() };

    jest.spyOn(borrowRepository, 'getBorrowById').mockImplementation(() => {
      throw new Error('Unknown Error');
    });

    await expect(patchBorrowReturnUseCase.execute(id, dto)).rejects.toThrow(
      HttpException,
    );
    await expect(patchBorrowReturnUseCase.execute(id, dto)).rejects.toThrow(
      'Unknown Error',
    );

    await expect(
      patchBorrowReturnUseCase.execute(id, dto),
    ).rejects.toHaveProperty('status', HttpStatus.INTERNAL_SERVER_ERROR);
  });
});
