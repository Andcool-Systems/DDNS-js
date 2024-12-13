import axios from "axios";
import validator from 'validator';

export interface IPInterface {
    ip: string,
    version: 4 | 6,
    type: 'A' | 'AAAA'
}

export class IP {
    getIP = async (): Promise<IPInterface | null> => {
        const response = await axios.get('https://www.cloudflare.com/cdn-cgi/trace', { validateStatus: () => true });
        if (response.status !== 200) return null;
        const data = response.data as string;

        const ip_line = data.split('\n').map((line) => line.split('=')).find((line) => line[0] === 'ip');
        if (!ip_line) {
            console.error('Cannot get ip from response');
            return null;
        }

        const ip = ip_line[1];
        const isV4 = validator.isIP(ip, 4);
        if (!isV4 && !validator.isIP(ip, 6)) {
            console.error(`Invalid IP received: ${ip}`);
            return null;
        }

        return { ip: ip, version: isV4 ? 4 : 6, type: isV4 ? 'A' : 'AAAA' };
    }
}