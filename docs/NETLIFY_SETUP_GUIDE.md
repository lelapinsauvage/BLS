# 🚀 Netlify CMS Setup Guide for BLS

## What We Just Built

✅ Admin interface at `/admin`
✅ Content management for Projects, Homepage, and Settings
✅ Image upload support
✅ JSON-based content storage

---

## Step-by-Step Deployment

### 1. Push to GitHub

```bash
git add .
git commit -m "Add Netlify CMS setup"
git push origin main
```

### 2. Deploy to Netlify

1. Go to **https://netlify.com** and sign up/login (use GitHub to sign in)
2. Click **"Add new site"** → **"Import an existing project"**
3. Choose **GitHub** and authorize Netlify
4. Select your **BLS** repository
5. Build settings:
   - **Build command:** Leave empty (static site)
   - **Publish directory:** `/` (root)
6. Click **"Deploy site"**

**Your site will be live in 1-2 minutes!** 🎉

---

### 3. Enable Netlify Identity (for CMS login)

1. In your Netlify dashboard, go to **Site settings** → **Identity**
2. Click **"Enable Identity"**
3. Under **Registration**, select **"Invite only"** (important!)
4. Under **Services** → **Git Gateway**, click **"Enable Git Gateway"**
5. Go to **Identity** tab, click **"Invite users"**
6. Enter your email and send invite

---

### 4. Access Your CMS

1. Go to **yoursitename.netlify.app/admin**
2. You'll see "Netlify Identity widget"
3. Accept the email invite you received
4. Set your password
5. Login to the CMS 🎉

---

## What You Can Edit

### Projects
- Add, edit, or delete projects
- Upload images
- Set categories and years

### Homepage
- Hero text and description
- Numbers section values
- Founders bio
- All content!

### Settings
- Contact info
- Social links
- Footer content

---

## How It Works

1. **Client logs in** at `yoursite.netlify.app/admin`
2. **Makes changes** (edit text, upload images, add projects)
3. **Clicks "Publish"**
4. **Changes commit to GitHub** automatically
5. **Site rebuilds** in 1-2 minutes
6. **Changes go live!**

---

## Custom Domain Setup (Optional)

1. In Netlify: **Domain settings** → **Add custom domain**
2. Enter `blprojects.com.au` (or whatever domain)
3. Follow DNS instructions
4. Wait 24-48 hours for propagation

---

## Troubleshooting

**Can't access /admin?**
- Make sure you pushed the `admin/` folder
- Check that Identity is enabled

**Can't login?**
- Check you accepted the email invite
- Make sure Git Gateway is enabled

**Changes not showing?**
- Wait 1-2 minutes for rebuild
- Check **Deploys** tab for build status

---

## 🎯 You're Done!

The client can now edit content without touching code. You've delivered a premium custom site with CMS functionality.

**Next steps:**
- Show client how to use the CMS (5-minute walkthrough)
- Add more projects through the CMS
- Customize the design as needed

**Questions? Issues? Let me know!**
