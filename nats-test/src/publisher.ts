import { randomBytes } from "crypto";
import nats from "node-nats-streaming";

const client = nats.connect("tickets", randomBytes(4).toString("hex"), {
  url: "http://localhost:4222",
});

client.on("connect", () => {
  console.log("Publisher connected to NATS");

  const data = JSON.stringify({
    id: randomBytes(4).toString("hex"),
    title: "concert",
    price: 20,
  });

  client.publish("ticket:created", data, (err) => {
    if (err) {
      console.error("Error publishing:", err);
    } else {
      console.log("Event published");
    }
  });
});

client.on("error", (err) => {
  console.error("Error connecting to NATS:", err);
});
