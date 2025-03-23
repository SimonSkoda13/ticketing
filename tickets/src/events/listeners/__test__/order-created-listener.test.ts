import { OrderCreatedEvent } from "./../../../../../common/src/events/custom-events/order-created-event";
import { OrderStatus } from "@tickets-com/common";
import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCreatedListener } from "../order-created-listener";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";

const setup = async () => {
  // Create an instance of the listener
  const listener = new OrderCreatedListener(natsWrapper.client);
  // Create and save a ticket
  const ticket = Ticket.build({
    title: "concert",
    price: 99,
    userId: "asdf",
  });
  await ticket.save();
  // Create a fake data event
  const data: OrderCreatedEvent["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
    userId: new mongoose.Types.ObjectId().toHexString(),
    expiresAt: "some date",
    ticket: {
      id: ticket.id,
      price: ticket.price,
    },
  };
  const msg = {
    ack: jest.fn(),
  } as unknown as Message;
  return { listener, ticket, data, msg };
};

it("sets the orderId of the ticket", async () => {
  const { listener, ticket, data, msg } = await setup();
  // Call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);
  // Write assertions to make sure a ticket was created!
  const updatedTicket = await Ticket.findById(ticket.id);
  expect(updatedTicket!.orderId).toEqual(data.id);
});
it("acks the message", async () => {
  const { listener, data, msg } = await setup();
  // Call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);
  // Write assertions to make sure ack function is called
  expect(msg.ack).toHaveBeenCalled();
});

it("publishes a ticket updated event", async () => {
  const { listener, ticket, data, msg } = await setup();
  // Call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);
  // Write assertions to make sure ack function is called
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
