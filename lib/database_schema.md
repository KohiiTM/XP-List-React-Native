# Appwrite Database Schemas Reference

## Users Collection

| Field          | Type     | Size | Required | Notes                    |
| -------------- | -------- | ---- | -------- | ------------------------ |
| id             | string   | 36   | Yes      | UUID, primary key        |
| userId         | string   | 36   | Yes      | Appwrite user ID (UUID)  |
| username       | string   | 32   | Yes      | Display name             |
| level          | integer  | —    | Yes      | Current user level       |
| totalXP        | integer  | —    | Yes      | Total XP earned          |
| currentLevelXP | integer  | —    | Yes      | XP within current level  |
| xpToNextLevel  | integer  | —    | Yes      | XP needed for next level |
| createdAt      | datetime | —    | Yes      | Creation timestamp       |
| updatedAt      | datetime | —    | Yes      | Last update timestamp    |

---

## Tasks Collection

| Field       | Type     | Size | Required | Notes                    |
| ----------- | -------- | ---- | -------- | ------------------------ |
| id          | string   | 36   | Yes      | UUID, primary key        |
| userId      | string   | 36   | Yes      | Owner (Appwrite user ID) |
| title       | string   | 100  | Yes      | Task title               |
| description | string   | 500  | No       | Task details             |
| difficulty  | string   | 10   | Yes      | "easy", "medium", "hard" |
| xpReward    | integer  | —    | Yes      | XP for completing task   |
| completed   | boolean  | —    | Yes      | Task completion status   |
| completedAt | datetime | —    | No       | When task was completed  |
| createdAt   | datetime | —    | Yes      | Creation timestamp       |
| updatedAt   | datetime | —    | Yes      | Last update timestamp    |

---

## XP History Collection

| Field         | Type     | Size | Required | Notes                       |
| ------------- | -------- | ---- | -------- | --------------------------- |
| id            | string   | 36   | Yes      | UUID, primary key           |
| userId        | string   | 36   | Yes      | Appwrite user ID            |
| taskId        | string   | 36   | Yes      | Reference to completed task |
| xpEarned      | integer  | —    | Yes      | XP earned in this event     |
| previousLevel | integer  | —    | Yes      | Level before XP event       |
| newLevel      | integer  | —    | Yes      | Level after XP event        |
| createdAt     | datetime | —    | Yes      | Timestamp of XP event       |

---

