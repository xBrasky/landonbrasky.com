# Deploying to GitHub Pages with your Squarespace domain

## Step 1 — Fill in placeholders

Open `index.html` and search for these two comments and replace them:
- `<!-- Replace with your actual university name -->` → your university
- `<!-- Replace with actual company name -->` (×2) → your employer name(s)

## Step 2 — Add your images

Copy image files into the `images/` folder with these exact filenames:
| File | Used for |
|------|----------|
| `images/profile.jpg` | Hero photo (home page) |
| `images/lssgb.jpg` | Lean Six Sigma cert image |
| `images/salt-company.jpg` | Salt Company card |
| `images/vex-robotics.jpg` | VEX Robotics card |

Any image that's missing will show a placeholder automatically — no broken image icons.

## Step 3 — Create a GitHub repository

1. Go to github.com and create a **new public repository** named exactly: `landonbrasky.com`
2. Push this folder to that repo:

```
cd C:\Users\ljbra\landonbrasky-site
git init
git add .
git commit -m "Initial site"
git branch -M main
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/landonbrasky.com.git
git push -u origin main
```

## Step 4 — Enable GitHub Pages

1. In your GitHub repo, go to **Settings → Pages**
2. Under "Branch", select `main` and click Save
3. Under "Custom domain", type `landonbrasky.com` and click Save
4. Check "Enforce HTTPS" once it appears

GitHub will create a file called `CNAME` automatically — don't delete it.

## Step 5 — Update DNS in Squarespace

1. Log into Squarespace → **Domains**
2. Click `landonbrasky.com` → **DNS Settings**
3. Delete any existing A records pointing to Squarespace
4. Add these four A records (GitHub Pages IPs):

| Type | Host | Value |
|------|------|-------|
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |

5. Add one CNAME record:

| Type | Host | Value |
|------|------|-------|
| CNAME | www | YOUR_GITHUB_USERNAME.github.io |

DNS changes take up to 24 hours to fully propagate. After that, `landonbrasky.com` will serve your new site.

## Step 6 — Cancel Squarespace website plan (optional)

Once the new site is live, you can cancel the Squarespace **website** subscription.
Keep the **domain** registration ($20/year) so you stay in control of `landonbrasky.com`.
