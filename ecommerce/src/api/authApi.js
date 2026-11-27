import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8083/auth",
});

export const signup = (data) =>
  API.post("/signup", data);

export const login = (data) =>
  API.post("/login", data);

export const sendOtp = (email) =>
  API.post("/send-otp", { email });

export const verifyOtp = (email, otp) =>
  API.post("/verify-otp", { email, otp });

export const sendLoginOtp = (email) =>
  API.post("/send-otp", { email });

export const verifyLoginOtp = (email, otp) =>
  API.post("/verify-otp", { email, otp });

/**
 * Google OAuth2 — backend redirect URL.
 * The browser is sent here directly (window.location.href),
 * so no axios call is needed.
 */
export const GOOGLE_AUTH_URL =
  "http://localhost:8083/auth/oauth2/google";

/**
 * Called by the OAuth2 callback page after the backend
 * redirects back with ?token=xxx&role=yyy in the URL.
 * Sends the token to the backend to verify and get a
 * clean user object (optional — only needed if your backend
 * requires a token-exchange step).
 */
export const googleTokenExchange = (token) =>
  API.post("/oauth2/token", { token });