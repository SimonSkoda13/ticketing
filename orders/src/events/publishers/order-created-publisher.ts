import { Publisher, OrderCreatedEvent, Subjects } from "@tickets-com/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
