import { Environment, Paddle } from "@paddle/paddle-node-sdk";

const paddle = new Paddle(process.env.NEXT_PUBLIC_PADDLE_API_KEY!, {
  environment:
    (process.env.NEXT_PUBLIC_PADDLE_ENVIRONMENT as "sandbox" | "production") ===
    "production"
      ? Environment.production
      : Environment.sandbox,
});

export default paddle;
