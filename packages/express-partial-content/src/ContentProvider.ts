import type { Request } from "express";
import type { Content } from "./Content.js";
/**
 * @type {function (Request): Promise<Content>}
 */
export type ContentProvider = (req: Request) => Promise<Content>;
