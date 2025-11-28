import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

interface WebhookSubscriber {
  client: string;
  callbackUrl: string;
}

@Injectable()
export class WebhooksService {
  private readonly logger = new Logger(WebhooksService.name);

  // Pour l’instant stockage en mémoire (suffisant pour le prototype)
  private subscribers: WebhookSubscriber[] = [];

  constructor(private readonly httpService: HttpService) {}

  subscribe(client: string, callbackUrl: string) {
    const exists = this.subscribers.some(
      (s) => s.client === client && s.callbackUrl === callbackUrl,
    );

    if (!exists) {
      this.subscribers.push({ client, callbackUrl });
      this.logger.log(
        `New webhook subscription: client=${client}, url=${callbackUrl}`,
      );
    } else {
      this.logger.debug(
        `Webhook subscription already exists for client=${client}, url=${callbackUrl}`,
      );
    }

    return { client, callbackUrl };
  }

  async notifySubscribers(payload: any): Promise<void> {
    if (!this.subscribers.length) {
      this.logger.debug('No webhook subscribers registered, nothing to notify');
      return;
    }

    this.logger.debug(
      `Sending webhook notification to ${this.subscribers.length} subscriber(s)`,
    );

    await Promise.allSettled(
      this.subscribers.map(async (subscriber) => {
        try {
          await firstValueFrom(
            this.httpService.post(subscriber.callbackUrl, payload, {
              timeout: 5000,
            }),
          );

          this.logger.log(
            `Webhook sent to ${subscriber.client} (${subscriber.callbackUrl})`,
          );
        } catch (error: any) {
          this.logger.error(
            `Error sending webhook to ${subscriber.client} (${subscriber.callbackUrl}): ${error.message}`,
          );
        }
      }),
    );
  }
}
