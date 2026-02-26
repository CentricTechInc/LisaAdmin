# Support Chat – Firestore Spec for App & Admin Panel

This document describes the **exact Firestore collection/document hierarchy and field schemas** used by the Lisa Beauty Salon **Flutter app** for support chat. Use the same structure in your **Next.js admin panel** so both sides stay in sync.

---

## 1. Constants (use these everywhere)

| Constant | Value | Description |
|----------|--------|-------------|
| **Collection name** | `support_chats` | Top-level collection for all support threads. |
| **Messages subcollection** | `messages` | Subcollection under each thread doc; holds the chat messages. |
| **Support participant ID** | `support` | Fixed ID for the support team. When the **user** sends a message: `senderId = userId`, `receiverId = "support"`. When **support** replies: `senderId = "support"`, `receiverId = userId`. |

---

## 2. Firestore hierarchy

```
Firestore root
└── support_chats                    (collection)
    └── {userId}                     (document ID = app user's ID, string)
        ├── (thread fields: userId, createdAt, userDisplayName, ...)
        └── messages                 (subcollection)
            └── {messageId}          (document ID = auto-generated)
                └── (message fields: senderId, receiverId, text, createdAt, ...)
```

- **One document per app user** in `support_chats`. Document ID = that user’s `userId` (string, e.g. from your backend auth).
- **One `messages` subcollection per thread.** Each message is a document with auto-generated ID.

---

## 3. Thread document schema (`support_chats/{userId}`)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `userId` | string | Yes | Same as the document ID; the app user’s ID. |
| `createdAt` | Timestamp | Yes | When the thread was first created (server timestamp). |
| `userDisplayName` | string | No | Display name of the user (set when thread is created from app). |
| `userPhotoUrl` | string | No | Profile photo URL of the user (set when thread is created from app). |
| `lastMessageText` | string | No | Last message body (truncated to 100 chars in app). Updated on every new message. |
| `lastMessageAt` | Timestamp | No | Time of the last message. Updated on every new message. |
| `lastMessageSenderId` | string | No | `userId` or `"support"`. Who sent the last message. |

**Example document** (for user `"42"`):

```json
{
  "userId": "42",
  "createdAt": "<Timestamp>",
  "userDisplayName": "John Doe",
  "userPhotoUrl": "https://...",
  "lastMessageText": "Hello, I need help with my booking",
  "lastMessageAt": "<Timestamp>",
  "lastMessageSenderId": "42"
}
```

---

## 4. Message document schema (`support_chats/{userId}/messages/{messageId}`)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `chatId` | string | Yes | Same as the parent thread document ID (`userId`). |
| `senderId` | string | Yes | Either the app **userId** (user sent) or **`"support"`** (support replied). |
| `receiverId` | string | Yes | Either **`"support"`** (user sent) or the **userId** (support replied). |
| `text` | string | Yes | Message body. |
| `createdAt` | Timestamp | Yes | When the message was sent (use server timestamp). |
| `readAt` | Timestamp \| null | No | When the message was read; `null` if unread. |
| `imageUrl` | string | No | Optional image URL (if you add image support). |

**Example – user sent:**

```json
{
  "chatId": "42",
  "senderId": "42",
  "receiverId": "support",
  "text": "I have a question about my appointment",
  "createdAt": "<Timestamp>",
  "readAt": null
}
```

**Example – support replied:**

```json
{
  "chatId": "42",
  "senderId": "support",
  "receiverId": "42",
  "text": "Hi! How can we help?",
  "createdAt": "<Timestamp>",
  "readAt": null
}
```

---

## 5. App behavior (Flutter) – for reference

- **Opening support chat:** App ensures a thread exists: if `support_chats/{userId}` does not exist, it creates it with `userId`, `createdAt`, and optionally `userDisplayName`, `userPhotoUrl`.
- **Listing messages:** App subscribes to  
  `support_chats/{userId}/messages`  
  ordered by `createdAt` **ascending** (oldest first).
- **User sends message:** App writes a new doc in `messages` with `senderId = userId`, `receiverId = "support"`, then updates the thread doc with `lastMessageText`, `lastMessageAt`, `lastMessageSenderId`.

---

## 6. Admin panel (Next.js) – operations to implement

Use the **same** collection names, document IDs, and field names.

### 6.1 List all support threads

- **Path:** `support_chats` (collection).
- **Query:** Order by `lastMessageAt` descending so the most recent thread is first.
- **Read:** Document ID = `userId`; use thread fields for list row (e.g. `userDisplayName`, `userPhotoUrl`, `lastMessageText`, `lastMessageAt`, `lastMessageSenderId`).

**Firestore query (pseudo):**

```
collection('support_chats')
  .orderBy('lastMessageAt', 'desc')
```

(Ensure a Firestore composite index exists for `lastMessageAt` if required.)

### 6.2 Open a thread (stream messages for one user)

- **Path:** `support_chats/{userId}/messages`.
- **Query:** Order by `createdAt` ascending (same as app).
- Use a real-time listener (e.g. `onSnapshot`) so new messages appear for both admin and user.

**Firestore query (pseudo):**

```
collection('support_chats').doc(userId).collection('messages')
  .orderBy('createdAt', 'asc')
```

### 6.3 Send a reply as support

- **Document:** Add a new document to `support_chats/{userId}/messages` (auto-generated ID).
- **Fields:**
  - `chatId`: `userId`
  - `senderId`: `"support"`
  - `receiverId`: `userId`
  - `text`: reply text
  - `createdAt`: server timestamp
  - `readAt`: `null`
  - (optional) `imageUrl` if you support images.
