export default ({ config }) => ({
  ...config,
  extra: {
    ...config.extra,
    DATABASE_ID: process.env.DATABASE_ID,
    COLLECTION_ID: process.env.COLLECTION_ID,
    TASKS_COLLECTION_ID: process.env.TASKS_COLLECTION_ID,
    LEVELS_COLLECTION_ID: process.env.LEVELS_COLLECTION_ID,
    INVENTORY_COLLECTION_ID: process.env.INVENTORY_COLLECTION_ID,
    CHARACTERS_COLLECTION_ID: process.env.CHARACTERS_COLLECTION_ID,
    STORAGE_BUCKET_ID: process.env.STORAGE_BUCKET_ID,
    DEV_MODE_PASSWORD: process.env.DEV_MODE_PASSWORD,
    eas: {
      projectId: "916d292a-6b8c-417b-9d39-9e7e0c7f51a5",
    },
  },
});
