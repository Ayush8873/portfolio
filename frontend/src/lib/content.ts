import { createHash } from "node:crypto";
import { PORTFOLIO } from "@/data/portfolio";
import type { Portfolio } from "./types";

/** Content comes from the constants file; its hash doubles as the run's "commit SHA". */
export function getPortfolio(): Portfolio {
  const sha = createHash("sha1").update(JSON.stringify(PORTFOLIO)).digest("hex").slice(0, 7);
  return { ...PORTFOLIO, build: { sha } };
}
