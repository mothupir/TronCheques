import crypto from 'crypto';

const algo = process.env.ALGORITHM!;
const salt = process.env.SALT!;
const key = process.env.ENCRYPTION_KEY!;

export const encrypt = (text: string): string => {
    const cipher = crypto.createCipheriv(algo, key, salt);
    let encrypted = cipher.update(text, 'utf-8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
}

export const decrypt = (text: string): string => {
    const decipher = crypto.createDecipheriv(algo, key, salt);
    let decrypted = decipher.update(text, 'hex', 'utf-8');
    decrypted += decipher.final('utf-8');
    return decrypted;
}