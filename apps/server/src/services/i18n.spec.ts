import { LOCALES } from "@triliumnext/commons";
import { readFileSync } from "fs";
import { join } from "path";

describe("i18n", () => {
    it("translations are valid JSON", () => {
        for (const locale of LOCALES) {
            if (locale.contentOnly) {
                continue;
            }

            const translationPath = join(__dirname, "..", "assets", "translations", locale.id, "server.json");
            const translationFile = readFileSync(translationPath, { encoding: "utf-8" });
            expect(() => JSON.parse(translationFile), `JSON error while parsing locale '${locale.id}' at "${translationPath}"`)
                .not.toThrow();
        }
    });
});
