import { HttpException, HttpStatus } from '@nestjs/common';
import dayjs from 'dayjs';
import { MemberRepository } from 'src/Domains/member/member.repository.js';
import { MemberM } from 'src/Domains/member/model/member.js';

export class GetMembersUseCase {
  constructor(private memberRepository: MemberRepository) {}

  async execute(): Promise<MemberM[]> {
    try {
      const members = await this.memberRepository.getMembers();
      members.forEach((member) => {
        const penalized = dayjs().diff(member.endPenalized, 'day');
        member.isPenalized = false;

        if (member.endPenalized != null && penalized < 0) {
          member.isPenalized = true;
        }
      });
      return members;
    } catch (error) {
      if (error instanceof HttpException) {
        throw new HttpException(error.message, error.getStatus());
      }
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
