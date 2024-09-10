import { CloudFlare } from './CloudFlare';
import { IP } from './IP';
import { getConfig } from './yaml_parser';

const start = async () => {
    const config = getConfig();
    if (!config) return;
    const Cf = new CloudFlare(config.zone, config.token);
    const Ip = new IP();

    setInterval(async () => {
        const ip = await Ip.getIP();
        if (!ip) {
            console.error(`Can't get current ip address. Skipping...`);
            return;
        }

        const records = await Cf.getRecords(config.records.map((record) => record.hostname));
        const not_existing_records = config.records.filter(record => !records.map(record => record.name).includes(record.hostname));

        records.forEach(async record => {
            const record_config = config.records.find(record_config => record_config.hostname === record.name);
            if (record.content === ip.ip && record_config?.proxied === record.proxied) return;
            await Cf.updateRecord(ip, record_config?.proxied ?? true, record);
            console.log(`Updated content for ${record.name}: ${record.content} -> ${ip.ip}`);
        })
        not_existing_records.forEach(async record => {
            await Cf.createRecord(record.hostname, ip, record.proxied);
            console.log(`Created record ${record.hostname} with content ${ip.ip}`);
        });
    }, config.period * 1000);
}

start();