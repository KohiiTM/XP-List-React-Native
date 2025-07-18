export default ({ config }) => ({
  ...config,
  extra: {
    DATABASE_ID: process.env.DATABASE_ID,
    COLLECTION_ID: process.env.COLLECTION_ID,
    TASKS_COLLECTION_ID: process.env.TASKS_COLLECTION_ID,
    LEVELS_COLLECTION_ID: process.env.LEVELS_COLLECTION_ID,
    STORAGE_BUCKET_ID: process.env.STORAGE_BUCKET_ID,
    DEV_MODE_PASSWORD: process.env.DEV_MODE_PASSWORD,
  },
});
