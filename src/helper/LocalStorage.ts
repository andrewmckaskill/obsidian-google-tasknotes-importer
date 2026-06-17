import { PLUGIN_ID } from "./types";

const prefix = (varName: string): string => {
  return `${app.appId}-${PLUGIN_ID}-${varName}`;
}

export const getAT = (): string => {
	return window.localStorage.getItem(prefix("accessToken")) ?? "";
};
export const setAT = (googleAccessToken: string) => {
	window.localStorage.setItem(prefix("accessToken"), googleAccessToken);
};

export const getET = (): number => {
	const expirationTimeString =
		window.localStorage.getItem(prefix("expirationTime")) ?? "0";
	return parseInt(expirationTimeString, 10);
};


export const setET = (googleExpirationTime: number) => {
	window.localStorage.setItem(prefix("expirationTime"),googleExpirationTime + "");
};

export const ClearTokens = () => {
	window.localStorage.removeItem(prefix("accessToken"));
	window.localStorage.removeItem(prefix("refreshToken"));
	window.localStorage.removeItem(prefix("expirationTime"));
};
