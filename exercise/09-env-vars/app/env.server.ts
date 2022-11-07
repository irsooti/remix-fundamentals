import invariant from "tiny-invariant";

declare global {
  var ENV: ReturnType<typeof getEnv>;
  interface Window {
    ENV: ReturnType<typeof getEnv>;
  }
}

export function getEnv() {
  invariant(process.env.ADMIN_EMAIL, "ADMIN_EMAIL is required");

  return {
    ADMIN_EMAIL: process.env.ADMIN_EMAIL,
  };
}
