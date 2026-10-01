// Mirrors backend/supabase/functions/_shared/profile.js — the backend is
// what actually enforces these (profile-setup, profile-update); this file
// lets the UI validate/cap input the same way before ever submitting.
export const USERNAME_PATTERN = /^[a-zA-Z0-9_]{3,20}$/;
export const USERNAME_MAX_LENGTH = 20;
export const GAMER_ID_MAX_LENGTH = 40;

export const USERNAME_HELP = "Username must be 3-20 characters: letters, numbers, underscore.";

export function isValidUsername(username: string): boolean {
  return USERNAME_PATTERN.test(username);
}
