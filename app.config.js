export default ({ config }) => ({
  ...config,
  extra: {
    DATABASE_ID: process.env.DATABASE_ID,
    COLLECTION_ID: process.env.COLLECTION_ID,
    TASKS_COLLECTION_ID: process.env.TASKS_COLLECTION_ID,
  },
});
