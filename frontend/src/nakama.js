import { Client } from "@heroiclabs/nakama-js";
import { v4 as uuidv4 } from "uuid";

const useSSL = false; // Default for local Nakama
const verbose = false; // Default for local Nakama

export const client = new Client("defaultkey", "127.0.0.1", "7350", useSSL);

export const getSession = async () => {
    let deviceId = localStorage.getItem("deviceId");
    if (!deviceId) {
        deviceId = uuidv4();
        localStorage.setItem("deviceId", deviceId);
    }

    const session = await client.authenticateDevice(deviceId, true);
    localStorage.setItem("user_id", session.user_id);
    return session;
};
