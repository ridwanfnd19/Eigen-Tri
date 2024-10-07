import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Inject,
  Post,
} from '@nestjs/common';
import { GetMembersUseCase } from 'src/Applications/use_case/member/get.members.usecase.js';
import { ContainerModule } from 'src/Infrastructures/container/container.module.js';
import { UseCaseContainer } from 'src/Infrastructures/container/usecase.container.js';
import { CreateMemberDto } from './dto/create-member.dto.js';
import { AddMemberUseCase } from 'src/Applications/use_case/member/add.member.usecase.js';
import { ApiBody, ApiResponse } from '@nestjs/swagger';

@Controller('member')
export class MemberController {
  constructor(
    @Inject(ContainerModule.GET_MEMBERS_USE_CASE)
    private readonly getMembersUseCase: UseCaseContainer<GetMembersUseCase>,
    @Inject(ContainerModule.ADD_MEMBER_USE_CASE)
    private readonly addMembersUseCase: UseCaseContainer<AddMemberUseCase>,
  ) {}

  @Post()
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The record has been successfully created.',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'BAD REQUEST.',
  })
  @ApiBody({
    type: CreateMemberDto,
    description: 'Json structure for create member object',
  })
  async create(@Body() creatememberDto: CreateMemberDto) {
    const data = await this.addMembersUseCase
      .getInstance()
      .execute(creatememberDto);
    return { statusCode: HttpStatus.CREATED, data };
  }

  @Get()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get Data Succses',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'INTERNAL SERVER ERROR.',
  })
  async getBooks() {
    const data = await this.getMembersUseCase.getInstance().execute();
    return { statusCode: HttpStatus.OK, data };
  }
}
