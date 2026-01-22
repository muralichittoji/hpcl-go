import * as Crypto from "expo-crypto";
import * as SecureStore from "expo-secure-store";

const DEVICE_UUID_KEY = "DEVICE_UUID";

const generateUUIDv4 = async () => {
	const random = await Crypto.getRandomBytesAsync(16);

	// Set version (4) and variant bits
	random[6] = (random[6] & 0x0f) | 0x40;
	random[8] = (random[8] & 0x3f) | 0x80;

	const hex = Array.from(random, (b) => b.toString(16).padStart(2, "0"));

	return (
		hex.slice(0, 4).join("") +
		"-" +
		hex.slice(4, 6).join("") +
		"-" +
		hex.slice(6, 8).join("") +
		"-" +
		hex.slice(8, 10).join("") +
		"-" +
		hex.slice(10, 16).join("")
	);
};

export const getDeviceUUID = async () => {
	let uuid = await SecureStore.getItemAsync(DEVICE_UUID_KEY);

	if (!uuid) {
		uuid = await generateUUIDv4();
		await SecureStore.setItemAsync(DEVICE_UUID_KEY, uuid);
	}

	return uuid;
};
