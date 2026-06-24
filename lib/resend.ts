import { Resend } from "resend";

// Client Resend — solo lato server (usa RESEND_API_KEY da .env.local).
// Da importare unicamente nei Route Handler, mai in componenti client.
export const resend = new Resend(process.env.RESEND_API_KEY);
