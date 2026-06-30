# Expense Tracker Mobile App (React + Capacitor)

A modern, offline-first personal finance mobile application built with **React**, **Vite**, and **Capacitor** for Android. Designed to easily track daily expenses, view monthly statistics, and manage budgets in multiple global currencies.

---

## 📱 Features

- **Add, Edit, and Delete Expenses:** Simple, fast entry log for all transaction types.
- **Dynamic Multi-Currency Settings:** Swap between currencies dynamically with locale-aware formatting:
  - ₦ Nigerian Naira (NGN)
  - $ US Dollar (USD)
  - € Euro (EUR)
  - £ British Pound (GBP)
  - $ Canadian Dollar (CAD)
- **Local Native Persistence:** Upgraded from web `localStorage` to `@capacitor/preferences` to guarantee native data preservation even when device storage is low.
- **Categorization & Visual Breakdown:** Group your spending by Food, Transport, Housing, Health, Shopping, Entertainment, Utilities, and more with colorful progress bars.
- **Monthly Summary:** Automatic filtering and aggregates for the current month's expenses.
- **Modern Mobile-First UX:**
  - **Notch & Safe-Area Support:** Optimized viewport configurations to prevent overlapping with phone status bars or camera notches.
  - **Touch Accessibility:** Large, tactile buttons and form controls (minimum 48px height) and touch-friendly action controls.
- **100% Privacy Focused:** Offline utility. All financial records are stored purely on the physical device.

---

## 🛠️ Build and Development Workflow

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed.

### 1. Local Web Development
To run the React web environment locally in your browser:
```bash
npm install
npm run dev
```

### 2. Native Android Development
Whenever you make changes to the React code, compile the web assets and copy them into the native Android platform:
```bash
# Compile React source
npm run build

# Sync files with the Capacitor Android project
npx cap sync android
```

#### Launch Emulator (CLI)
To build the debug app and run it directly on a connected device or booted emulator:
```bash
npx cap run android
```

#### Open in Android Studio
To open the Android package for compilation, testing, or building signed releases:
```bash
npx cap open android
```

---

## 📦 Building a Release for Google Play Store (.aab)

1. Open the project in Android Studio:
   ```bash
   npx cap open android
   ```
2. Navigate to **Build** > **Generate Signed Bundle / APK...**
3. Choose **Android App Bundle (.aab)** and follow the steps to create/select your upload Keystore.
4. Set the Build Variant to **release** and build. The generated file will be saved at:
   `android/app/release/app-release.aab`
5. Upload the `.aab` file to your **Google Play Console** to release!
