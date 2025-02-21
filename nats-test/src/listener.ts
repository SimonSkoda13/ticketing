import nats from "node-nats-streaming";
import { randomBytes } from "crypto";

const client = nats.connect("tickets", randomBytes(4).toString("hex"), {
  url: "http://localhost:4222",
});

client.on("connect", () => {
  console.log("Listener connected to NATS");

  client.on("close", () => {
    console.log("NATS connection closed");
    process.exit();
  });

  const options = client
    .subscriptionOptions()
    .setManualAckMode(true)
    .setDeliverAllAvailable()
    .setDurableName("orders-service");

  const subscribtion = client.subscribe(
    "ticket:created",
    "orders-service-queue-group",
    options
  );
  subscribtion.on("message", (msg) => {
    const data = msg.getData();
    if (typeof data === "string") {
      console.log(`Received event #${msg.getSequence()} with data: ${data}`);
    }

    msg.ack();
  });
});

process.on("SIGINT", () => client.close());
process.on("SIGTERM", () => client.close());
