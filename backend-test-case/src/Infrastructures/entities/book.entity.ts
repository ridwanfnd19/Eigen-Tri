import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  Relation,
} from 'typeorm';
import { BorrowedBook } from './borowedbook.entity';

@Entity('book')
export class Book {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  code: string;

  @Column()
  title: string;

  @Column()
  author: string;

  @Column()
  stock: number;

  @OneToMany(() => BorrowedBook, (borowedBook) => borowedBook.book)
  borrowedBooksRelation: Relation<BorrowedBook>[];
}
