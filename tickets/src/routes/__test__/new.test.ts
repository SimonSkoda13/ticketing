import { app } from "../../app";
import request from "supertest";
import { Ticket } from "../../models/ticket";
import { natsWrapper } from "../../nats-wrapper";

// it("User must be authenticated", async () => {
it("has a route handler listening to /api/tickets for post requests", async () => {
  const response = await request(app).post("/api/tickets").send({});
  expect(response.status).not.toEqual(404);
});

it("can only be accessed authenticated", async () => {
  const response = await request(app).post("/api/tickets").send({});
  expect(response.status).toEqual(401);
});
it("returns a status other than 401 if the user is signed in", async () => {
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signIn())
    .send({});
  expect(response.status).not.toEqual(401);
});

it("returns an error if an invalid title", async () => {
  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signIn())
    .send({
      title: "",
      price: 10,
    })
    .expect(400);

  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signIn())
    .send({
      price: 10,
    })
    .expect(400);
});
it("returns an error if an invalid price", async () => {
  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signIn())
    .send({
      title: "title",
      price: -10,
    })
    .expect(400);

  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signIn())
    .send({
      title: "title",
    })
    .expect(400);
});

it("creates a ticket with valid inputs", async () => {
  // add in a check to make sure a ticket was saved
  let tickets = await Ticket.find({});
  expect(tickets.length).toEqual(0);

  const title = "title";
  const price = 20;

  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signIn())
    .send({
      title,
      price,
    })
    .expect(201);

  tickets = await Ticket.find({});
  expect(tickets.length).toEqual(1);
  expect(tickets[0].price).toEqual(price);
  expect(tickets[0].title).toEqual(title);
});

it("publishes an event", async () => {
  const title = "title";
  const price = 20;

  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signIn())
    .send({
      title,
      price,
    })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
