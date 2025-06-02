import type { Router } from "express";

import fs from "fs";
import path from "path";
import { RESOURCE_DIR } from "../services/resource_dir";

const specPath = path.join(RESOURCE_DIR, "etapi.openapi.yaml");
let spec: string | null = null;

function register(router: Router) {
    router.get("/etapi/etapi.openapi.yaml", (_, res) => {
        if (!spec) {
            spec = fs.readFileSync(specPath, "utf8");
        }

        res.header("Content-Type", "text/plain"); // so that it displays in browser
        res.status(200).send(spec);
    });
}

export default {
    register
};
