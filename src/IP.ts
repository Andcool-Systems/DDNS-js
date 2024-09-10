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

        const ip = data.split('\n').map((line) => line.split('=')).filter((line) => line[0] === 'ip')[0][1];
        const isV4 = validator.isIP(ip, 4);

        return { ip: ip, version: isV4 ? 4 : 6, type: isV4 ? 'A' : 'AAAA' };
    }
}