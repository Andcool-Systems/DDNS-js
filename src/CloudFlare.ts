import axios from 'axios';
import { IPInterface } from './IP';

interface Record {
    id: string,
    zone_id: string,
    zone_name: string,
    name: string,
    type: string,
    content: string,
    proxied: boolean,
    ttl: number

}

interface CFRecordResponse {
    result: Record[]
}

export class CloudFlare {
    zone: string;
    token: string;

    constructor(zone: string, token: string) {
        this.zone = zone
        this.token = token;
    }

    getRecords = async (records: string[]) => {
        const response = await axios.get(`https://api.cloudflare.com/client/v4/zones/${this.zone}/dns_records`,
            {
                headers: { Authorization: `Bearer ${this.token}` },
                validateStatus: () => true
            }
        )
        const cf_response = response.data as CFRecordResponse;
        return cf_response.result?.filter((record) => records.includes(record.name) && ['A', 'AAAA'].includes(record.type));
    }

    createRecord = async (name: string, content: IPInterface, proxied: boolean): Promise<Record | null> => {
        const response = await axios.post(`https://api.cloudflare.com/client/v4/zones/${this.zone}/dns_records`,
            {
                content: content.ip,
                name: name,
                proxied: proxied,
                type: content.type
            },
            {
                headers: { Authorization: `Bearer ${this.token}` },
                validateStatus: () => true
            }
        );
        return response.data.result as Record;
    }

    updateRecord = async (content: IPInterface, proxied: boolean, record: Record): Promise<Record | null> => {
        const response = await axios.patch(`https://api.cloudflare.com/client/v4/zones/${this.zone}/dns_records/${record.id}`,
            {
                content: content.ip,
                proxied: proxied,
                type: content.type
            },
            {
                headers: { Authorization: `Bearer ${this.token}` },
                validateStatus: () => true
            }
        );
        return response.data.result as Record;
    }
}