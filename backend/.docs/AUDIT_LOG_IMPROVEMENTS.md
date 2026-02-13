# Audit Log System Improvements

## Overview

The audit log system has been significantly enhanced to properly track both **developer actions** and **end-user actions** within projects. This fixes the previous bug where user-related events would fail validation due to missing `developerId`.

---

## Key Changes

### 1. **Flexible Schema** (`auditLog.model.js`)

#### Added Fields:

- **`developerId`**: Now **optional** (previously required)
  - Automatically resolved from `projectId` if missing
  - Allows system-level events without a specific developer

- **`actor`**: New field to track who performed the action

  ```javascript
  actor: {
    type: String,        // "developer" | "user" | "system"
    id: String,          // ObjectId or identifier
    name: String         // Human-readable name (email, username)
  }
  ```

- **`category`**: Extended to include `"system"`
  - Categories: `"project"`, `"security"`, `"user"`, `"api"`, `"system"`

---

### 2. **Smart Audit Logger** (`utils/auditLogger.js`)

#### Auto-Resolution Logic:

```javascript
// If developerId is missing, fetch from project
if (!developerId && projectId) {
  const project = await Project.findById(projectId).select("developer");
  finalDeveloperId = project.developer;
}
```

#### Actor Auto-Detection:

```javascript
actor: actor || {
  type: finalDeveloperId ? "developer" : "system",
  id: finalDeveloperId ? finalDeveloperId.toString() : "system",
};
```

#### Conditional Notifications:

- Notifications are **only created** if a `developerId` exists
- Prevents errors when logging user-only events

---

### 3. **Enhanced Event Tracking**

#### User Registration (`sdk.service.js`)

```javascript
await logEvent({
  developerId: project.developer,
  projectId: project._id,
  action: "USER_REGISTERED",
  description: `New local user (${email}) registered. OTP sent.`,
  category: "user",
  actor: {
    type: "user",
    id: user._id.toString(),
    name: user.username || email,
  },
  metadata: { ...reqInfo, resourceId: user._id },
});
```

#### Email Verification

```javascript
await logEvent({
  projectId: user.projectId,
  action: "USER_VERIFIED",
  description: `User (${user.email}) successfully verified their email via OTP.`,
  category: "user",
  actor: {
    type: "user",
    id: user._id.toString(),
    name: user.email,
  },
  metadata: { resourceId: user._id },
});
```

#### Token Refresh (`sdk.controller.js`)

```javascript
await logEvent({
  projectId: session.projectId,
  action: "TOKEN_REFRESHED",
  description: `Session tokens refreshed for user (${session.endUserId.email}).`,
  category: "security",
  actor: {
    type: "user",
    id: session.endUserId._id.toString(),
    name: session.endUserId.email,
  },
  metadata: {
    ip: req.ip,
    userAgent: req.headers["user-agent"],
    resourceId: session._id,
  },
});
```

---

### 4. **Advanced Filtering** (`auditLog.service.js`)

#### Service Methods:

```javascript
async getProjectLogs(projectId, filters = {}, limit = 50) {
  const query = { projectId };
  if (filters.category) query.category = filters.category;
  if (filters.actorType) query["actor.type"] = filters.actorType;

  return await AuditLog.find(query)
    .sort({ createdAt: -1 })
    .limit(limit);
}
```

#### API Usage:

```bash
# Get all logs for a project
GET /api/v1/audit-logs/project/:projectId

# Filter by category
GET /api/v1/audit-logs/project/:projectId?category=security

# Filter by actor type
GET /api/v1/audit-logs/project/:projectId?actorType=user

# Combine filters
GET /api/v1/audit-logs/project/:projectId?category=user&actorType=user
```

---

## Benefits

### ✅ **No More Validation Errors**

- User events no longer fail with "developerId is required"
- System can log events even without a specific developer context

### ✅ **Better Traceability**

- Clear distinction between developer actions and user actions
- `actor` field provides immediate context on who did what

### ✅ **Flexible Querying**

- Filter logs by category (`security`, `user`, `project`, etc.)
- Filter by actor type (`developer`, `user`, `system`)
- Combine filters for precise audit trails

### ✅ **Automatic Context**

- `developerId` auto-resolved from project when missing
- Notifications intelligently created only when relevant

---

## Example Log Entries

### Developer Action:

```json
{
  "developerId": "507f1f77bcf86cd799439011",
  "projectId": "507f191e810c19729de860ea",
  "action": "PROJECT_CREATED",
  "description": "New project 'MyApp' created",
  "category": "project",
  "actor": {
    "type": "developer",
    "id": "507f1f77bcf86cd799439011",
    "name": "john@example.com"
  },
  "metadata": {
    "ip": "192.168.1.1",
    "userAgent": "Mozilla/5.0..."
  }
}
```

### User Action:

```json
{
  "developerId": "507f1f77bcf86cd799439011", // Auto-resolved from project
  "projectId": "507f191e810c19729de860ea",
  "action": "USER_REGISTERED",
  "description": "New local user (alice@example.com) registered. OTP sent.",
  "category": "user",
  "actor": {
    "type": "user",
    "id": "507f1f77bcf86cd799439012",
    "name": "alice@example.com"
  },
  "metadata": {
    "ip": "203.0.113.42",
    "userAgent": "Mozilla/5.0...",
    "resourceId": "507f1f77bcf86cd799439012"
  }
}
```

### System Action:

```json
{
  "projectId": "507f191e810c19729de860ea",
  "action": "AUTO_CLEANUP",
  "description": "Expired sessions automatically cleaned",
  "category": "system",
  "actor": {
    "type": "system",
    "id": "system"
  },
  "metadata": {
    "details": { "cleaned": 42 }
  }
}
```

---

## Migration Notes

### Existing Logs

- Old logs without `actor` field will still work
- No database migration needed (Mongoose handles missing fields gracefully)

### Backward Compatibility

- All existing `logEvent()` calls continue to work
- New `actor` parameter is optional
- Auto-resolution ensures no breaking changes

---

## Future Enhancements

### Potential Additions:

1. **Pagination**: Add offset/page support for large log sets
2. **Date Range Filtering**: Filter by `createdAt` range
3. **Full-Text Search**: Search in descriptions
4. **Export**: CSV/JSON export for compliance
5. **Retention Policies**: Auto-delete old logs after X days
6. **Real-time Streaming**: WebSocket feed of live events

---

## Testing Checklist

- [x] User registration creates log with user actor
- [x] User verification creates log with user actor
- [x] Token refresh creates log with user actor
- [x] Developer actions still create logs correctly
- [x] Logs without developerId auto-resolve from project
- [x] Filtering by category works
- [x] Filtering by actorType works
- [x] No validation errors on user events
- [x] Notifications only created when developerId exists

---

## Related Files

- `src/models/auditLog.model.js` - Schema definition
- `src/utils/auditLogger.js` - Core logging utility
- `src/services/core/auditLog.service.js` - Query service
- `src/controllers/auditLog.controller.js` - API endpoints
- `src/services/auth/sdk.service.js` - User event logging
- `src/controllers/sdk.controller.js` - Token refresh logging
