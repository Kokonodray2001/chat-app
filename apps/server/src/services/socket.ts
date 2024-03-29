import { Server } from "socket.io";
import { Redis } from "ioredis";
import { produceMessage } from "./kafka";
//Publisher
const pub = new Redis({
  host: "redis-1c7a0b9-kokonodray2001-1d42.a.aivencloud.com",
  port: 21706,
  username: "default",
  password: "AVNS_7JkLaN-e5bR4TDLiHhz",
});
//Subcriber
const sub = new Redis({
  host: "redis-1c7a0b9-kokonodray2001-1d42.a.aivencloud.com",
  port: 21706,
  username: "default",
  password: "AVNS_7JkLaN-e5bR4TDLiHhz",
});
class SocketService {
  private _io: Server;

  constructor() {
    console.log("Init Socket Service ...");
    this._io = new Server({
      cors: {
        allowedHeaders: ["*"], //*  means all headers are allowed
        origin: "*",
      },
    });
    sub.subscribe("MESSAGE");
  }
  public initListeners() {
    const io = this.io;
    console.log("init socket listener ... ");
    io.on("connect", (socket) => {
      console.log("connection established", socket.id);
      //emit private message to desired client - PCQcZJ_LQEtPT58tAAAF
      socket.on("event:message", async ({ message }: { message: string }) => {
        console.log("New Message Rec .", message);
        //publish this message to redis
        await pub.publish("MESSAGE", JSON.stringify({ message }));
      });
      // socket.on('private message', ({ recipientId, message }) => {
      // Send the message to the specific socket ID
      // io.to(socket.id).emit("private message", {
      //   senderId: socket.id,
      //   message: `private for u ${socket.id}`,
      // });
      // });
    });

    sub.on("message", async (channel, message) => {
      // message recived by subscriber in redis
      if (channel === "MESSAGE") {
        io.emit("message", message); // emitting messages to the subscribed client.
        await produceMessage(message);
        console.log("Message produced to kafka broker");
      }
    });
  }
  get io() {
    return this._io;
  }
}

export default SocketService;
