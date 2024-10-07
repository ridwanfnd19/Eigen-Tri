import { MemberRepository } from 'src/Domains/member/member.repository.js';
import { GetMembersUseCase } from '../get.members.usecase.js';
import { MemberM } from 'src/Domains/member/model/member.js';
import { HttpException, HttpStatus } from '@nestjs/common';
import * as dayjs from 'dayjs';

describe('GetMembersUseCase', () => {
  let getMembersUseCase: GetMembersUseCase;
  let memberRepository: MemberRepository;

  beforeEach(() => {
    memberRepository = {
      getMembers: jest.fn(),
    } as unknown as MemberRepository;

    getMembersUseCase = new GetMembersUseCase(memberRepository);
  });

  it('should return a list of members', async () => {
    const date1 = dayjs().add(5, 'day');
    const date2 = dayjs().subtract(5, 'day');
    const mockMembers = [
      {
        id: '1',
        code: 'Code Test 1',
        name: 'Member Name Test 1',
        borrowedBooks: 2,
        endPenalized: dayjs(date1).toISOString(),
      },
      {
        id: '2',
        code: 'Code Test 2',
        name: 'Member Name Test 2',
        borrowedBooks: 2,
        endPenalized: dayjs(date2).toISOString(),
      },
      {
        id: '3',
        code: 'Code Test 3',
        name: 'Member Name Test 3',
        borrowedBooks: 0,
        endPenalized: null,
      },
    ];
    const trueMembers: MemberM[] = [
      {
        id: '1',
        code: 'Code Test 1',
        name: 'Member Name Test 1',
        borrowedBooks: 2,
        isPenalized: true,
        endPenalized: dayjs(date1).toDate(),
      },
      {
        id: '2',
        code: 'Code Test 2',
        name: 'Member Name Test 2',
        borrowedBooks: 2,
        isPenalized: false,
        endPenalized: dayjs(date2).toDate(),
      },
      {
        id: '3',
        code: 'Code Test 3',
        name: 'Member Name Test 3',
        borrowedBooks: 0,
        isPenalized: false,
        endPenalized: null,
      },
    ];

    jest.spyOn(memberRepository, 'getMembers').mockResolvedValue(mockMembers);

    const members = await getMembersUseCase.execute();
    members.forEach((member) => {
      if (member.endPenalized != null) {
        member.endPenalized = dayjs(member.endPenalized).toDate();
      }
    });

    expect(members).toEqual(trueMembers);
    expect(memberRepository.getMembers).toHaveBeenCalled();
  });

  it('should throw an HttpException if a HttpException is thrown from the repository', async () => {
    const error = new HttpException(
      'Error get memebrs',
      HttpStatus.BAD_REQUEST,
    );
    jest.spyOn(memberRepository, 'getMembers').mockRejectedValue(error);

    await expect(getMembersUseCase.execute()).rejects.toThrow(HttpException);
    await expect(getMembersUseCase.execute()).rejects.toThrow(
      'Error get memebrs',
    );

    await expect(getMembersUseCase.execute()).rejects.toHaveProperty(
      'status',
      HttpStatus.BAD_REQUEST,
    );
  });

  it('should throw an HttpException with INTERNAL_SERVER_ERROR status if an unknown error occurs', async () => {
    jest
      .spyOn(memberRepository, 'getMembers')
      .mockRejectedValue(new Error('Unknown Error'));

    await expect(getMembersUseCase.execute()).rejects.toThrow(HttpException);
    await expect(getMembersUseCase.execute()).rejects.toThrow('Unknown Error');

    await expect(getMembersUseCase.execute()).rejects.toHaveProperty(
      'status',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  });
});
