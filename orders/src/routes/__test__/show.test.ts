import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import { Order, OrderStatus } from "../../models/order";
import mongoose from "mongoose";

it("Fetches the order", async () => {
  const ticket = Ticket.build({
    title: "concert",
    price: 20,
  });
  await ticket.save();

  const user = global.signin();

  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ ticketId: ticket.id })
    .expect(201);

  const { body: fetchedOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", user)
    .send()
    .expect(200);

  expect(fetchedOrder.id).toEqual(order.id);
});

it("Returns an error if the order does not exist", async () => {
  const orderId = new mongoose.Types.ObjectId();

  await request(app)
    .get(`/api/orders/${orderId}`)
    .set("Cookie", global.signin())
    .send()
    .expect(404);
});

it("Can fetch only owner", async () => {
  const ticket1 = Ticket.build({
    title: "concert",
    price: 20,
  });
  await ticket1.save();

  const user1 = global.signin();
  const user2 = global.signin();

  const { body: orderOne } = await request(app)
    .post("/api/orders")
    .set("Cookie", user1)
    .send({ ticketId: ticket1.id })
    .expect(201);

  await request(app)
    .get(`/api/orders/${orderOne.id}`)
    .set("Cookie", user1)
    .send()
    .expect(200);

  await request(app)
    .get(`/api/orders/${orderOne.id}`)
    .set("Cookie", user2)
    .send()
    .expect(401);
});
