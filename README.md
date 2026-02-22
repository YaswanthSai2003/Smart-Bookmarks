# MyBookmarks 

MyBookmarks is a simple, clean, and secure bookmark manager built with Next.js and Supabase.  
It allows users to sign in with Google, save bookmarks, organize them using categories and tags, mark favorites, and see real-time updates across tabs.

This project was built as part of a technical assignment, focusing on **authentication, user privacy, real-time updates, and clean UI/UX**.

---

## Live Demo

- **Live App (Vercel):** https://smart-bookmarks-umber.vercel.app/
---

## Features

- Google OAuth authentication
- Private bookmarks per user
- Add, edit, delete bookmarks
- Mark bookmarks as favorites
- Category-based filtering (All, Favorites, Work, Learning, Personal)
- Tag-based filtering with color indicators
- Real-time sync across browser tabs
- Duplicate bookmark prevention
- Clean, modern UI with a single-scroll layout

---

## Tech Stack

- **Frontend:** Next.js (App Router), React, TypeScript
- **Styling:** Tailwind CSS
- **Backend & Auth:** Supabase
- **Database:** PostgreSQL (Supabase)
- **Realtime:** Supabase Realtime
- **Deployment:** Vercel

---

## Authentication & User Privacy

- Authentication is handled using **Supabase Google OAuth**
- Each bookmark is stored with a `user_id`
- Database queries are always scoped to the authenticated user
- Users **cannot access or see other users’ bookmarks**
- Supabase Row Level Security (RLS) ensures data isolation

---

## Real-Time Updates

- Supabase Realtime listens to database changes on the `bookmarks` table
- When a bookmark is added, edited, or deleted:
  - The UI updates instantly
  - Changes are reflected across multiple open tabs
- Optimistic UI updates are used for better user experience

---

## Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/YaswanthSai2003/my-bookmarks.git
cd my-bookmarks
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment Variables

Create a `.env.local` file in the root directory:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 4. Run the app

```bash
npm run dev
```

App runs on:

```
http://localhost:3000
```

---

## Deployment (Vercel)

1. Push project to GitHub  
2. Import repository into Vercel  
3. Add environment variables in Vercel settings  
4. Deploy  

---

## Problems Faced & How I Solved Them

### 1️⃣ Duplicate Bookmarks

**Problem:**  
Users could add the same URL multiple times.

**Solution:**
- Added a unique constraint at the database level  
- Added frontend duplicate checks  
- Displayed user-friendly toast notifications when duplicates are detected  

---

### 2️⃣ Favorites Resetting on Refresh

**Problem:**  
Favorites appeared to disappear after page reload.

**Solution:**
- Ensured `is_favorite` is stored in the database  
- Reloaded state from Supabase on initial fetch  
- Removed incorrect `.single()` calls after updates  

---

### 3️⃣ Multiple Scrollbars

**Problem:**  
Both the page and content area were scrolling, causing poor UX.

**Solution:**
- Fixed layout structure  
- Made sidebar and header fixed  
- Allowed scrolling only inside the main content section  

---

### 4️⃣ Infinite Re-render / Update Depth Errors

**Problem:**  
Passing callbacks through `useEffect` caused maximum update depth errors.

**Solution:**
- Removed unnecessary callback setters  
- Simplified component responsibilities  
- Ensured stable dependencies in `useEffect`  

---

### 5️⃣ Realtime Sync Issues

**Problem:**  
Realtime updates didn’t reflect consistently across tabs.

**Solution:**
- Properly set Supabase Realtime auth tokens  
- Scoped realtime channels to the current user  
- Handled delete events separately to avoid refetch loops  

---

### 6️⃣ Tag Explosion & Inconsistent UX

**Problem:**  
Allowing free-text tags caused clutter and inconsistency.

**Solution:**
- Introduced predefined tags  
- Disabled arbitrary tag creation  
- Used consistent color indicators for tags  

---

## Design Decisions

- Minimal, distraction-free UI  
- Sidebar for navigation and filters  
- Bookmark icon used as favicon and app branding  
- Toasts for feedback (success/errors)  
- Modal confirmation for destructive actions (delete)  

---

## Future Improvements

- Folder-based organization  
- Drag & drop bookmarks  
- Full-text search  
- Browser extension  
- Import/export bookmarks  


