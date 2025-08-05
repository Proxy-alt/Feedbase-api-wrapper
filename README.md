# Feedbase Authorization System - Complete Guide

## 🔐 **Authorization Features Added:**

### **👥 Admin Controls**
- **Create Announcements**: Authorized admins can create feature announcements
- **Delete Announcements**: Remove existing announcements from the system
- **Moderate Feedback**: Hide or delete inappropriate feedback
- **User Management**: Ban/unban users and manage admin privileges

### **🚫 Banned Users**
- **Access Blocked**: Banned users see a blocked message instead of the widget
- **No Interactions**: Cannot submit feedback, vote, or use any widget features
- **Persistent Blocking**: Stored across sessions and devices

### **📁 File Structure**
```
project/
├── lib/
│   └── feedbase-auth.js       # Authorization configuration
├── feedbase-widget.js         # Main widget with auth integration
└── .env.local                 # Environment variables
```

## 🚀 **Setup Instructions:**

### **Step 1: Create Authorization Config**
Create `/lib/feedbase-auth.js`:

```javascript
// lib/feedbase-auth.js
export const AUTHORIZED_ADMINS = [
  'user-admin-123',
  'user-owner-456', 
  'user-moderator-789',
  // Add admin user IDs here
];

export const BANNED_USERS = [
  'user-banned-001',
  'user-spam-002',
  // Add banned user IDs here
];

// Role-based permissions
export const USER_ROLES = {
  'user-admin-123': 'SUPER_ADMIN',
  'user-owner-456': 'SUPER_ADMIN', 
  'user-moderator-789': 'MODERATOR',
};

export const PERMISSIONS = {
  SUPER_ADMIN: [
    'create_announcement',
    'delete_announcement', 
    'edit_announcement',
    'moderate_feedback',
    'delete_feedback',
    'ban_user',
    'manage_categories'
  ],
  
  ADMIN: [
    'create_announcement',
    'delete_announcement',
    'moderate_feedback',
    'delete_feedback'
  ],
  
  MODERATOR: [
    'moderate_feedback',
    'delete_feedback'
  ]
};
```

### **Step 2: Update Environment Variables**
Add to your `.env.local`:

```bash
# Existing Feedbase variables
FEEDBASE_API_KEY=your_feedbase_api_key
NEXT_PUBLIC_FEEDBASE_PROJECT_ID=your_project_id

# Supabase (for user authentication)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Authorization settings (optional)
FEEDBASE_AUTH_CONFIG_PATH=/lib/feedbase-auth.js
FEEDBASE_ENABLE_ADMIN_PANEL=true
```

### **Step 3: Integration Options**

#### **Option A: Single Line Integration**
```html
<script src="https://raw.githubusercontent.com/yourusername/repo/main/feedbase-widget.js"></script>
<div data-feedbase-auto-init 
     data-feedbase-project-id="your-project-id"
     data-feedbase-api-key="your-api-key"
     data-feedbase-supabase-url="your-supabase-url"
     data-feedbase-supabase-key="your-supabase-key">
</div>
```

#### **Option B: Next.js Integration**
```javascript
// pages/_app.js or app/layout.js
import { useEffect } from 'react';

export default function MyApp({ Component, pageProps }) {
  useEffect(() => {
    const initWidget = async () => {
      const { initFeedbaseWidget } = await import('/lib/feedbase-widget.js');
      
      window.feedbaseWidget = initFeedbaseWidget({
        projectId: process.env.NEXT_PUBLIC_FEEDBASE_PROJECT_ID,
        apiKey: process.env.FEEDBASE_API_KEY,
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
        supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        newFeatures: [] // Will be populated dynamically
      });
    };

    initWidget();

    return () => {
      if (window.feedbaseWidget) {
        window.feedbaseWidget.destroy();
      }
    };
  }, []);

  return <Component {...pageProps} />;
}
```

#### **Option C: React Component**
```jsx
// components/FeedbaseWidget.jsx
import { useEffect, useState } from 'react';
import { useUser } from '@supabase/auth-helpers-react';

export function FeedbaseWidgetWrapper() {
  const user = useUser();
  const [widget, setWidget] = useState(null);

  useEffect(() => {
    if (!user) return;

    const initWidget = async () => {
      const { initFeedbaseWidget } = await import('/lib/feedbase-widget.js');
      
      const widgetInstance = initFeedbaseWidget({
        projectId: process.env.NEXT_PUBLIC_FEEDBASE_PROJECT_ID,
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
        supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      });
      
      setWidget(widgetInstance);
    };

    initWidget();

    return () => {
      if (widget) {
        widget.destroy();
      }
    };
  }, [user]);

  return null; // Widget renders itself
}
```

## 🛠 **Admin Panel Features:**

### **📢 Create Announcements**
Admins see an additional "Admin" tab with:
- **Title & Description**: Rich text announcement content
- **Image Upload**: Optional feature preview image
- **Type Selection**: Feature, Update, Maintenance, General
- **Instant Publishing**: Announcements appear immediately

### **🗑 Delete Announcements**
- **One-click deletion** with confirmation
- **Immediate removal** from all users
- **Audit trail** (logged to console/backend)

