import bcrypt from "bcrypt"

export async function createToken() {
    const token = generateToken(32)
    const hash = await bcrypt.hash(token, 10)
    return {
        token,
        hash
    }
}

export function generateToken(n: number): string {
    var chars = 'bcdfgjlmopqrstuwxyzBCDFGJLMOPQRSTUWXYZ0123456789';
    var token = 'hk.ey';
    for(var i = 0; i < n; i++) {
        token += chars[Math.floor(Math.random() * chars.length)];
    }
    return token;
}