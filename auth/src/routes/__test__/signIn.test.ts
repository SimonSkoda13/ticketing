import request from "supertest";
import { app } from "../../app";

it("returns a 201 on successful sign in", async () => {
  await request(app)
    .post("/api/users/sign-up")
    .send({
      email: "Sajmon@skoda.com",
      password: "password",
    })
    .expect(201);

  await request(app)
    .post("/api/users/sign-in")
    .send({
      email: "Sajmon@skoda.com",
      password: "password",
    })
    .expect(200);
});

it("returns a 400 with an invalid email", async () => {
  return request(app)
    .post("/api/users/sign-in")
    .send({
      email: "skoda.com",
      password: "password",
    })
    .expect(400);
});

it("returns a 400 with non existing email", async () => {
  return request(app)
    .post("/api/users/sign-in")
    .send({
      email: "Sajmon@skoda.com",
      password: "pas",
    })
    .expect(400);
});

it("returns a 400 with an invalid password", async () => {
  await request(app)
    .post("/api/users/sign-up")
    .send({
      email: "Sajmon@skoda.com",
      password: "password",
    })
    .expect(201);

  await request(app)
    .post("/api/users/sign-in")
    .send({
      email: "Sajmon@skoda.com",
      password: "pas",
    })
    .expect(400);
});

it("returns a 400 with missing email and password", async () => {
  await request(app)
    .post("/api/users/sign-in")
    .send({
      email: "",
      password: "password",
    })
    .expect(400);

  await request(app)
    .post("/api/users/sign-in")
    .send({
      email: "Sajmon@skoda.com",
    })
    .expect(400);
});

it("sets a cookie after successful sign in", async () => {
  await request(app)
    .post("/api/users/sign-up")
    .send({
      email: "simon@skoda.com",
      password: "password",
    })
    .expect(201);

  const response = await request(app)
    .post("/api/users/sign-in")
    .send({
      email: "simon@skoda.com",
      password: "password",
    })
    .expect(200);

  expect(response.get("Set-Cookie")).toBeDefined();
});
