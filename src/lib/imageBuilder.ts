import { createImageUrlBuilder } from "@sanity/image-url";
import { sanity } from "./sanity";

const builder = createImageUrlBuilder(sanity);

export function urlFor(source: any) {
  return builder.image(source);
}