import * as bcrypt from "bcrypt-ts"

export async function createToken() {
    const prefix = generateToken(8)
    const token = `hk.ey${prefix}-${generateToken(16)}`
    const hash = await bcrypt.hash(token, 2)
    return {
        token,
        hash,
        prefix
    }
}

export function generateToken(n: number): string {
    const chars = 'bcdfgjlmopqrstuwxzBCDFGJLMOPQRSTUWXZ0123456789';
    let token = '';
    for(let i = 0; i < n; i++) {
        token += chars[Math.floor(Math.random() * chars.length)];
    }
    return token;
}