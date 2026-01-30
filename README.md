# HPCL – Go

HPCL – Go is an **Expo-based mobile application** built for rapid development and real-time testing across devices using **Expo Go**, without requiring production builds (APK / IPA) during development.

---

## 📌 Project Overview

- Built using **Expo** and **React Native**
- Live preview on physical devices via **Expo Go**
- No APK / IPA generation required during development
- Designed for fast iteration and real-time testing
- Supports **modular tagging** for structured and scalable content

---

## 🌐 Data & Architecture Overview

The application follows a **remote-first, cache-driven architecture** powered by JSON-based backend content.

### Data Loading Strategy

- All application data is served from **JSON-based backend APIs**
- On first launch, the app checks internet speed:
  - If the internet speed is **greater than 1 Mbps**, data is fetched from the backend
  - The fetched data is stored locally in cache
- Once data is cached, the app no longer loads data directly from JSON APIs on startup

---

### Cache Management & Data Updates

- After the initial data load, the app relies on **cached data**
- A separate **update-check API** is periodically called to verify whether backend data has changed
- If the update-check API returns `true`:
  - The app re-fetches the complete dataset from the backend
  - The existing cache is cleared and updated with the latest data
- If the update-check API returns `false`:
  - Cached data continues to be used without additional backend calls

---

### Offline Support

- Once data is cached, the app can function **without an active internet connection**
- This approach ensures better performance and usability in low or unstable network conditions

---

## 🔐 Device Identification

- On every **fresh installation** of the app:
  - A **UUID** is generated on the device
  - The UUID is stored securely using secure storage
- This UUID is used for device-level identification during API interactions

---

## 🏷️ Tags

- expo
- react-native
- expo-go
- offline-first
- cache-management
- json-driven
- mobile-architecture

## 🧠 Content Classification for LLM

The application uses predefined tags to classify content before sending it to the LLM.  
Each tag determines how the content should be processed and interpreted.

---

### 📤 Tag-1: Normal Search

Used for standard application functionality such as:

- Screens
- Navigation
- Forms
- Business logic

This tag represents regular app interactions and operational data.

---

### 📘 Tag-2: Knowledge Center

Used specifically within the **Knowledge Center** screen for informational content, including:

- FAQs
- User guides
- Tutorials
- Static documentation screens

This tag helps the LLM distinguish help and learning content from core application logic.

---

### 🖼️ Tag-4: Image Content (BASE64 Required)

Content under this tag **must include images encoded in BASE64 format**.

#### Use Cases:

- Offline image rendering
- APIs that do not support multipart uploads
- Embedded or bundled assets

⚠️ **Note:**  
Images should be optimized **before** converting to BASE64 to minimize payload size and improve performance.

---

## 🛠 Environment Requirements

Ensure the following dependencies are installed on your system:

```bash
Node.js v24
Java 21 (LTS)
```
