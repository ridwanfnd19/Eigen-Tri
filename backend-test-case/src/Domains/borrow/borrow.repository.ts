import { CreateBorrowDto } from 'src/Interface/api/borrow/dto/create-borrow.dto.js';
import { PatchBorrowReturnDto } from 'src/Interface/api/borrow/dto/update-borrow.dto.js';

export interface BorrowRepository {
  createBorrow(createBorrowDto: CreateBorrowDto);
  getBorrowById(id: string);
  patchBorrowReturnBookById(
    id: string,
    is_returned: boolean,
    patchBorrowReturnDto: PatchBorrowReturnDto,
  );
}
