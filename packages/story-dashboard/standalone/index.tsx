import { Socket } from "@mcesystems/reflow-story/src/transport/types";
import * as React from "react";
import { render } from "react-dom";
import { io, Socket as SocketIOSocket } from "socket.io-client";
import { Dashboard } from "../src/index";

const hydrateSocket = (socket: SocketIOSocket): Socket => {
  return {
    on(message, handler) {
      socket.on(message, handler as any);
      return hydrateSocket(socket);
    },
    call(message, data) {
      socket.emit(message, data);
      return hydrateSocket(socket);
    },
  };
};

const socket = io("http://localhost:5555");

const main = document.getElementById("main");
if (main) {
  render(<Dashboard {...hydrateSocket(socket)} />, main);
}
