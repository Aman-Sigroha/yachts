import { syncAllData } from '../services/sync-db';

const runSync = async () => {
    try {
        await syncAllData();
        process.exit(0);
    } catch (error) {
        console.error('Sync failed:', error);
        process.exit(1);
    }
};

runSync();
