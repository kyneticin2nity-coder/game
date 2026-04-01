# **Blueprint: Time Defender**

## **1. Project Overview**
"Time Defender" is a productivity-based strategy game that visualizes daily time management as a battlefield defense. Users transform their to-do lists into tactical challenges.

## **2. Design & Aesthetics**
- **Vibe:** Cyber-Tactical / Military Dashboard.
- **Color Palette:** 
  - Background: `#0a0a0c` (Deep Dark)
  - Primary (Allies): `#00f2ff` (Neon Cyan)
  - Secondary (Enemies): `#ff00d4` (Neon Magenta)
- **Visual Effects:** 
  - CSS Glow filters for neon elements.
  - SVG Noise texture for a premium background feel.
  - Framer Motion animations for unit deployment.
- **Typography:** Inter (Sans-serif) with high-contrast mono fonts for status logs.

## **3. Implementation Details**

### **3.1 Tech Stack**
- **Frontend:** React 19 + TypeScript + Vite.
- **Styling:** Tailwind CSS (Custom tactical theme).
- **Icons:** Lucide React.
- **Animation:** Framer Motion.
- **Backend:** Supabase (Auth & Database ready).

### **3.2 Core Components**
- **`App.tsx`**: Main controller handling state (tasks, user) and layout.
- **`CalendarArea.tsx`**: To-do input system with real-time "Reserve Capacity" calculation.
- **`Battlefield.tsx`**: Visual game board using `AnimatePresence` to show unit counts.
- **`supabaseClient.ts`**: Integration point for Google OAuth.

### **3.3 Calculation Logic**
- **Allied Soldiers:** `Math.floor(FreeMinutes / 15)`.
- **Enemy Units:** `tasks.length`.
- **Total Capacity:** Default 8 hours (480 minutes) per day.

## **4. Current Status**
- [x] Initial setup and dependency installation.
- [x] Tactical UI theme and global CSS.
- [x] Supabase Auth boilerplate (Google Login).
- [x] Task-to-Unit conversion logic.
- [x] Responsive split-screen dashboard.

## **5. Next Steps**
- [ ] Persist tasks to Supabase database.
- [ ] Add "Clear Mission" button to remove all tasks.
- [ ] Implement actual combat animations (units moving/attacking).
- [ ] Add Sound Effects for a more immersive game feel.
