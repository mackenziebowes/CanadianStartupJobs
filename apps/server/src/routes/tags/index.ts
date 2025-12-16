import { Hono } from "hono";
import experienceLevels from "./experienceLevels";
import industries from "./industries";
import jobTypes from "./jobTypes";
import provinces from "./provinces";
import raisingStage from "./raisingStage";
import roles from "./roles";
import teamSize from "./teamSize";

const app = new Hono();

app.route("/experience-levels", experienceLevels);
app.route("/industries", industries);
app.route("/job-types", jobTypes);
app.route("/provinces", provinces);
app.route("/raising-stage", raisingStage);
app.route("/roles", roles);
app.route("/team-size", teamSize);

export default app;
