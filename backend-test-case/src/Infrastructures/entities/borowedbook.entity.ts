import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Relation,
} from 'typeorm';
import { Member } from './member.entity';
import { Book } from './book.entity';

@Entity('borrowedbook')
export class BorrowedBook {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  borrowedDate: Date;

  @Column({ nullable: true })
  returnDate: Date;

  @Column({ default: false })
  is_returned: boolean;

  @ManyToOne(() => Member, (member) => member.borrowedBooksRelation)
  member: Relation<Member>;

  @ManyToOne(() => Book, (book) => book.borrowedBooksRelation)
  book: Relation<Book>;
}
