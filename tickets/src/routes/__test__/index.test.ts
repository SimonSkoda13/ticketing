import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";

it("can fetch a list of tickets", async () => {
  const title = "concert";
  const price = 20;

  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signIn())
    .send({ title, price })
    .expect(201);

  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signIn())
    .send({ title: title + "34", price: 30 })
    .expect(201);

  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signIn())
    .send({ title: title + "4", price: 2 })
    .expect(201);

  const response = await request(app).get("/api/tickets").send().expect(200);

  expect(response.body.length).toEqual(3);
});
