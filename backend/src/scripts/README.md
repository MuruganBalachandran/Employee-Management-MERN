# Seed Scripts

This directory contains scripts to populate the database with sample data for development and testing.

## Available Scripts

### Individual Seed Scripts

1. **Super Admin Seed**
   ```bash
   npm run seed:superadmin
   ```
   - Creates/updates the super admin account
   - Email: `superadmin@spanadmin.com`
   - Password: `Pass&135`
   - Permissions: `GRANTED` (always)

2. **Admins Seed**
   ```bash
   npm run seed:admins
   ```
   - Creates 10 admin accounts
   - Emails: `admin1@spanadmin.com` through `admin10@spanadmin.com`
   - Password: `Pass&135` (for all)
   - Permissions: Alternates between `GRANTED` (even index) and `REVOKED` (odd index)
   - **Note**: This script cleans up existing admin accounts before seeding

3. **Employees Seed**
   ```bash
   npm run seed:employees
   ```
   - Creates sample employee accounts
   - Password: `Pass&135` (for all)
   - **Note**: This script cleans up existing employee accounts before seeding

### Seed All Data

To seed all data at once (super admin, admins, and employees):

```bash
npm run seed:all
```

This runs all three seed scripts in sequence.

## Default Credentials

All seeded accounts use the same default password: **`Pass&135`**

### Super Admin
- Email: `superadmin@spanadmin.com`
- Password: `Pass&135`
- Permissions: `GRANTED`

### Admins
- Emails: `admin1@spanadmin.com` to `admin10@spanadmin.com`
- Password: `Pass&135`
- Permissions: 
  - admin1, admin3, admin5, admin7, admin9: `GRANTED`
  - admin2, admin4, admin6, admin8, admin10: `REVOKED`

### Employees
- Check the `seedEmployees.js` file for specific employee data
- Password: `Pass&135`

## Permission System

The `Permissions` field in the Admin model can have two values:
- **`GRANTED`**: Admin has full permissions to manage employees
- **`REVOKED`**: Admin's permissions are revoked (restricted access)

The super admin can toggle these permissions through the admin management interface.

## Notes

- Make sure your MongoDB connection is configured in `.env` before running seed scripts
- The admin and employee seed scripts will **delete existing data** before seeding
- The super admin seed script will update credentials if the super admin already exists
- All scripts use colored console output (via chalk) for better readability
