import { Module } from '@nestjs/common';
import { ContainerModule } from 'src/Infrastructures/container/container.module.js';
import { MemberController } from './member.controller.js';

@Module({
  imports: [ContainerModule.register()],
  controllers: [MemberController],
})
export class MemberModule {}
