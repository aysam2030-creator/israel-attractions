# 📱 Publishing Israel Attractions to Google Play Store

## What's already done ✅

- ✅ Android project scaffolded with Capacitor
- ✅ App icons in all densities (mdpi → xxxhdpi)
- ✅ Splash screens (light + dark, portrait + landscape)
- ✅ All required permissions declared
- ✅ Bundle ID: `com.aysam.israelattractions`
- ✅ Version: 1.0 (build 1)
- ✅ GitHub Actions workflow for cloud APK + AAB builds
- ✅ Signing config wired to env-based keystore

## What you need to do

### Step 1 — Push to GitHub (5 min)

You need a free GitHub account: https://github.com/join

```bash
cd C:\Users\aysam\.openclaw\workspace\israel-attractions
git init
git add .
git commit -m "Initial commit"
```

Then create a new repo at https://github.com/new (call it `israel-attractions`, set it private if you want), and:

```bash
git remote add origin https://github.com/YOUR-USERNAME/israel-attractions.git
git branch -M main
git push -u origin main
```

After the push, the GitHub Actions workflow will automatically build a **debug APK** you can install on your phone. Find it under the repo's **Actions** tab → click the latest run → download the `app-debug-apk` artifact.

### Step 2 — Generate a release signing keystore (one-time, 2 min)

You need this to publish to Play Store. Run on any machine with Java installed:

```bash
keytool -genkey -v -keystore release.keystore -keyalg RSA -keysize 2048 -validity 10000 -alias israel-attractions
```

It will ask for a password — **save it somewhere safe**. If you lose it, you can never update your app.

Convert to base64 (PowerShell on Windows):

```powershell
[Convert]::ToBase64String([IO.File]::ReadAllBytes("release.keystore")) | Set-Clipboard
```

### Step 3 — Add secrets to GitHub repo (3 min)

Go to your repo → **Settings → Secrets and variables → Actions → New repository secret**.

Add these four:

| Name | Value |
|---|---|
| `ANDROID_KEYSTORE_BASE64` | The base64 string from step 2 |
| `ANDROID_KEYSTORE_PASSWORD` | The password you set |
| `ANDROID_KEY_ALIAS` | `israel-attractions` |
| `ANDROID_KEY_PASSWORD` | Same as keystore password (or whatever you set) |

Push any commit (or click **Re-run all jobs** in the Actions tab) and the workflow will now produce:

- `app-debug-apk` — for sideloading + testing
- `app-release-apk` — signed release APK (also for sideloading)
- **`app-release-aab`** — this is what you upload to Play Store

### Step 4 — Google Play Developer account ($25, one-time)

Sign up: https://play.google.com/console/signup

- One-time $25 fee
- Needs valid government ID
- Approval usually within 24h

### Step 5 — Create the app in Play Console

1. **All apps → Create app**
2. App name: **Israel Attractions**
3. Default language: **English (US)** (you can add Hebrew + Arabic later)
4. App or game: **App**
5. Free or paid: **Free**
6. Tick the declarations

### Step 6 — Fill in the listing

Use the content from [`STORE_LISTING.md`](./STORE_LISTING.md) — title, short description, full description all drafted.

You'll need:
- ✅ App icon (already generated — `resources/icon.png`, 1024×1024)
- ⏳ **Feature graphic** (1024×500) — I can generate one, ask if you want
- ⏳ **Screenshots** (at least 2, max 8) — phone screenshots of the running app
- ⏳ **Privacy policy URL** — use [`PRIVACY_POLICY.md`](./PRIVACY_POLICY.md) hosted somewhere (GitHub Pages works free)
- ⏳ **Content rating** — fill the questionnaire (Everyone, no objectionable content)
- ⏳ **Target audience** — 13+
- ⏳ **Data safety form** — I drafted notes in [`DATA_SAFETY.md`](./DATA_SAFETY.md)

### Step 7 — Internal testing first (recommended)

Before going public:
1. **Testing → Internal testing → Create new release**
2. Upload the `app-release-aab` from GitHub Actions artifacts
3. Add your email as a tester
4. Roll out

Test thoroughly on a real device. When happy, promote to production.

### Step 8 — Submit for review

1. **Production → Create new release**
2. Upload the AAB
3. Add release notes
4. Submit
5. Review usually takes **1–7 days** for first submission

That's it. Approved → live on Play Store.

---

## Local testing right now

If you want to test the app on your phone *today* without waiting for any of this, you can:

**Option A:** Wait for the GitHub Actions debug APK after you push, download from artifacts, sideload on your phone (enable "install unknown apps" in Android settings).

**Option B:** Install Android Studio locally + USB-cable your phone → `npm run android:run` builds and installs in one command.

Just say which you want and I'll walk you through.

:))
