import { Subjects, Publisher, OrderCancelledEvent } from "@tickets-com/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
