import {
  Controller,
  Post,
  Body,
  Inject,
  Get,
  HttpStatus,
} from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto.js';
import { ContainerModule } from 'src/Infrastructures/container/container.module.js';
import { UseCaseContainer } from 'src/Infrastructures/container/usecase.container.js';
import { AddBookUseCase } from 'src/Applications/use_case/book/add.book.usecase.js';
import { GetBooksUseCase } from 'src/Applications/use_case/book/get.books.usecase.js';
import { ApiBody, ApiResponse } from '@nestjs/swagger';

@Controller('book')
export class BookController {
  constructor(
    @Inject(ContainerModule.CREATE_BOOK_USE_CASE)
    private readonly addBookUseCase: UseCaseContainer<AddBookUseCase>,
    @Inject(ContainerModule.GET_BOOKS_USE_CASE)
    private readonly getBooksUseCase: UseCaseContainer<GetBooksUseCase>,
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
    type: CreateBookDto,
    description: 'Json structure for create book object',
  })
  async create(@Body() createBookDto: CreateBookDto) {
    const data = await this.addBookUseCase.getInstance().execute(createBookDto);
    return { statusCode: HttpStatus.CREATED, data };
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get Data Succses',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'INTERNAL SERVER ERROR.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'BAD REQUEST.',
  })
  @Get()
  async getBooks() {
    const data = await this.getBooksUseCase.getInstance().execute();
    return { statusCode: HttpStatus.OK, data };
  }
}
