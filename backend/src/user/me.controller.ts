import { Body, Controller, Delete, Get, Post, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UserUpdateDto } from './dto/user.dto';
import { pipe } from 'fp-ts/function';
import * as fpts from 'fp-ts';
import { Task } from 'fp-ts/Task';
import { UserEntity } from './entities/user.entity';

@ApiTags('me')
@Controller('me')
export class MeController {
  constructor(private readonly UserService: UserService) {}

  @ApiBody({ type: UserUpdateDto })
  @ApiOkResponse({ type: String, description: 'success', status: 200 })
  @Post('update')
  async update(
    @Res() res,
    @Body() userUpdateDto: UserUpdateDto,
  ): Promise<Task<Error | string>> {
    const either = this.UserService.updateUser(userUpdateDto, userUpdateDto.id);

    return pipe(
      either,
      fpts.taskEither.match(
        (error) => {
          return error;
        },
        (user) => {
          if (user === null) {
            return new Error('User not found');
          } else {
            return res.status(200).send({ message: 'success' });
          }
        },
      ),
    );
  }

  @ApiOkResponse({ type: String, description: 'success', status: 200 })
  @ApiBody({
    type: 'String',
    description: "the user's id",
  })
  @Delete('delete')
  async delete(@Res() res, @Body() id: string): Promise<Task<Error | string>> {
    const either = this.UserService.deleteUser({ id });

    return pipe(
      either,
      fpts.taskEither.match(
        (error) => {
          return error;
        },
        (user) => {
          if (user === null) {
            return new Error('User not found');
          } else {
            return res.status(200).send({ message: 'success' });
          }
        },
      ),
    );
  }

  @ApiBody({
    type: 'String',
    description: "the user's email",
  })
  @ApiOkResponse({ type: UserEntity, status: 200 })
  @Get('get')
  async get(
    @Res() res,
    @Body() email: string,
  ): Promise<Task<Error | UserEntity>> {
    const either = this.UserService.getUser({ email });

    return pipe(
      either,
      fpts.taskEither.match(
        (error) => {
          return error;
        },
        (user) => {
          if (user === null) {
            return new Error('User not found');
          } else {
            return res.status(200).send(user);
          }
        },
      ),
    );
  }
}
