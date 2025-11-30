# Farm Stellar Backend (Minimal)

Node.js + Express + MongoDB + AWS S3 presigned uploads.

## Features
- JWT auth (signup/login)
- User & Farm update
- Dashboard summary
- Quests listing & progress update
- AWS S3 presigned upload URL generation
- Quest submissions saved with `status: "pending"` (enforced)
- Rewards listing & simple redeem (XP deduction, stock decrement)
- Health check

## Tech Stack
Express, Mongoose, JWT, bcrypt, AWS SDK v3 (S3), dotenv, CORS.

## Environment Variables (.env)
```
MONGO_URI=mongodb://localhost:27017/farm_stellar
JWT_SECRET=change_me
AWS_REGION=us-east-1
AWS_S3_BUCKET=<your-bucket-name>
AWS_ACCESS_KEY_ID=<your-access-key>
AWS_SECRET_ACCESS_KEY=<your-secret-key>
UPLOAD_MAX_BYTES=10485760
PORT=4000
```

## Install & Run
```powershell
cd backend
npm install
npm run dev
```

## Folder Structure
```
backend/
  src/
    config/ (env, db)
    models/ (User, Farm, Quest, Submission, Reward)
    middleware/ (auth)
    services/ (s3)
    controllers/ (*Controller.js)
    routes/ (*Routes.js)
    server.js
```

## Authentication
Obtain token via `/api/auth/signup` or `/api/auth/login`. Use header:
```
Authorization: Bearer <token>
```

## Key Endpoints (CURl Examples)
Signup:
```bash
curl -X POST http://localhost:4000/api/auth/signup -H "Content-Type: application/json" -d '{"name":"Alice","email":"alice@example.com","password":"secret123"}'
```
Login:
```bash
curl -X POST http://localhost:4000/api/auth/login -H "Content-Type: application/json" -d '{"email":"alice@example.com","password":"secret123"}'
```
Get Me:
```bash
curl -H "Authorization: Bearer $TOKEN" http://localhost:4000/api/users/me
```
Dashboard:
```bash
curl -H "Authorization: Bearer $TOKEN" http://localhost:4000/api/dashboard
```
List Quests:
```bash
curl -H "Authorization: Bearer $TOKEN" http://localhost:4000/api/quests
```
Presign Upload:
```bash
curl -X POST http://localhost:4000/api/uploads/presign -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" -d '{"mimeType":"image/jpeg","sizeBytes":12345}'
```
Submit Quest Proof:
```bash
curl -X POST http://localhost:4000/api/submissions -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" -d '{"questId":"soil","media":[{"key":"uploads/...jpg","mimeType":"image/jpeg","sizeBytes":12345}],"notes":"My proof"}'
```
Rewards:
```bash
curl -H "Authorization: Bearer $TOKEN" http://localhost:4000/api/rewards
```
Redeem Reward:
```bash
curl -X POST http://localhost:4000/api/rewards/redeem -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" -d '{"rewardId":"<ID>"}'
```

## Notes
- Submissions always stored as `pending` (schema enforced).
- Admin verification workflow included for quest approval.
- HEAD object check ensures file was uploaded to S3 before creating submission.
- Adjust logic easily in controllers (kept minimal).

## Postman
Import `postman_collection.json` for ready-made requests.

## Next Steps (Optional)
- Seed initial quests & rewards
- Configure S3 bucket CORS for frontend uploads
- Add pagination / validation library if needed

Enjoy hacking! Minimal and editable.
