import sql from "../services/sql.js";
import session, { Store } from "express-session";
import sessionSecret from "../services/session_secret.js";
import config from "../services/config.js";
import log from "../services/log.js";
import type express from "express";

class SQLiteSessionStore extends Store {

    get(sid: string, callback: (err: any, session?: session.SessionData | null) => void): void {
        try {
            const data = sql.getValue<string>(/*sql*/`SELECT data FROM sessions WHERE id = ?`, sid);
            let session = null;
            if (data) {
                session = JSON.parse(data);
            }
            return callback(null, session);
        } catch (e: unknown) {
            log.error(e);
            return callback(e);
        }
    }

    set(id: string, session: session.SessionData, callback?: (err?: any) => void): void {
        try {
            const expires = session.cookie?.expires
                ? new Date(session.cookie.expires).getTime()
                : Date.now() + 3600000; // fallback to 1 hour
            const data = JSON.stringify(session);

            sql.upsert("sessions", "id", {
                id,
                expires,
                data
            });
            callback?.();
        } catch (e) {
            log.error(e);
            return callback?.(e);
        }
    }

    destroy(sid: string, callback?: (err?: any) => void): void {
        try {
            sql.execute(/*sql*/`DELETE FROM sessions WHERE id = ?`, sid);
            callback?.();
        } catch (e) {
            log.error(e);
            callback?.(e);
        }
    }

}

const sessionParser: express.RequestHandler = session({
    secret: sessionSecret,
    resave: false, // true forces the session to be saved back to the session store, even if the session was never modified during the request.
    saveUninitialized: false, // true forces a session that is "uninitialized" to be saved to the store. A session is uninitialized when it is new but not modified.
    cookie: {
        path: "/",
        httpOnly: true,
        maxAge: config.Session.cookieMaxAge * 1000 // needs value in milliseconds
    },
    name: "trilium.sid",
    store: new SQLiteSessionStore()
});

setInterval(() => {
    // Clean up expired sesions.
    const now = Date.now();
    const result = sql.execute(/*sql*/`DELETE FROM sessions WHERE expires < ?`, now);
    console.log("Cleaning up expired sessions: ", result.changes);
}, 60 * 60 * 1000);

export default sessionParser;
