import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  Relation,
} from 'typeorm';
import { BorrowedBook } from './borowedbook.entity';

@Entity('member')
export class Member {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  code: string;

  @Column()
  name: string;

  @Column({ default: 0 })
  borrowedBooks: number;

  @Column({ nullable: true })
  endPenalized: Date;

  @OneToMany(() => BorrowedBook, (borowedBook) => borowedBook.member)
  borrowedBooksRelation: Relation<BorrowedBook>[];
}
