import { Body, Controller, Post } from '@nestjs/common';
import { WebhooksService } from './webhooks.service';

@Controller('webhooks')
export class WebhooksController {
  constructor(private readonly webhooksService: WebhooksService) {}

  @Post('subscribe')
  subscribe(
    @Body()
    body: {
      client: string;
      callbackUrl: string;
    },
  ) {
    // Pas de validation compliquée pour le prototype
    return this.webhooksService.subscribe(body.client, body.callbackUrl);
  }
}
