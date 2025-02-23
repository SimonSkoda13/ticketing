import nats, { Message, Stan } from "node-nats-streaming";
import { randomBytes } from "crypto";
import { TicketCreatedListener } from "./events/ticket-created-listener";

const client = nats.connect("tickets", randomBytes(4).toString("hex"), {
  url: "http://localhost:4222",
});

client.on("connect", () => {
  console.log("Listener connected to NATS");

  client.on("close", () => {
    console.log("NATS connection closed");
    process.exit();
  });

  const listener = new TicketCreatedListener(client);
  listener.listen();
});

process.on("SIGINT", () => client.close());
process.on("SIGTERM", () => client.close());
