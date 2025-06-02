import { beforeAll, describe, expect, it } from "vitest";
import supertest from "supertest";
import type { Application } from "express";
import dayjs from "dayjs";

let app: Application;

describe("Login Route test", () => {

    beforeAll(async () => {
        const buildApp = (await import("../app.js")).default;
        app = await buildApp();
    });

    it("should return the login page, when using a GET request", async () => {

        // RegExp for login page specific string in HTML
        const res = await supertest(app)
            .get("/login")
            .expect(200)

        expect(res.text).toMatch(/assets\/v[0-9.a-z]+\/src\/login\.js/);

    });

    it("returns a 401 status, when login fails with wrong password", async () => {

        await supertest(app)
            .post("/login")
            .send({ password: "fakePassword" })
            .expect(401)

    });


    it("sets correct Expires, when 'Remember Me' is ticked", async () => {

        // TriliumNextTODO: make setting cookieMaxAge via env variable work
        // => process.env.TRILIUM_SESSION_COOKIEMAXAGE
        // the custom cookieMaxAge is currently hardocded in the test data dir's config.ini

        const CUSTOM_MAX_AGE_SECONDS = 86400;
        const expectedExpiresDate = dayjs().utc().add(CUSTOM_MAX_AGE_SECONDS, "seconds").toDate().toUTCString();

        const res = await supertest(app)
            .post("/login")
            .send({ password: "demo1234", rememberMe: 1 })
            .expect(302)

        const setCookieHeader = res.headers["set-cookie"][0];

        // match for e.g. "Expires=Wed, 07 May 2025 07:02:59 GMT;"
        const expiresCookieRegExp = /Expires=(?<date>[\w\s,:]+)/;
        const expiresCookieMatch = setCookieHeader.match(expiresCookieRegExp);
        const actualExpiresDate = new Date(expiresCookieMatch?.groups?.date || "").toUTCString()

        expect(actualExpiresDate).to.not.eql("Invalid Date");

        // ignore the seconds in the comparison, just to avoid flakiness in tests,
        // if for some reason execution is slow between calculation of expected and actual
        expect(actualExpiresDate.slice(0,23)).toBe(expectedExpiresDate.slice(0,23))

    }, 10_000);
    // use 10 sec (10_000 ms) timeout for now, instead of default 5 sec to work around
    // failing CI, because for some reason it currently takes approx. 6 secs to run
    // TODO: actually identify what is causing this and fix the flakiness


    it("does not set Expires, when 'Remember Me' is not ticked", async () => {

        const res = await supertest(app)
            .post("/login")
            .send({ password: "demo1234" })
            .expect(302)

        const setCookieHeader = res.headers["set-cookie"][0];

        // match for e.g. "Expires=Wed, 07 May 2025 07:02:59 GMT;"
        const expiresCookieRegExp = /Expires=(?<date>[\w\s,:]+)/;
        const expiresCookieMatch = setCookieHeader.match(expiresCookieRegExp);
        expect(expiresCookieMatch).toBeNull();

    }, 10_000);
    // use 10 sec (10_000 ms) timeout for now, instead of default 5 sec to work around
    // failing CI, because for some reason it currently takes approx. 6 secs to run
    // TODO: actually identify what is causing this and fix the flakiness


});
