import { randomBytes } from "crypto";
import nats from "node-nats-streaming";
import { TicketCreatedPublisher } from "./events/ticket-created-publisher";

const client = nats.connect("tickets", randomBytes(4).toString("hex"), {
  url: "http://localhost:4222",
});

client.on("connect", () => {
  console.log("Publisher connected to NATS");

  const publisher = new TicketCreatedPublisher(client);
  publisher
    .publish({
      id: "123",
      title: "concert",
      price: 20,
    })
    .catch(console.error);
});

client.on("error", (err) => {
  console.error("Error connecting to NATS:", err);
});
