import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from 'src/Infrastructures/entities/book.entity.js';
import { BookRepositoryOrm } from '../book.repository.postgres.js';
import { Member } from 'src/Infrastructures/entities/member.entity.js';
import { BorrowedBook } from 'src/Infrastructures/entities/borowedbook.entity.js';
import { MemberRepositoryOrm } from '../member.repository.postgres.js';
import { BorrowRepositoryOrm } from '../borrow.repository.postgres.js';

@Module({
  imports: [TypeOrmModule.forFeature([Book, Member, BorrowedBook])],
  providers: [BookRepositoryOrm, MemberRepositoryOrm, BorrowRepositoryOrm],
  exports: [BookRepositoryOrm, MemberRepositoryOrm, BorrowRepositoryOrm],
})
export class RepositoriesModule {}
