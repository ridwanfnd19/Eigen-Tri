import { MemberRepository } from 'src/Domains/member/member.repository.js';
import { Member } from '../entities/member.entity.js';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMemberDto } from 'src/Interface/api/member/dto/create-member.dto.js';

@Injectable()
export class MemberRepositoryOrm implements MemberRepository {
  constructor(
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,
  ) {}

  async createMember(createMemberDto: CreateMemberDto): Promise<any> {
    return await this.memberRepository.save(createMemberDto);
  }

  async getMembers(): Promise<any> {
    return await this.memberRepository.find();
  }

  async getMemberById(id: string): Promise<any> {
    return await this.memberRepository.findOneBy({
      id,
    });
  }

  async updateMemberBorrowedBooksById(
    id: string,
    borrowedBooks: number,
  ): Promise<any> {
    return await this.memberRepository.update(id, { borrowedBooks });
  }

  async updateMemberPenalizedById(
    id: string,
    endPenalized: Date,
  ): Promise<any> {
    return await this.memberRepository.update(id, {
      endPenalized,
    });
  }
}
