import request from "supertest";
import { app } from "../../app";

it("clears cookie after successful sign out", async () => {
  await request(app)
    .post("/api/users/sign-up")
    .send({
      email: "Sajmon@skoda.com",
      password: "password",
    })
    .expect(201);

  const response = await request(app)
    .get("/api/users/sign-out")
    .send({})
    .expect(200);

  const cookie = response.get("Set-Cookie");
  if (!cookie) {
    throw new Error("Expected cookie but got undefined.");
  }

  expect(cookie[0]).toEqual(
    "session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly"
  );
});
