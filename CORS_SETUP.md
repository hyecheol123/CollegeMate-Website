# CORS Setup for University API

## Problem
The University of Wisconsin API (`https://public.enroll.wisc.edu/api/search/v1/aggregate`) doesn't allow CORS requests from localhost during development, resulting in blocked fetch requests.

## Solution
We've implemented a two-part solution:

### 1. Webpack Dev Server Proxy
Added proxy configuration in `webpack.dev.cjs` to route API requests through the dev server:

```javascript
proxy: [
  {
    context: ['/api'],
    target: 'https://public.enroll.wisc.edu',
    changeOrigin: true,
    secure: true,
    logLevel: 'debug',
  },
],
```

### 2. Fallback Mock Data
If the API is still unavailable (even with proxy), the application falls back to mock data in development mode:

- **Development**: Uses proxy first, falls back to mock data if proxy fails
- **Production**: Makes direct API calls (assumes production environment allows CORS)

## Files Modified
- `webpack.dev.cjs` - Added proxy configuration
- `src/api/termsApi.ts` - Added environment-based URL switching and fallback logic
- `src/data/Miscellaneous/mockTermsData.ts` - Created mock data for fallback

## Usage
1. **Start dev server**: `npm run dev`
2. **API calls**: Will automatically route through proxy in development
3. **Fallback**: If API is down, mock data ensures functionality continues

This setup ensures the term selector works reliably in both development and production environments.