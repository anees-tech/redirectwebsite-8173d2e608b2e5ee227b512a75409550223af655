# Campaign Flow Documentation

## 🔄 Auto-Redirect Campaign System

### How It Works:

#### 1. **Home Page (/)** 
- **On Load**: Checks localStorage for active campaign
  - If campaign active → Auto-redirects to `/redirect`
  - If no campaign → Shows popup after 2 seconds

- **Popup Actions**:
  - Click "Claim Your Offer Now!" → Starts campaign
  - Click X (close button) → Also starts campaign
  - Both actions redirect to `/redirect?utm_source=popup&campaign=ad1`

#### 2. **Redirect Page (/redirect)**
- Manages the rotation through all offer pages
- Uses localStorage to track:
  - `redirector_rotation_index` - Current position in offer cycle
  - `redirector_query_params` - Campaign tracking parameters

- **Flow**:
  - Reads rotation index from localStorage
  - Redirects to next offer page (offer1, offer2, offer3, etc.)
  - Increments index for next visit
  - When all offers complete:
    - If `CONTINUOUS_LOOP = true` → Resets index to 0 and redirects to `/`
    - If `CONTINUOUS_LOOP = false` → Ends campaign and redirects to final URL

#### 3. **Offer Pages (/offer1, /offer2, etc.)**
- Display for 3 seconds
- **Auto-redirect** to `/redirect` (no user interaction needed!)
- Pass along all query parameters

### 🔁 The Loop:

```
User visits Home (/) 
  ↓
Popup appears (2 sec delay)
  ↓
User clicks popup or X button
  ↓
Redirect page (/redirect) 
  ↓
Offer 1 (3 sec) → auto-redirect
  ↓
Redirect page (/redirect)
  ↓
Offer 2 (3 sec) → auto-redirect
  ↓
Redirect page (/redirect)
  ↓
Offer 3 (3 sec) → auto-redirect
  ↓
Redirect page (/redirect)
  ↓
Reset index → Home page (/)
  ↓
Home detects active campaign → Redirect page
  ↓
Cycle repeats! ♾️
```

### 🎛️ Configuration:

**In `/redirect/page.tsx`:**

```typescript
const CONFIG = {
  OFFERS: ['/offer1', '/offer2', '/offer3'],  // Add more offers here
  CONTINUOUS_LOOP: true,                       // Set to false to end campaign
  FINAL_REDIRECT_URL: '/blankPage',           // Where to go when campaign ends
};
```

**To add more offers:**
1. Add page path to `CONFIG.OFFERS` array
2. Create corresponding page component (copy from offer1)
3. Update auto-redirect timer if needed (currently 3 seconds)

### ⚙️ Key Features:

✅ **No Click Required**: Offers auto-redirect after 3 seconds  
✅ **Continuous Loop**: Campaign keeps running until manually stopped  
✅ **Parameter Tracking**: All UTM parameters persist through the cycle  
✅ **Popup on Both Actions**: Click button OR close button starts campaign  
✅ **Smart Detection**: Home page automatically continues active campaigns  

### 🛑 To Stop a Campaign:

Set `CONTINUOUS_LOOP: false` in the config, OR clear localStorage:
```javascript
localStorage.removeItem('redirector_rotation_index');
localStorage.removeItem('redirector_query_params');
```

### 📊 Tracking:

All query parameters are preserved throughout the cycle:
- `utm_source` - Where user came from (popup, popup_close, etc.)
- `campaign` - Campaign identifier
- Any other custom parameters you add
