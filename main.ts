import * as tmi from "tmi.js";
import { GetToken } from "botway.js";

const reputation: any = {};
const client = new tmi.Client({
  options: { debug: true },
  connection: {
    secure: true,
    reconnect: true,
  },
  identity: {
    username: "USERNAME",
    password: GetToken(),
  },
  channels: ["CHANNEL_NAME"], // you can use your username as channel name
});

client.connect();

client.on("message", (channel, tags, message, self) => {
  const reputationRegex = /(\+\+|--)/g;

  if (reputationRegex.test(message)) {
    const [user, operator]: any = message.split(reputationRegex);

    if (!(user in reputation)) {
      reputation[user] = 0;
    }

    if (operator === "++") {
      reputation[user]++;
    } else {
      reputation[user]--;
    }

    client.say(
      channel,
      `@${tags.username}, ${user} now has a reputation of ${reputation[user]}`
    );

    return;
  }

  if (self || !message.startsWith("!")) {
    return;
  }

  const args: any = message.slice(1).split(" ");
  const command = args.shift().toLowerCase();

  if (command === "echo") {
    client.say(channel, `@${tags.username}, you said: "${args.join(" ")}"`);
  } else if (command === "hello") {
    client.say(channel, `@${tags.username}, Yo what's up`);
  } else if (command === "dice") {
    const result = Math.floor(Math.random() * 6) + 1;
    client.say(channel, `@${tags.username}, You rolled a ${result}.`);
  }
});
