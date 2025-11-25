import { Client } from "@heroiclabs/nakama-js";
import { v4 as uuidv4 } from "uuid";

const useSSL = false; // Default for local Nakama
const verbose = false; // Default for local Nakama

export const client = new Client("defaultkey", "127.0.0.1", "7350", useSSL);

import { Session } from "@heroiclabs/nakama-js";

export const restoreSession = async () => {
    const token = localStorage.getItem("nakama_token");
    if (!token) return null;

    try {
        const session = Session.restore(token);
        if (session.isexpired(Date.now() / 1000)) {
            return null;
        }

        // Refresh if close to expiry? For now just return if valid.
        return session;
    } catch (e) {
        console.error("Session restore failed:", e);
        return null;
    }
};

export const getSession = async (username) => {
    let deviceId = localStorage.getItem("deviceId");
    if (!deviceId) {
        deviceId = uuidv4();
        localStorage.setItem("deviceId", deviceId);
    }

    try {
        // Authenticate with device ID.
        // We do NOT pass username here initially if we want to handle "taken" errors gracefully 
        // via updateAccount, OR we pass it and catch the creation error.
        // Let's pass it. If it fails due to conflict, it throws.
        const session = await client.authenticateDevice(deviceId, true, username);

        // Store token for persistence
        localStorage.setItem("nakama_token", session.token);
        localStorage.setItem("user_id", session.user_id);

        // Force update username to ensure it matches what the user entered.
        // This handles the case where we logged in with an existing Device ID 
        // but want to change/set the username.
        if (username && session.username !== username) {
            await client.updateAccount(session, { username: username });
        }

        return session;
    } catch (e) {
        console.error("Auth Error:", e);
        // Propagate error so UI can show it
        throw e;
    }
};
