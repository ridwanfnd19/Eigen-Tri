import { HttpException, HttpStatus } from '@nestjs/common';
import { MemberRepository } from 'src/Domains/member/member.repository.js';
import { MemberM } from 'src/Domains/member/model/member.js';
import { CreateMemberDto } from 'src/Interface/api/member/dto/create-member.dto.js';

export class AddMemberUseCase {
  constructor(private memberRepository: MemberRepository) {}

  async execute(createMemberDto: CreateMemberDto): Promise<MemberM> {
    try {
      const member = await this.memberRepository.createMember(createMemberDto);
      member.isPenalized = false;
      return member;
    } catch (error) {
      if (error instanceof HttpException) {
        throw new HttpException(error.message, error.getStatus());
      }
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
