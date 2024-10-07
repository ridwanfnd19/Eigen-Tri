import { CreateMemberDto } from 'src/Interface/api/member/dto/create-member.dto.js';

export interface MemberRepository {
  createMember(createMemberDto: CreateMemberDto): Promise<any>;
  getMembers(): Promise<any>;
  getMemberById(id: string): Promise<any>;
  updateMemberBorrowedBooksById(
    id: string,
    borrowedBooks: number,
  ): Promise<any>;
  updateMemberPenalizedById(id: string, endPenalized: Date): Promise<any>;
}
