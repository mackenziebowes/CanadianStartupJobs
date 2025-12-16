import { Hono } from "hono";
import tags from "./routes/tags";

const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});
app.route("/tags", tags);

export default app;
