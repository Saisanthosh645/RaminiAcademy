# Course Configuration Management

This file centralizes all dynamic course data to make updates easy and avoid scattered hardcoded values.

## How to Update Zoom Links

1. **Open** `src/config/courseConfig.ts`
2. **Find** the `zoomLinks` object
3. **Update** the Zoom link for the specific course:

```typescript
zoomLinks: {
  "python-zero-hero": "https://zoom.us/j/YOUR_NEW_LINK_HERE",
  "web-dev-basics": "https://zoom.us/j/YOUR_NEW_LINK_HERE",
  "dsa-python": "https://zoom.us/j/YOUR_NEW_LINK_HERE",
  // ... other courses
}
```

4. **Save** the file
5. **Test** by running the app: `npm run dev`
6. **Commit** and push: `git add . && git commit -m "Updated Zoom links" && git push`

## How to Update Course Capacities

1. **Open** `src/config/courseConfig.ts`
2. **Find** the `capacities` object
3. **Update** the capacity for courses:

```typescript
capacities: {
  "web-dev-basics": 75, // Increased from 50
  "dsa-python": 60,     // Increased from 40
}
```

## How to Update Enrollment Counts

1. **Find** the `enrolledCounts` object
2. **Update** current enrollment numbers regularly

## How to Update Default Times

1. **Find** the `defaultTimes` object
2. **Update** meeting times if they change

## Benefits

- ✅ **Single source of truth** - All dynamic data in one place
- ✅ **Easy updates** - No need to search through multiple files
- ✅ **Consistent data** - All references use the same config
- ✅ **Version control** - Changes are tracked in git
- ✅ **Type safety** - TypeScript ensures correct usage

## Future Improvements

Consider moving this to Firebase/Firestore for real-time updates without code deployments.