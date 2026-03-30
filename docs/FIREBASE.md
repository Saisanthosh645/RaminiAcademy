# Firebase data & database guide

This app uses **Firebase Authentication** plus **Cloud Firestore** for user profiles and course content.

## Collections & schema

| Collection | Document ID | Purpose |
|------------|-------------|---------|
| `users` | Firebase Auth `uid` | Profile, entitlements, per-course progress |
| `courses` | Course slug (e.g. `python-zero-hero`) | Catalog: syllabus, schedule, quizzes, price |

### `users/{uid}` fields

| Field | Type | Notes |
|-------|------|--------|
| `name` | string | Display name |
| `email` | string | |
| `enrolledCourses` | string[] | Course IDs the user is enrolled in |
| `paidCourses` | string[] | Course IDs purchased / unlocked |
| `progress` | map | Keys = course IDs, values = `CourseProgress` (see `src/types/firebase.ts`) |
| `createdAt` | timestamp | Set on first sign-in |

### `courses/{courseId}` fields

Matches `Course` in `src/types/firebase.ts` (title, `schedule`, `finalQuiz`, `price`, etc.).

## How the app loads data

1. **Auth** — Firebase Auth session.
2. **User profile** — `AuthProvider` subscribes to `users/{uid}` with `onSnapshot` so `paidCourses`, `enrolledCourses`, and `progress` stay live (e.g. after `scripts/assignCourse.js` or saving quiz progress).
3. **Courses** — `getDoc` / React Query on `courses/{id}`; catalog list uses `seedCourses` data in code + Firestore copies.

## Configuration

- **Client config** — `src/firebase/config.ts` uses `VITE_*` variables when set; otherwise public Ramini Academy defaults.
- **`.env`** — Copy from `.env.example` and set `VITE_FIREBASE_*` if you use another project.

## Security rules

`firestore.rules` in the repo root:

- Users may **read/write only their own** `users/{uid}` document.
- **Anyone signed in** can **read** `courses/*`.
- **No client writes** to `courses/*` (seed via Admin or Console).

Deploy rules in [Firebase Console](https://console.firebase.google.com) → Firestore → Rules, or with Firebase CLI:

```bash
firebase deploy --only firestore:rules
```

## Seeding courses

With strict rules, the in-app auto-seed is **off in production** unless `VITE_ENABLE_CLIENT_COURSE_SEED=true`.

- **Local dev** (`npm run dev`): client seed runs if the `courses` collection is empty and rules allow writes (temporary permissive rules), **or** seed manually.
- **Recommended for production**: use **Firebase Console** → Firestore → add documents, or an **Admin SDK** script with a service account.

The canonical course definitions live in `src/firebase/seedCourses.ts`. You can run a one-off import from a machine that uses the Firebase Admin SDK.

## Admin / ops scripts (`scripts/`)

| Script | Purpose |
|--------|---------|
| `assignCourse.js` | Grant `paidCourses` + `enrolledCourses` + default `progress` for a user by email. Updates **all** user docs matching that email (important if the same person signed in with both Google and Email/Password — they have different UIDs). |

Requires `scripts/serviceAccountKey.json` (from Firebase → Project settings → Service accounts). **Do not commit** this file.

```bash
cd scripts && npm install && node assignCourse.js "user@email.com" "python-zero-hero"
```

**Troubleshooting: "0 courses" on another device**

If you assigned a course on laptop but see 0 courses on mobile with the same email:

1. **Different sign-in methods** — Firebase treats `user@gmail.com` (Google) and `user@gmail.com` (Email/Password) as **separate accounts** with different UIDs. The script now updates **all** user docs matching the email.
2. **Sign in on mobile first** — A user doc is created only when that account signs in. Run `assignCourse` **after** the user has signed in on mobile so their doc exists.
3. **Re-run the script** — After signing in on the new device, run `assignCourse` again for that email to update the newly created doc.

## Code map

| Area | Path |
|------|------|
| Firebase init | `src/firebase/config.ts` |
| Collection names | `src/firebase/collections.ts` |
| Doc refs + `userFromFirestoreSnapshot` | `src/firebase/firestore.ts` |
| Auth API | `src/firebase/auth.ts` |
| Auth + live user doc | `src/lib/auth-context.tsx` |
| Course seed data + `seedCourses()` | `src/firebase/seedCourses.ts` |
| Types | `src/types/firebase.ts` |

## Storage & Analytics

- **Storage** is not wired in this repo yet; thumbnails use URLs/paths in course documents.
- **Analytics** (`measurementId`) can be enabled from the Firebase Console if you add the Analytics SDK.
