import { Publisher, TicketCreatedEvent, Subjects } from "@tickets-com/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
