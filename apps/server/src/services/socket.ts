import { Server } from "socket.io";

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
  }
  public initListeners() {
    const io = this.io;
    console.log("init socket listener ... ");

    io.on("connect", (socket) => {
      console.log("connection established", socket.id);

      socket.on("message", async ({ message }: { message: string }) => {
        console.log("New Message Rec .", message);
      });
    });
  }
  get io() {
    return this._io;
  }
}

export default SocketService;
