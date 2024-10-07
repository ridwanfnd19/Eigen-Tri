import { HttpException, HttpStatus } from '@nestjs/common';
import dayjs from 'dayjs';
import { BookRepository } from 'src/Domains/book/book.repository.js';
import { BorrowRepository } from 'src/Domains/borrow/borrow.repository.js';
import { MemberRepository } from 'src/Domains/member/member.repository.js';
import { CreateBorrowDto } from 'src/Interface/api/borrow/dto/create-borrow.dto.js';

export class AddBorrowUseCase {
  constructor(
    private borrowRepository: BorrowRepository,
    private memberRepository: MemberRepository,
    private bookRepository: BookRepository,
  ) {}

  async execute(createBorrowDto: CreateBorrowDto) {
    try {
      const member = await this.memberRepository.getMemberById(
        createBorrowDto.memberId,
      );

      if (!member) {
        throw new HttpException(`Member Not Found`, HttpStatus.NOT_FOUND);
      }

      const book = await this.bookRepository.getBookById(
        createBorrowDto.bookId,
      );

      if (!book) {
        throw new HttpException(`Book Not Found`, HttpStatus.NOT_FOUND);
      }

      if (member.borrowedBooks == 2) {
        throw new HttpException(
          'A member cannot borrow more than 2 books',
          HttpStatus.FORBIDDEN,
        );
      }

      if (book.stock == 0) {
        throw new HttpException(
          'The book is already borrowed by another member.',
          HttpStatus.FORBIDDEN,
        );
      }

      const penalized = dayjs().diff(member.endPenalized, 'day');

      if (member.endPenalized != null && penalized < 0) {
        throw new HttpException(
          `Member is currently being penalized`,
          HttpStatus.FORBIDDEN,
        );
      }

      await this.memberRepository.updateMemberBorrowedBooksById(
        member.id,
        member.borrowedBooks + 1,
      );

      await this.bookRepository.updateBookStoctById(book.id, book.stock - 1);

      return await this.borrowRepository.createBorrow(createBorrowDto);
    } catch (error) {
      if (error instanceof HttpException) {
        throw new HttpException(error.message, error.getStatus());
      }
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