### **⚖️ Content Moderation**
- **Moderate button** on each feedback item (admins only)
- **Hide or Delete** inappropriate content
- **Bulk actions** for multiple items
- **Moderation reasons** tracking

### **👤 User Management**
- **Ban Users**: Instantly block access
- **Add Admins**: Grant administrative privileges  
- **Live Lists**: View current admins and banned users
- **Role Management**: Different permission levels

## 🔒 **Security Features:**

### **Client-Side Checks**
```javascript
// Authorization is checked before every action
if (!Auth.canCreateAnnouncement(user.id)) {
  showToast('Unauthorized action', 'error');
  return;
}
```

### **Server-Side Integration**
For production, integrate with your backend:

```javascript
// Example API middleware
export async function checkAuth(req, res, next) {
  const userId = req.user?.id;
  const action = req.body.action;
  
  // Load auth config from database
  const authConfig = await db.getAuthConfig();
  
  if (authConfig.bannedUsers.includes(userId)) {
    return res.status(403).json({ error: 'User banned' });
  }
  
  if (action === 'create_announcement' && 
      !authConfig.admins.includes(userId)) {
    return res.status(403).json({ error: 'Insufficient permissions' });
  }
  
  next();
}
```

### **Dynamic Updates**
```javascript
// Runtime user management
const widget = window.feedbaseWidget;

// Ban a user
widget.banUser('problematic-user-123');

// Add new admin
widget.addAdmin('new-admin-456');

// Remove admin privileges
widget.removeAdmin('former-admin-789');
```

## 📊 **User Experience:**

### **For Regular Users:**
- ✅ Normal widget functionality
- ✅ Submit and vote on feedback
- ✅ View announcements
- ❌ No admin controls visible

### **For Admins:**
- ✅ All regular user features
- ✅ **Admin tab** with management tools
- ✅ **Moderate button** on feedback items
- ✅ **Create/delete announcements**
- ✅ **User management panel**

### **For Banned Users:**
- ❌ **Blocked message** instead of widget
- ❌ Cannot interact with any features
- ❌ No access to feedback or announcements
- ℹ️ **Contact support** message displayed

## 🔧 **Advanced Configuration:**

### **Custom Permissions**
```javascript
// lib/feedbase-auth.js
export const CUSTOM_PERMISSIONS = {
  COMMUNITY_MANAGER: [
    'moderate_feedback',
    'create_announcement',
    'manage_categories'
  ],
  
  BETA_TESTER: [
    'view_beta_features',
    'early_access'
  ]
};
```

### **Dynamic Loading**
```javascript
// Load auth config from API
const authConfig = await fetch('/api/feedbase-auth').then(r => r.json());
Auth.importConfig(authConfig);
```

### **Webhook Integration**
```javascript
// Send moderation events to webhook
const moderationEvent = {
  type: 'feedback_moderated',
  feedbackId: 'feedback-123',
  action: 'hide',
  moderatorId: 'admin-456',
  reason: 'Inappropriate content',
  timestamp: new Date().toISOString()
};

await fetch(process.env.FEEDBASE_WEBHOOK_URL, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(moderationEvent)
});
```

## 🚨 **Important Security Notes:**

1. **Server-Side Validation**: Always validate permissions on your backend
2. **Secure Storage**: Store admin/banned lists in a secure database
3. **Audit Logging**: Log all administrative actions
4. **Rate Limiting**: Implement rate limits for sensitive operations
5. **HTTPS Only**: Always use HTTPS in production

## 📱 **Mobile Considerations:**

- **Responsive Admin Panel**: Works on all screen sizes
- **Touch-Friendly**: Large buttons and intuitive gestures
- **Swipe Actions**: Swipe to moderate (coming soon)
- **Offline Support**: Cache auth config locally

## 🔄 **Migration Guide:**

### **From Basic Widget:**
1. Add `/lib/feedbase-auth.js` file
2. Update widget initialization
3. Add admin user IDs to config
4. Test admin panel access

### **From Custom Auth:**
1. Export existing user lists to new format
2. Map custom roles to standard permissions
3. Update API endpoints if needed
4. Migrate webhook configurations

## 🆘 **Troubleshooting:**

### **Common Issues:**

**Admin panel not showing:**
- Check user ID is in `AUTHORIZED_ADMINS` array
- Verify Supabase authentication is working
- Check browser console for errors

**Banned users still accessing:**
- Ensure user ID matches exactly in `BANNED_USERS`
- Check for cached authentication data
- Verify auth config is loading properly

**Permissions not working:**
- Validate role assignments in `USER_ROLES`
- Check permission definitions in `PERMISSIONS`
- Ensure backend validation matches frontend

### **Debug Mode:**
```javascript
// Enable debug logging
window.FEEDBASE_DEBUG = true;

// Check current auth state
console.log('Auth Config:', Auth.exportConfig());
console.log('Current User:', widget.state.user);
console.log('Is Admin:', Auth.isAdmin(widget.state.user?.id));
```

This authorization system provides enterprise-grade user management while maintaining the simplicity of single-line integration. Perfect for SaaS applications that need granular control over who can create announcements and moderate content!
