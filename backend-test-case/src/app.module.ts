import { Module } from '@nestjs/common';
import { DatabaseModule } from './Infrastructures/database/pool.js';
import { ContainerModule } from './Infrastructures/container/container.module.js';
import { BookModule } from './Interface/api/book/book.module.js';
import { MemberModule } from './Interface/api/member/member.module.js';
import { BorrowModule } from './Interface/api/borrow/borrow.module.js';

@Module({
  imports: [
    DatabaseModule,
    ContainerModule.register(),
    BookModule,
    MemberModule,
    BorrowModule,
  ],
})
export class AppModule {}
