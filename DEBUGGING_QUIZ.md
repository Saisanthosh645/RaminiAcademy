# Quiz Score Persistence - Debugging Guide

## What's Been Fixed

Added comprehensive error handling and logging to trace quiz completion from start to finish.

## How to Test & Debug

### Step 1: Open Browser DevTools
- Press `F12` or `Ctrl+Shift+I`
- Go to the **Console** tab

### Step 2: Complete a Quiz and Watch For These Log Messages

#### ✅ Expected Console Output:

```
📤 QuizView: Calling onComplete with score: 85 Quiz: Python Quiz 1
✅ onComplete callback exists, invoking with: 85
🎯 Quiz completed! Received score: 85 Type: number
📝 Saving quiz result with: {score: 85, currentCompletedClasses: 2, courseId: "python-zero-hero"}
🔄 Starting progress update for course: python-zero-hero {completedClasses: 2, quizScore: 85, userId: "abc123..."}
📊 Current progress in user object: {completedClasses: 2, totalClasses: 10, quizScore: 60, completed: false}
✏️ Updated progress object to save: {completedClasses: 2, totalClasses: 10, quizScore: 85, completed: false, certificateDate: undefined}
📁 Firestore update details: {collection: "users", docId: "abc123...", updatePayload: {...}}
✅ Successfully saved to Firestore!
🔄 Invalidating React Query cache...
✅ Cache invalidated!
✅ Quiz handler complete, modal closed
```

### Step 3: Check for Errors

#### ❌ If You See This, There's a Problem:

**Missing callback:**
```
⚠️ onComplete callback not provided, closing quiz instead
```
→ Solution: QuizView prop `onComplete` not passed from CourseDetail

**Firebase write failed:**
```
❌ FAILED to update course progress: FirebaseError: Permission denied
```
→ Solution: Check Firebase Firestore security rules

**Missing data:**
```
❌ Cannot update progress: missing course or user {course: false, user: true}
```
→ Solution: Course data not loaded yet (wait for course to load)

### Step 4: Verify Data in Firestore

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Navigate to your project → Firestore Database
3. Click on `users` collection
4. Find your user document
5. Check `progress.{courseId}.quizScore` field - **it should show your quiz score (0-100)**

### Step 5: Check Network Tab

1. In DevTools, go to **Network** tab
2. Complete a quiz
3. Look for a request to Firestore (usually POST request)
4. Click on it and check:
   - **Status**: Should be `200` (success)
   - **Preview/Response**: Should show the updated document

## Common Issues & Solutions

### Issue 1: Quiz Score Shows 0%

**Possible Causes:**
- Quiz validation failing (all answers marked incorrect)
- Quiz scoring logic broken

**Debug:**
```javascript
// In DevTools Console, run:
const score = 10; // correct answers
const total = 20; // total questions
const percentage = Math.round((score / total) * 100);
console.log(`Score: ${percentage}%`); // Should show 50%
```

### Issue 2: Progress Shows in Modal But Not in Firestore

**Possible Causes:**
- `updateDoc` call failing silently
- Firestore rules blocking write
- User not authenticated

**Debug:**
```javascript
// Check if updateDoc is working:
// 1. Look for the "✅ Successfully saved to Firestore!" message
// 2. If missing, look for "❌ FAILED to update course progress:" error
// 3. Check Firebase Console Rules tab
```

### Issue 3: Toast Notifications Not Showing

**Possible Causes:**
- Toast hook not initialized
- Component not wrapped in provider

**Debug:**
- Look for logs indicating if function reached toast call
- Check browser console for React errors

## Monitoring Progress

### Real-Time Check
After completing a quiz, immediately check:

1. **Console Logs**: Watch the emoji-prefixed messages above
2. **Progress Bar**: Should update on page (if cache invalidated)
3. **Firestore**: Manual check shows saved score
4. **Toast**: Should show "Quiz score saved successfully!"

### Expected Timeline
- Quiz completion: instant (displayed immediately)
- Firestore save: < 1 second
- UI refresh: < 500ms after cache invalidation
- Total: < 2 seconds for full completion

## Performance Considerations

- Quiz saves run in `async` function (doesn't block UI)
- Cache invalidation triggers automatic re-fetch
- User state updates after Firestore write completes
- Multiple quiz saves queued (not parallel) - Firebase auto-handles

## Need Help?

If quiz scores still aren't saving after checking above:

1. Share the full console output from the emoji logs
2. Check Firebase Firestore Rules:
   ```
   match /users/{uid} {
     allow read, write: if request.auth.uid == uid;
   }
   ```
3. Verify user is authenticated (`user.uid` in logs should not be undefined)

## Technical Details

### Quiz Flow
```
QuizView.tsx (UI)
    ↓
submits score to onComplete callback
    ↓
CourseDetail.tsx handleQuizResult(score)
    ↓
updateCourseProgress(completedClasses, score)
    ↓
updateDoc(usersRef(uid), { 'progress.courseId': updatedProgress })
    ↓
Firestore saves
    ↓
React Query cache invalidated
    ↓
UI re-renders with new progress
```

### Data Structure Saved to Firestore
```json
{
  "uid": "user123",
  "progress": {
    "python-zero-hero": {
      "completedClasses": 2,
      "totalClasses": 10,
      "quizScore": 85,
      "completed": false,
      "certificateDate": null
    }
  }
}
```
