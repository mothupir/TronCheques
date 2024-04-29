import crypto from 'crypto';

export const encrypt = (text: string): string => {
    const iv = crypto.randomBytes(parseInt(process.env.IVLG));
    const cipher = crypto.createCipheriv(process.env.ALGO, process.env.ENC, iv);
    const encoding: any = process.env.ENCO;
    return Buffer.concat([cipher.update(text,), cipher.final(), iv]).toString(encoding);
}

export const decrypt = (text: string): string => {
    const encoding: any = process.env.ENCO;
    const data = new Buffer(text, encoding);
    const iv = data.slice(-parseInt(process.env.IVLG));
    const encrypted = data.slice(0, data.length - parseInt(process.env.IVLG));
    const decipher = crypto.createDecipheriv(process.env.ALGO, process.env.ENC, iv);
    return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString();
}