import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ActionsService } from './actions.service';
import { CreateActionDto } from './dto/create-action.dto';
import { UpdateActionDto } from './dto/update-action.dto';

@Controller('actions')
export class ActionsController {
  constructor(private readonly actionsService: ActionsService) { }
}
