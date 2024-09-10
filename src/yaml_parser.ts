import { readFileSync } from 'fs';
import { load } from 'js-yaml';
import * as yup from 'yup';
import { ValidationError } from 'yup';

interface Config {
    zone: string;
    period: number;
    token: string;
    records: {
        hostname: string,
        proxied: boolean
    }[]
}

const configSchema = yup.object({
    zone: yup.string().required(),
    period: yup.number().required().positive().integer(),
    token: yup.string().required(),
    records: yup.array().of(
        yup.object({
            hostname: yup.string().required(),
            proxied: yup.boolean().required(),
        })
    ).required(),
});

export const getConfig = (path?: string): Config | null => {
    try {
        const fileContents = readFileSync(path || 'config.yaml', 'utf8');
        const data = load(fileContents) as Config;
        configSchema.validateSync(data);
        return data;
    } catch (e) {
        if (e instanceof yup.ValidationError) {
            console.error('Config file syntax error:', e.errors.join('\n'));
        } else {
            console.error('Unhandled error:', e);
        }
        return null;
    }
}