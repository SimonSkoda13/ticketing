import { Publisher, Subjects, TicketUpdatedEvent } from "@tickets-com/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
