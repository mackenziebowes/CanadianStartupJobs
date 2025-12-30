import { Hono } from "hono";
import { cors } from 'hono/cors';
import tags from "./routes/tags";
import jobs from "./routes/jobs/jobs";
import organizations from "./routes/organizations";
import sources from "./routes/sources";

const app = new Hono();

app.use("*", cors({
  origin: ['http://localhost:3001', 'http://localhost:3000'],
  credentials: true,
}));
app.get("/", (c) => {
  return c.text("Hello Hono!");
});
app.route("/tags", tags);
app.route("/jobs", jobs);
app.route("/organizations", organizations);
app.route("/sources", sources);

export default {
  port: 3050,
  fetch: app.fetch,
};
