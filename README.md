# Twitter Clone API

Root-level Express/MongoDB backend for a Twitter/X-style app.

## Structure

```text
src/
  config/       env and database connection
  controllers/  route logic lives here
  middleware/   auth, validation, errors
  models/       all Mongoose models
  routes/       API routes
  utils/        tokens, responses, async wrapper
```

There is no service layer in this version. Controllers call models directly.

## Setup

```bash
cp .env.example .env
npm install
npm run dev
```

API base URL:

```text
http://localhost:5000/api/v1
```

Swagger docs:

```text
http://localhost:5000/api/docs
```

## Backend features

- Authentication and JWT refresh/logout flow
- User profile management and search
- Tweet creation, updates, deletion, likes, bookmarks, reposts, and timeline access
- Follow/unfollow relationships and follower/following lists
- Notifications for likes, follows, mentions, reposts, and messages
- Conversations and direct messaging delivered through a pub/sub-based flow
- Media upload support through the media controller and model
- Admin dashboard and report management
- Search across users and tweets

## Main Routes

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/refresh`
- `POST /api/v1/auth/logout`
- `GET /api/v1/users/me`
- `PATCH /api/v1/users/me`
- `GET /api/v1/users/:username`
- `POST /api/v1/tweets`
- `GET /api/v1/tweets/timeline`
- `POST /api/v1/tweets/:tweetId/like`
- `POST /api/v1/tweets/:tweetId/bookmark`
- `POST /api/v1/tweets/:tweetId/repost`
- `POST /api/v1/follows/:userId`
- `GET /api/v1/notifications`
- `POST /api/v1/messages/conversations`
- `POST /api/v1/media`
- `GET /api/v1/search?q=term`
- `GET /api/v1/admin/dashboard`

## Seed dummy data

Use either of these options to bulk-insert demo data locally:

```bash
npm run seed:dummy
```

Or send a request to the seeded endpoint:

```bash
POST /api/v1/seed
```

The seed script creates sample users, tweets, follows, likes, bookmarks, reposts, and notifications for local development.

