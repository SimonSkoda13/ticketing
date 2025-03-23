import {
  OrderCancelledEvent,
  OrderCreatedEvent,
  OrderStatus,
} from "@tickets-com/common";
import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "../../../nats-wrapper";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { OrderCancelledListener } from "../order-cancelled-listener";

const setup = async () => {
  // Create an instance of the listener
  const listener = new OrderCancelledListener(natsWrapper.client);
  // Create and save a ticket

  const orderId = new mongoose.Types.ObjectId().toHexString();
  const ticket = Ticket.build({
    title: "concert",
    price: 99,
    userId: "asdf",
  });
  ticket.set({ orderId });
  await ticket.save();
  // Create a fake data event
  const data: OrderCancelledEvent["data"] = {
    id: orderId,
    version: 0,
    ticket: {
      id: ticket.id,
    },
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };
  return { listener, ticket, data, msg };
};

it("updates the ticket, publishes an event, and acks the message", async () => {
  const { listener, ticket, data, msg } = await setup();
  // Call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);
  // Write assertions to make sure a ticket was created
  const updatedTicket = await Ticket.findById(ticket.id).populate("orderId");
  expect(updatedTicket).toBeDefined();
  expect(updatedTicket!.orderId).not.toBeDefined();
  expect(updatedTicket!.price).toEqual(ticket.price);
  expect(updatedTicket!.title).toEqual(ticket.title);
  expect(updatedTicket!.userId).toEqual(ticket.userId);
  // Write assertions to make sure ack function is called
  expect(msg.ack).toHaveBeenCalled();
  // Write assertions to make sure an event was published
  expect(natsWrapper.client.publish).toHaveBeenCalled();
  const ticketUpdatedData = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
  );
  expect(ticketUpdatedData.id).toEqual(ticket.id);
  expect(ticketUpdatedData.title).toEqual(ticket.title);
  expect(ticketUpdatedData.price).toEqual(ticket.price);
  expect(ticketUpdatedData.userId).toEqual(ticket.userId);
  expect(ticketUpdatedData.orderId).not.toBeDefined();
  expect(ticketUpdatedData.version).toEqual(1);
  expect(ticketUpdatedData).toEqual({
    id: ticket.id,
    title: ticket.title,
    price: ticket.price,
    userId: ticket.userId,
    orderId: undefined,
    version: 1,
  });
});
it("does not update the ticket if the orderId is not set", async () => {
  const { listener, ticket, data, msg } = await setup();
  // Call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);
  // Write assertions to make sure a ticket was created
  const updatedTicket = await Ticket.findById(ticket.id);
  expect(updatedTicket).toBeDefined();
  expect(updatedTicket!.orderId).not.toBeDefined();
  expect(updatedTicket!.price).toEqual(ticket.price);
  expect(updatedTicket!.title).toEqual(ticket.title);
  expect(updatedTicket!.userId).toEqual(ticket.userId);
  // Write assertions to make sure ack function is called
  expect(msg.ack).toHaveBeenCalled();
});
