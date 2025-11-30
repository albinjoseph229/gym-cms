# Gym CMS Setup Guide

This guide will help you set up the Google Sheets integration for your Gym Management System.

## Prerequisite: Google Cloud Setup

1.  **Create a Project**:
    *   Go to the [Google Cloud Console](https://console.cloud.google.com/).
    *   Create a new project (e.g., "Gym CMS").

2.  **Enable Google Sheets API**:
    *   In the sidebar, go to **APIs & Services** > **Library**.
    *   Search for "Google Sheets API" and click **Enable**.

3.  **Create a Service Account**:
    *   Go to **APIs & Services** > **Credentials**.
    *   Click **Create Credentials** > **Service Account**.
    *   Name it (e.g., "gym-cms-bot") and click **Create & Continue**.
    *   (Optional) Grant "Editor" role, but not strictly necessary if you share the sheet directly. Click **Done**.

4.  **Get Credentials (JSON Key)**:
    *   Click on the newly created Service Account email in the list.
    *   Go to the **Keys** tab.
    *   Click **Add Key** > **Create new key**.
    *   Select **JSON** and click **Create**.
    *   A `.json` file will download. **Keep this safe!**

## Google Sheet Setup

1.  **Create a New Sheet**:
    *   Go to [Google Sheets](https://docs.google.com/spreadsheets) and create a blank sheet.
    *   Name it "Oasis Fitness Database" (or anything you like).

2.  **Share with Service Account**:
    *   Open the downloaded JSON key file.
    *   Find the `client_email` field (e.g., `gym-cms-bot@project-id.iam.gserviceaccount.com`).
    *   In your Google Sheet, click the **Share** button.
    *   Paste the service account email and give it **Editor** access.
    *   Uncheck "Notify people" (optional) and click **Share**.

3.  **Create Tabs & Columns**:
    You must create the following tabs (sheets) with the exact names and header rows (Row 1):

    **Tab Name: `Members`**
    *   Row 1: `ID`, `Full Name`, `Email`, `Mobile`, `DOB`, `Branch`, `Reg Date`, `Plan`, `Start Date`, `Expiry Date`, `Remaining Days`, `Fee Paid`, `Fee Validity`, `QR URL`, `Photo URL`

    **Tab Name: `Trainers`**
    *   Row 1: `ID`, `Name`, `Specialization`, `Experience`, `Photo URL`, `Branch`

    **Tab Name: `Plans`**
    *   Row 1: `ID`, `Name`, `Price`, `Duration (Days)`, `Benefits (comma separated)`

    **Tab Name: `Gallery`**
    *   Row 1: `ID`, `Category`, `Image URL`, `Caption`

    **Tab Name: `Contacts`**
    *   Row 1: `ID`, `Name`, `Email`, `Phone`, `Branch`, `Message`, `Date`

    **Tab Name: `Branches`** (Optional, if you want to make branches dynamic later)
    *   Row 1: `ID`, `Name`, `Location`, `Phone`, `Email`

## Application Configuration

1.  **Get Sheet ID**:
    *   Open your Google Sheet.
    *   Look at the URL: `https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID_IS_HERE/edit...`
    *   Copy the long string between `/d/` and `/edit`.

2.  **Configure Environment Variables**:
    *   In your project folder (`gym-cms`), create a file named `.env.local`.
    *   Add the following content, replacing the values with yours:

    ```env
    # From your JSON Key file
    GOOGLE_SERVICE_ACCOUNT_EMAIL=gym-cms-bot@project-id.iam.gserviceaccount.com
    
    # From your JSON Key file (Copy the entire private key including -----BEGIN... and \n)
    # NOTE: If pasting directly, ensure it's one line or properly quoted.
    GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour Private Key Content...\n-----END PRIVATE KEY-----\n"
    
    # From your Browser URL
    GOOGLE_SHEET_ID=1aBcDeFgHiJkLmNoPqRsTuVwXyZ
    
    # Admin Password
    ADMIN_PASSWORD=admin123
    ```

3.  **Restart the Server**:
    *   Stop the running server (Ctrl+C).
    *   Run `npm run dev` again.

## Verification
*   Go to `http://localhost:3000`.
*   The app should now be fetching data from your real sheet (which is empty initially).
*   Go to `/admin/login` -> Dashboard -> Members -> Add Member.
*   Add a member and check if it appears in your Google Sheet!
