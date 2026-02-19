# MySQL Connection Error Fix

## Problem
`ECONNREFUSED` error means MySQL server is not running or not accessible on port 3306.

## Solution

### Step 1: Check if MySQL is Installed

Open Command Prompt or PowerShell and run:
```bash
mysql --version
```

If you get an error, MySQL is not installed.

### Step 2: Install MySQL (if not installed)

**Option A: Download MySQL Installer**
1. Go to: https://dev.mysql.com/downloads/installer/
2. Download "MySQL Installer for Windows"
3. Run the installer
4. Choose "Developer Default" or "Server only"
5. Set a root password (remember this!)
6. Complete the installation

**Option B: Use XAMPP (Easier)**
1. Download XAMPP: https://www.apachefriends.org/download.html
2. Install XAMPP
3. Open XAMPP Control Panel
4. Click "Start" next to MySQL

### Step 3: Start MySQL Service

**If using MySQL directly:**
```bash
# Open Services (Win + R, type: services.msc)
# Find "MySQL80" or "MySQL" service
# Right-click and select "Start"
```

**Or via Command Prompt (as Administrator):**
```bash
net start MySQL80
```

**If using XAMPP:**
- Open XAMPP Control Panel
- Click "Start" button next to MySQL

### Step 4: Verify MySQL is Running

```bash
# Test connection
mysql -u root -p
# Enter your password when prompted
```

If successful, you'll see:
```
mysql>
```

Type `exit` to quit.

### Step 5: Update Your .env File

Check your `server/.env` file has correct settings:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=cinema_booking
PORT=5001
JWT_SECRET=your_secret_key_here
```

### Step 6: Create the Database

Once MySQL is running:

```bash
# Connect to MySQL
mysql -u root -p

# Create database
CREATE DATABASE cinema_booking;

# Exit
exit
```

### Step 7: Run Database Setup

```bash
cd server
node setup-reviews.js
```

### Step 8: Restart Your Server

```bash
npm start
```

## Quick Troubleshooting

### Error: Access Denied
- Check your password in `.env` file
- Make sure DB_USER is correct (usually 'root')

### Error: Database doesn't exist
```bash
mysql -u root -p
CREATE DATABASE cinema_booking;
exit
```

### Error: Port 3306 already in use
- Another MySQL instance is running
- Stop other MySQL services
- Or change the port in MySQL config

### Still Not Working?

1. **Check MySQL is running:**
   ```bash
   netstat -an | findstr 3306
   ```
   Should show: `0.0.0.0:3306` or `127.0.0.1:3306`

2. **Check firewall:**
   - Allow MySQL through Windows Firewall
   - Port 3306 should be open

3. **Restart MySQL:**
   ```bash
   net stop MySQL80
   net start MySQL80
   ```

## Alternative: Use XAMPP (Recommended for Development)

XAMPP is easier for development:

1. Download and install XAMPP
2. Open XAMPP Control Panel
3. Start Apache and MySQL
4. Click "Admin" next to MySQL to open phpMyAdmin
5. Create database `cinema_booking`
6. Update `.env` with:
   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=cinema_booking
   ```
   (XAMPP MySQL has no password by default)

## Need Help?

If you're still stuck:
1. Check which MySQL you have installed (MySQL Workbench, XAMPP, etc.)
2. Make sure the service is running
3. Verify credentials in `.env` match your MySQL setup
