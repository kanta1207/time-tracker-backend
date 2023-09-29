import { Request, Response } from 'express';
import { inject } from 'inversify';
import {
  controller,
  httpPost,
  httpPut,
  httpDelete,
  requestBody,
  requestParam,
} from 'inversify-express-utils';
import { TYPES } from '../../../core/type.core';
import { ITabService } from './../interface/ITab.service';
import { CreateTabDto } from '../dto/CreateTab.dto';
import { UpdateTabDto } from '../dto/UpdateTab.dto';
import { Tab } from '../entity/tab.entity';

@controller('/work-sessions/:workSessionId/tabs')
export class TabController {
  constructor(
    @inject(TYPES.ITabService)
    private readonly tabService: ITabService,
  ) {}

  @httpPost('/')
  public async createTab(
    @requestParam('workSessionId') workSessionId: number,
    @requestBody() reqBody: CreateTabDto,
    res: Response,
  ) {
    const newTab = await this.tabService.createTab(workSessionId, reqBody);
    return res.status(200).json(newTab);
  }

  @httpPut('/:tabId')
  public async updateTab(
    @requestParam('workSessionId') workSessionId: number,
    @requestParam('tabId') tabId: number,
    @requestBody() reqBody: Partial<Tab>,
    res: Response,
  ) {
    const updatedTab = await this.tabService.updateTab(
      workSessionId,
      tabId,
      reqBody,
    );
    return res.status(200).json(updatedTab);
  }

  @httpDelete('/:tabId')
  public async deleteTab(
    @requestParam('workSessionId') workSessionId: number,
    @requestParam('tabId') tabId: number,
    res: Response,
  ) {
    await this.tabService.deleteTab(workSessionId, tabId);
    return res.status(204).send();
  }
}