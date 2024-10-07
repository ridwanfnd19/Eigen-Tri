import { MemberRepository } from 'src/Domains/member/member.repository.js';
import { AddMemberUseCase } from '../add.member.usecase.js';
import { CreateMemberDto } from 'src/Interface/api/member/dto/create-member.dto.js';
import { MemberM } from 'src/Domains/member/model/member.js';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('AdMemberUseCase', () => {
  let addMemberUseCase: AddMemberUseCase;
  let memberRepositori: MemberRepository;

  beforeEach(() => {
    memberRepositori = {
      createMember: jest.fn(),
    } as unknown as MemberRepository;

    addMemberUseCase = new AddMemberUseCase(memberRepositori);
  });

  describe('execute', () => {
    it('should successfully create a member', async () => {
      const createMemberDto: CreateMemberDto = {
        code: 'Code Test',
        name: 'Member Name Test',
      };
      const expectedMember: MemberM = {
        id: '1',
        ...createMemberDto,
        borrowedBooks: 2,
        isPenalized: false,
        endPenalized: new Date(),
      };
      jest
        .spyOn(memberRepositori, 'createMember')
        .mockResolvedValue(expectedMember);

      const result = await addMemberUseCase.execute(createMemberDto);

      expect(result).toEqual(expectedMember);
      expect(memberRepositori.createMember).toHaveBeenCalledWith(
        createMemberDto,
      );
    });

    it('should throw an HttpException if a HttpException is thrown from the repository', async () => {
      const error = new HttpException(
        'Error creating member',
        HttpStatus.BAD_REQUEST,
      );
      const createMemberDto: CreateMemberDto = {
        code: 'Code Test',
        name: 'Member Name Test',
      };

      jest.spyOn(memberRepositori, 'createMember').mockRejectedValue(error);

      await expect(addMemberUseCase.execute(createMemberDto)).rejects.toThrow(
        HttpException,
      );
      await expect(addMemberUseCase.execute(createMemberDto)).rejects.toThrow(
        'Error creating member',
      );
      await expect(
        addMemberUseCase.execute(createMemberDto),
      ).rejects.toHaveProperty('status', HttpStatus.BAD_REQUEST);
    });

    it('should throw an HttpException with INTERNAL_SERVER_ERROR status if an unknown error occurs', async () => {
      const createMemberDto: CreateMemberDto = {
        code: 'Code Test',
        name: 'Member Name Test',
      };

      jest
        .spyOn(memberRepositori, 'createMember')
        .mockRejectedValue(new Error('Unknown Error'));

      await expect(addMemberUseCase.execute(createMemberDto)).rejects.toThrow(
        HttpException,
      );
      await expect(addMemberUseCase.execute(createMemberDto)).rejects.toThrow(
        'Unknown Error',
      );
      await expect(
        addMemberUseCase.execute(createMemberDto),
      ).rejects.toHaveProperty('status', HttpStatus.INTERNAL_SERVER_ERROR);
    });
  });
});
