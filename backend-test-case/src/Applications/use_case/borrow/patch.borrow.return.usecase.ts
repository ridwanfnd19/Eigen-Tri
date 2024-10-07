import { HttpException, HttpStatus } from '@nestjs/common';
import dayjs from 'dayjs';
import { BookRepository } from 'src/Domains/book/book.repository.js';
import { BorrowRepository } from 'src/Domains/borrow/borrow.repository.js';
import { MemberRepository } from 'src/Domains/member/member.repository.js';
import { PatchBorrowReturnDto } from 'src/Interface/api/borrow/dto/update-borrow.dto.js';

export class PatchBorrowReturnUseCase {
  constructor(
    private borrowRepository: BorrowRepository,
    private memberRepository: MemberRepository,
    private bookRepository: BookRepository,
  ) {}

  async execute(id: string, patchBorrowReturnDto: PatchBorrowReturnDto) {
    try {
      const borrow = await this.borrowRepository.getBorrowById(id);
      if (!borrow) {
        throw new HttpException(`Borrow Not Found`, HttpStatus.NOT_FOUND);
      }

      if (borrow.is_returned) {
        throw new HttpException('Book Already Returned', HttpStatus.FORBIDDEN);
      }

      const returnDate = dayjs(patchBorrowReturnDto.returnDate).diff(
        borrow.borrowedDate,
        'day',
      );

      if (returnDate > 0) {
        const endPenalized = dayjs(patchBorrowReturnDto.returnDate)
          .add(3, 'day')
          .toDate();

        await this.memberRepository.updateMemberPenalizedById(
          borrow.member.id,
          endPenalized,
        );
      }

      await this.memberRepository.updateMemberBorrowedBooksById(
        borrow.member.id,
        borrow.member.borrowedBooks - 1,
      );

      await this.bookRepository.updateBookStoctById(
        borrow.book.id,
        borrow.book.stock + 1,
      );

      return await this.borrowRepository.patchBorrowReturnBookById(
        id,
        true,
        patchBorrowReturnDto,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw new HttpException(error.message, error.getStatus());
      }
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
