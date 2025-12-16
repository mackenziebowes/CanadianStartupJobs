import { useState } from "react";
import z from "zod";

const modeSchema = z.enum(["create", "read", "update", "delete"]);
type Mode = z.infer<typeof modeSchema>;

export default function SourcesPage() {
  const [mode, set_mode] = useState<Mode>("read");
}
