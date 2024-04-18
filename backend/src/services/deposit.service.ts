import { encrypt } from './helper.service';

export const deposit = (code: string): string => {
    return encrypt(code);
}