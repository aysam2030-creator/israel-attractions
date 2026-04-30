# Play Store Data Safety Form — Quick Answers

When Play Console asks "Data safety", here's what to fill in (matches the actual app behavior):

## Data collection and security

**Q: Does your app collect or share any of the required user data types?**
**A: No** ✅

(Default config: nothing leaves the device. If you enable Supabase cloud chat, change to Yes and answer below.)

## If you enable Supabase cloud chat:

**Data collected:**
- ✅ Messages (Personal info → User-generated content)
- ✅ Photos shared in chat (Photos and videos)
- ✅ Audio recordings (voice notes)

**For each:**
- **Collected:** Yes
- **Shared with third parties:** No (Supabase is your own backend, not a third party)
- **Required or optional:** Optional (chat is optional)
- **Purpose:** App functionality (messaging)

**Security practices:**
- ✅ Data is encrypted in transit (Supabase uses HTTPS)
- ✅ Users can request data deletion (delete messages or uninstall the app)
- ✅ No data sold to third parties

## Permissions explanation

For sensitive permissions, Play Console may ask why:

- **Camera:** "Used so users can take photos to share in group chats"
- **Microphone:** "Used so users can record voice notes for group chats"
- **Location (coarse + fine):** "Used to sort attractions by distance from the user (Near me feature). Optional."

## Target audience and content

- **Target age:** 13+
- **Family policy:** Not in family-targeted programs
- **Ads:** No ads
- **In-app purchases:** No
