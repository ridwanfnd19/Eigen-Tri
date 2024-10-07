import {
  Body,
  Controller,
  HttpStatus,
  Inject,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateBorrowDto } from './dto/create-borrow.dto.js';
import { ContainerModule } from 'src/Infrastructures/container/container.module.js';
import { UseCaseContainer } from 'src/Infrastructures/container/usecase.container.js';
import { AddBorrowUseCase } from 'src/Applications/use_case/borrow/add.borrow.usecase.js';
import { ApiResponse, ApiBody } from '@nestjs/swagger';
import { PatchBorrowReturnDto } from './dto/update-borrow.dto.js';
import { PatchBorrowReturnUseCase } from 'src/Applications/use_case/borrow/patch.borrow.return.usecase.js';

@Controller('borrowbook')
export class BorrowController {
  constructor(
    @Inject(ContainerModule.ADD_BORROW_USE_CASE)
    private readonly addBorrowUsecase: UseCaseContainer<AddBorrowUseCase>,
    @Inject(ContainerModule.PATCH_BORROW_RETURN_USE_CASE)
    private readonly patchBorrowReturnUsecase: UseCaseContainer<PatchBorrowReturnUseCase>,
  ) {}

  @Post()
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The record has been successfully created.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Member or Book NOT FOUND.',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'FORBIDDEN.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'BAD REQUEST.',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'INTERNAL SERVER ERROR.',
  })
  @ApiBody({
    type: CreateBorrowDto,
    description: 'Json structure for create borrow object',
  })
  async create(@Body() createBorrowDto: CreateBorrowDto) {
    const data = await this.addBorrowUsecase
      .getInstance()
      .execute(createBorrowDto);
    return { statusCode: HttpStatus.CREATED, data };
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The record has been successfully updeted.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Borrowed Book NOT FOUND.',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'FORBIDDEN.',
  })
  @ApiBody({
    type: PatchBorrowReturnDto,
    description: 'Json structure for create borrow object',
  })
  @Patch(':id')
  async patchBorrowReturnDate(
    @Param(
      'id',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.BAD_REQUEST }),
    )
    id: string,
    @Body() patchBorrowReturnDto: PatchBorrowReturnDto,
  ) {
    const data = await this.patchBorrowReturnUsecase
      .getInstance()
      .execute(id, patchBorrowReturnDto);
    return { statusCode: HttpStatus.OK, data: data.raw[0] };
  }
}
