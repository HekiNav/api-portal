import dayjs from 'dayjs';
import * as z from 'zod'
import RelativeTime from "dayjs/plugin/relativeTime"
import { UserState, Visibility } from '@/db/schema';
dayjs.extend(RelativeTime)

export const EmailSchema = z.email({ error: 'Please enter a valid email.' }).trim()
export const UsernameSchema = z.string()
  .min(3, { error: "Username must be at least 3 char longs" })
  .max(20, { error: "Username cannot exceed 20 characters" })
  .regex(
    /^[A-Za-z0-9]{3,20}$/,
    "Username must not contain special characters"
  );

export type FormState<E extends readonly string[]> =
  | {
    errors?: FormErrors<E>
    step?: string
  }
export type FormErrors<E extends readonly string[]> = {
  [P in E[number]]?: { errors?: string[] }
}
export type OTPFormState = FormState<["email", "otp", "username", "server"]>

export interface User {
  lastSeen?: Date
  id: string
  name: string | null
  admin: boolean
  state: UserState,
  email: string
  createdAt: Date
  sessions?: Session[],
  applications?: Application[],
}

export interface Session {
  id: string
  userId: string
  expiresAt: Date
}

export interface Service {
  id: string,
  createdById: string,
  createdBy?: User | null,
  name: string,
  description: string | null,
  docsUrl: string | null,
  apiUrl: string,
  depreciationTime: Date | null,
  keyRequired: boolean,
  updateTime: Date,
  creationTime: Date,
  visibility: Visibility
}

export interface Application {
  id: string,
  createdById: string,
  createdBy?: User,
  name: string,
  services?: ApplicationService[]
}

export interface ApplicationService {
  applicationId: string,
  application?: Application,
  serviceId: string,
  service?: Service,
}

export function rib(a: number, b: number) {
  return Math.floor(Math.random() * (b - a) + a)
}

export const atLeastOneTrue = (shape: Record<string, z.ZodBoolean>, error: string) => z.object(shape).refine((obj) => !Object.values(obj).every(v => v == false), { error: error });

export enum NotificationType {
  TEXT = "TEXT",
}

export interface Notification {
  creationTime: Date,
  id: string
  recipientId: string,
  type: string,
  message: string,
  senderId: string | null,
  read: boolean,
  title: string
}

export function doServer(func: Promise<{ success: boolean; message: string; } | undefined>) {
  return new Promise((res, rej) => {
    func.then((data) => {
      if (!data) return rej(data);
      if (data.success) res(data);
      else rej(data);
    });
  });
}
export function momentToTZ(x: string | number | Date) {
  return dayjs(new Date(0).setUTCMilliseconds(new Date(x).getTime() - (new Date().getTimezoneOffset() * 60_000)))
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function objectMatch(x: Record<string, any>, y: Record<string, any>): boolean {
  const ok = Object.keys, tx = typeof x, ty = typeof y;
  return x && y && tx === 'object' && tx === ty ? (
    ok(x).length === ok(y).length &&
    ok(x).every(key => objectMatch(x[key], y[key]))
  ) : (x === y);
}