- **Thread update:** Update `support_chats/{userId}` with:
  - `lastMessageText`: reply text (truncate to 100 chars if you want consistency with app)
  - `lastMessageAt`: server timestamp
  - `lastMessageSenderId`: `"support"`

Do both the message add and the thread update (in a batch or two writes) so the app’s thread list and admin’s thread list stay consistent.

### 6.4 Optional: Mark messages as read

- When support views a thread, you can set `readAt` to server timestamp on messages where `receiverId === "support"` (or where `senderId === userId`). App can use `readAt` for read indicators if you implement that later.

---

## 7. Firestore security rules (conceptual)

- **App (user):**
  - Allow read/write on `support_chats/{userId}` and `support_chats/{userId}/messages` only when `request.auth.uid == userId` (or your auth’s equivalent).
- **Admin:**
  - Use Firebase Admin SDK (service account) in Next.js backend, which bypasses client rules, **or**
  - If admin uses client SDK with Firebase Auth, add a rule that allows read/write for an “admin” role or specific UIDs (e.g. `request.auth.token.role == 'admin'`).

Example (adjust to your auth):

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /support_chats/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      match /messages/{messageId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
}
```

Admin panel using **Admin SDK** from a secure Next.js API route does not use these client rules.

---

## 8. Next.js implementation checklist

- [ ] **Firebase:** Use same Firebase project as the app; add Firebase Admin SDK (or client SDK) in Next.js.
- [ ] **Constants:** Define `support_chats`, `messages`, and `supportId = "support"` in a shared config.
- [ ] **List page:** Query `support_chats` ordered by `lastMessageAt` desc; show `userDisplayName`, `lastMessageText`, `lastMessageAt`; link to thread by `userId`.
- [ ] **Thread page:** Route e.g. `/support/chat/[userId]`. Subscribe to `support_chats/{userId}/messages` ordered by `createdAt` asc; render bubbles (user vs support by `senderId === "support"`).
- [ ] **Send reply:** Add doc to `support_chats/{userId}/messages` with `senderId: "support"`, `receiverId: userId`, then update `support_chats/{userId}` with `lastMessageText`, `lastMessageAt`, `lastMessageSenderId`.
- [ ] **Timestamps:** Use Firestore server timestamp for `createdAt`, `lastMessageAt`, and `readAt` so app and admin stay in sync.
- [ ] **Indexes:** Create composite index on `support_chats` for `lastMessageAt` (desc) if Firestore prompts for it.

---

## 9. Quick reference – paths and IDs

| Purpose | Path | Key fields / IDs |
|--------|------|-------------------|
| List threads | `support_chats` | Doc ID = `userId`; sort by `lastMessageAt` desc. |
| Thread metadata | `support_chats/{userId}` | `userId`, `userDisplayName`, `userPhotoUrl`, `lastMessageText`, `lastMessageAt`, `lastMessageSenderId`. |
| Messages in thread | `support_chats/{userId}/messages` | Each doc: `senderId`, `receiverId`, `text`, `createdAt`, `readAt`; sort by `createdAt` asc. |
| User sent | In `messages` | `senderId = userId`, `receiverId = "support"`. |
| Support replied | In `messages` | `senderId = "support"`, `receiverId = userId`. |

Use this spec as the single source of truth for collection names, document structure, and field types when implementing the support chat on the Next.js admin panel.

---

## 10. Copy-paste prompt for Next.js admin implementation

You can give the following block to your team or an AI to implement the admin support chat:

```
Implement a Support Chat feature in our Next.js admin panel using Firebase Firestore. Use this exact hierarchy and schema so it matches our Flutter app.

**Firestore structure:**
- Collection: `support_chats`. Each document ID is the app user's ID (string).
- Thread document fields: userId (string), createdAt (Timestamp), userDisplayName (string, optional), userPhotoUrl (string, optional), lastMessageText (string), lastMessageAt (Timestamp), lastMessageSenderId (string).
- Subcollection under each thread doc: `messages`. Each message doc has auto-generated ID.
- Message document fields: chatId (string, same as parent doc ID), senderId (string), receiverId (string), text (string), createdAt (Timestamp), readAt (Timestamp or null), imageUrl (string, optional).
- Support participant ID is the literal string: "support". When the user sends: senderId = userId, receiverId = "support". When support replies: senderId = "support", receiverId = userId.

**Admin panel requirements:**
1. List page: Query Firestore collection `support_chats` ordered by `lastMessageAt` descending. Display each thread with userDisplayName (or userId), lastMessageText, lastMessageAt. Link to thread page with userId (e.g. /support/chat/[userId]).
2. Thread page: Subscribe to real-time `support_chats/[userId]/messages` ordered by `createdAt` ascending. Show messages in order; messages where senderId === "support" are support replies (show on one side), others are user messages (show on other side).
3. Send reply: When admin sends a message, (a) add a new document to `support_chats/[userId]/messages` with: chatId = userId, senderId = "support", receiverId = userId, text = reply text, createdAt = serverTimestamp(), readAt = null; (b) update document `support_chats/[userId]` with lastMessageText (truncate to 100 chars), lastMessageAt = serverTimestamp(), lastMessageSenderId = "support". Use a batch or two writes.
4. Use Firebase Admin SDK in Next.js API routes for security, or Firebase client SDK with auth; ensure Firestore rules allow admin read/write to support_chats.
5. Create Firestore composite index on collection support_chats for lastMessageAt descending if required by the console.
```

**Reference:** See `docs/SUPPORT_CHAT_FIRESTORE_SPEC.md` in the repo for full field types, examples, and security rules.
