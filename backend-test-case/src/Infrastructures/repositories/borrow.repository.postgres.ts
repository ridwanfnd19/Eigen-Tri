import { Injectable } from '@nestjs/common';
import { BorrowRepository } from 'src/Domains/borrow/borrow.repository.js';
import { BorrowedBook } from '../entities/borowedbook.entity.js';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBorrowDto } from 'src/Interface/api/borrow/dto/create-borrow.dto.js';
import { PatchBorrowReturnDto } from 'src/Interface/api/borrow/dto/update-borrow.dto.js';

@Injectable()
export class BorrowRepositoryOrm implements BorrowRepository {
  constructor(
    @InjectRepository(BorrowedBook)
    private readonly borrowRepository: Repository<BorrowedBook>,
  ) {}

  async createBorrow(createBorrowDto: CreateBorrowDto) {
    return await this.borrowRepository.save({
      borrowedDate: createBorrowDto.borrowedDate,
      member: {
        id: createBorrowDto.memberId,
      },
      book: {
        id: createBorrowDto.bookId,
      },
    });
  }

  async getBorrowById(id: string) {
    return await this.borrowRepository.findOne({
      where: {
        id,
      },
      relations: {
        member: true,
        book: true,
      },
    });
  }

  async patchBorrowReturnBookById(
    id: string,
    is_returned: boolean,
    patchBorrowReturnDto: PatchBorrowReturnDto,
  ) {
    return await this.borrowRepository
      .createQueryBuilder()
      .update(BorrowedBook)
      .set({
        returnDate: patchBorrowReturnDto.returnDate,
        is_returned,
      })
      .where('id = :id', { id })
      .returning('*')
      .execute();
  }
}
