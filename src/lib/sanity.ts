import { createClient } from "@sanity/client";

export const sanity = createClient({
  projectId: "dv3h64c1",
  dataset: "production",
  apiVersion: "2023-01-01",
  useCdn: true,
});