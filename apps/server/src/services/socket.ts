import { Server } from "socket.io";
import { Redis } from "ioredis";

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

      socket.on("event:message", async ({ message }: { message: string }) => {
        console.log("New Message Rec .", message);
        //publish this message to redis
        await pub.publish("MESSAGE", JSON.stringify({ message }));
      });
    });

    sub.on("message", async (channel, message) => {
      // message recived by subscriber in redis
      if (channel === "MESSAGE") {
        io.emit("message", message); // emitting messages to the subscribrd client.
      }
    });
  }
  get io() {
    return this._io;
  }
}

export default SocketService;
