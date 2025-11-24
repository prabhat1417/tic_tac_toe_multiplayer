import { Client } from "@heroiclabs/nakama-js";
import { v4 as uuidv4 } from "uuid";

const useSSL = false; // Default for local Nakama
const verbose = false; // Default for local Nakama

export const client = new Client("defaultkey", "127.0.0.1", "7350", useSSL);

export const getSession = async (username) => {
    let deviceId = localStorage.getItem("deviceId");
    if (!deviceId) {
        deviceId = uuidv4();
        localStorage.setItem("deviceId", deviceId);
    }

    // Authenticate with device ID and create if needed. 
    // We pass username as the 3rd argument to set it on creation.
    const session = await client.authenticateDevice(deviceId, true, username);
    localStorage.setItem("user_id", session.user_id);

    // Force update username to ensure it matches what the user entered,
    // even if the account already existed.
    if (username) {
        try {
            await client.updateAccount(session, { username: username });
        } catch (e) {
            console.warn("Failed to update username (might be taken or unchanged):", e);
        }
    }

    return session;
};
