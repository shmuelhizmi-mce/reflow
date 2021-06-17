import { createWriteTransport } from "../src/transport/index";
import { Socket } from "../src/transport/types";
import { Server, Socket as SocketIOSocket } from "socket.io";
import { Node } from "../src/factory";
import { NodeTypes, CrashType } from "../src/types";

const server = new Server({ cors: { origin: "*" } });

const sleep = (time: number) =>
  new Promise((res) => setTimeout(res, time * 1000));

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

server.on("connection", async (socket) => {
  const writer = createWriteTransport(hydrateSocket(socket));

  let story: Node<NodeTypes> = Node.story("test story", writer);

  await sleep(1);

  story = story.info("starting the app");

  await sleep(0.4);

  const mainFlow = story.flow("starting the main flow");

  await sleep(0.7);

  const buttonDecision = mainFlow.decision("what button should I press ?");

  sleep(0.7).then(async () => {
    const redButton = buttonDecision.info("the BIG red button was chosen!");
    await sleep(1.5);
    redButton.expect(
      "the button must be red and big",
      "{ 'color': 'red', big: true }",
      "{ 'color': 'red', big: true }",
      true
    );
  });
  sleep(1.7).then(async () => {
    const greenButton = buttonDecision.info("the green button was chosen!");
    await sleep(2.5);
    const greenButtonFlow = greenButton.flow("starting the green button flow");
    await sleep(2.5);
    greenButtonFlow.throw(
      CrashType.CodeCrash,
      new Error("the green button flow is buggy")
    );
  });
});

server.listen(5555);
