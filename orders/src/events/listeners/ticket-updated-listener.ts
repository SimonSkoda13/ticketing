import {
  Listener,
  QueueGroupName,
  Subjects,
  TicketUpdatedEvent,
} from "@tickets-com/common";
import { Ticket } from "../../models/ticket";
import { Message } from "node-nats-streaming";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
  queueGroupName = QueueGroupName.OrdersService;

  async onMessage(data: TicketUpdatedEvent["data"], msg: Message) {
    const ticket = await Ticket.findByEvent(data);

    if (!ticket) {
      throw new Error("Ticket not found");
    }

    const { title, price } = data;
    ticket.set({ title, price });
    await ticket.save();

    msg.ack();
  }
}
