import { DynamicModule, Module } from '@nestjs/common';
import { BookRepositoryOrm } from '../repositories/book.repository.postgres.js';
import { AddBookUseCase } from 'src/Applications/use_case/book/add.book.usecase.js';
import { UseCaseContainer } from './usecase.container.js';
import { RepositoriesModule } from '../repositories/module/repository.module.js';
import { GetBooksUseCase } from 'src/Applications/use_case/book/get.books.usecase.js';
import { MemberRepositoryOrm } from '../repositories/member.repository.postgres.js';
import { GetMembersUseCase } from 'src/Applications/use_case/member/get.members.usecase.js';
import { AddMemberUseCase } from 'src/Applications/use_case/member/add.member.usecase.js';
import { BorrowRepositoryOrm } from '../repositories/borrow.repository.postgres.js';
import { AddBorrowUseCase } from 'src/Applications/use_case/borrow/add.borrow.usecase.js';
import { PatchBorrowReturnUseCase } from 'src/Applications/use_case/borrow/patch.borrow.return.usecase.js';

@Module({
  imports: [RepositoriesModule],
})
export class ContainerModule {
  static CREATE_BOOK_USE_CASE = 'createBookUsecase';
  static GET_BOOKS_USE_CASE = 'getBooksUsecase';
  static GET_MEMBERS_USE_CASE = 'getMembersUsecase';
  static ADD_MEMBER_USE_CASE = 'addMemberUsecase';
  static ADD_BORROW_USE_CASE = 'addBorrowUsecase';
  static PATCH_BORROW_RETURN_USE_CASE = 'patchBorrowReturnUsecase';

  static register(): DynamicModule {
    return {
      module: ContainerModule,
      providers: [
        {
          inject: [BookRepositoryOrm],
          provide: ContainerModule.CREATE_BOOK_USE_CASE,
          useFactory: (bookRepository: BookRepositoryOrm) =>
            new UseCaseContainer(new AddBookUseCase(bookRepository)),
        },
        {
          inject: [BookRepositoryOrm],
          provide: ContainerModule.GET_BOOKS_USE_CASE,
          useFactory: (bookRepository: BookRepositoryOrm) =>
            new UseCaseContainer(new GetBooksUseCase(bookRepository)),
        },
        {
          inject: [MemberRepositoryOrm],
          provide: ContainerModule.GET_MEMBERS_USE_CASE,
          useFactory: (memberRepository: MemberRepositoryOrm) =>
            new UseCaseContainer(new GetMembersUseCase(memberRepository)),
        },
        {
          inject: [MemberRepositoryOrm],
          provide: ContainerModule.ADD_MEMBER_USE_CASE,
          useFactory: (memberRepository: MemberRepositoryOrm) =>
            new UseCaseContainer(new AddMemberUseCase(memberRepository)),
        },
        {
          inject: [BorrowRepositoryOrm, MemberRepositoryOrm, BookRepositoryOrm],
          provide: ContainerModule.ADD_BORROW_USE_CASE,
          useFactory: (
            borrowRepository: BorrowRepositoryOrm,
            memberRepository: MemberRepositoryOrm,
            bookRepository: BookRepositoryOrm,
          ) =>
            new UseCaseContainer(
              new AddBorrowUseCase(
                borrowRepository,
                memberRepository,
                bookRepository,
              ),
            ),
        },
        {
          inject: [BorrowRepositoryOrm, MemberRepositoryOrm, BookRepositoryOrm],
          provide: ContainerModule.PATCH_BORROW_RETURN_USE_CASE,
          useFactory: (
            borrowRepository: BorrowRepositoryOrm,
            memberRepository: MemberRepositoryOrm,
            bookRepository: BookRepositoryOrm,
          ) =>
            new UseCaseContainer(
              new PatchBorrowReturnUseCase(
                borrowRepository,
                memberRepository,
                bookRepository,
              ),
            ),
        },
      ],
      exports: [
        ContainerModule.CREATE_BOOK_USE_CASE,
        ContainerModule.GET_BOOKS_USE_CASE,
        ContainerModule.GET_MEMBERS_USE_CASE,
        ContainerModule.ADD_MEMBER_USE_CASE,
        ContainerModule.ADD_BORROW_USE_CASE,
        ContainerModule.PATCH_BORROW_RETURN_USE_CASE,
      ],
    };
  }
}
