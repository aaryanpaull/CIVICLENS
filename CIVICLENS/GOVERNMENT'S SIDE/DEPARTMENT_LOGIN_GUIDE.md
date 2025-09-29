# Department Login Guide

## Overview
The CivicLens Government Portal now supports department-based authentication. Each of the 15 departments has their own unique email and password, allowing them to access their specific dashboard with only reports relevant to their department.

## How It Works
1. **Login**: Each department uses their unique email and password
2. **Authentication**: System validates credentials and creates a session token
3. **Dashboard**: Department users see only reports relevant to their department
4. **Filtering**: Reports are automatically filtered based on department categories

## Department Credentials

### 1. Roads Department
- **Email:** roads@gccdemo.in
- **Password:** Roads2024!
- **Handles:** Road maintenance, potholes, and infrastructure

### 2. Waste Management Department
- **Email:** waste@gccdemo.in
- **Password:** Waste2024!
- **Handles:** Garbage collection, waste disposal, and sanitation

### 3. Infrastructure Department
- **Email:** infrastructure@gccdemo.in
- **Password:** Infra2024!
- **Handles:** Public infrastructure maintenance and development

### 4. Street Lighting Department
- **Email:** lighting@gccdemo.in
- **Password:** Light2024!
- **Handles:** Street lights, public lighting, and electrical infrastructure

### 5. Water and Sewage Department
- **Email:** water@gccdemo.in
- **Password:** Water2024!
- **Handles:** Water supply, sewage systems, and drainage

### 6. Enforcement Department
- **Email:** enforcement@gccdemo.in
- **Password:** Enforce2024!
- **Handles:** Political issues, vandalism, and law enforcement

### 7. Public Health & Sanitation Department
- **Email:** health@gccdemo.in
- **Password:** Health2024!
- **Handles:** Public health, sanitation, and hygiene

### 8. Parks & Green Spaces Department
- **Email:** parks@gccdemo.in
- **Password:** Parks2024!
- **Handles:** Parks, gardens, and green space maintenance

### 9. Planning Department
- **Email:** planning@gccdemo.in
- **Password:** Plan2024!
- **Handles:** Encroachments, illegal constructions, and urban planning

### 10. Environmental Department
- **Email:** pollution@gccdemo.in
- **Password:** Pollute2024!
- **Handles:** Noise control, air pollution, and environmental issues

### 11. Drainage Department
- **Email:** drainage@gccdemo.in
- **Password:** Drain2024!
- **Handles:** Flooding, drainage systems, and water management

### 12. Traffic Department
- **Email:** traffic@gccdemo.in
- **Password:** Traffic2024!
- **Handles:** Traffic management, parking, and road safety

### 13. Electricity Department
- **Email:** electricity@gccdemo.in
- **Password:** Power2024!
- **Handles:** Power supply, electrical infrastructure, and outages

### 14. Public Transport Department
- **Email:** transport@gccdemo.in
- **Password:** Transport2024!
- **Handles:** Public transport, bus stops, and transit infrastructure

### 15. Water Quality Department
- **Email:** drinkingwater@gccdemo.in
- **Password:** Drink2024!
- **Handles:** Drinking water quality, testing, and supply

## How to Login

1. Navigate to the login page at `/admin/index.html`
2. Enter your department's email address and password from the list above
3. Click "Sign in"
4. You will be automatically redirected to your department's dashboard
5. The dashboard will show only reports relevant to your department

## Features

### Department-Specific Dashboard
- Each department sees only reports relevant to their area of responsibility
- Department dropdown is disabled for department users (locked to their department)
- Welcome message shows the department name and description
- Reports are automatically filtered based on department categories

### Security
- Secure token-based authentication
- 24-hour session timeout
- Automatic logout on token expiration
- Department-specific access control

### Admin Access
- **Email:** admin@gccdemo.in
- **Password:** admin123
- **Access:** Full dashboard with all departments and reports

## Testing

To test the system:

1. Start the backend server:
   ```bash
   cd backend
   npm start
   ```

2. Run the test script:
   ```bash
   node test_department_login.js
   ```

3. Or test manually by logging in with any department credentials

## Backend API Endpoints

### Authentication
- `POST /auth/department` - Department login
- `GET /auth/verify` - Verify department token

### Reports
- `GET /reports/department` - Get reports for authenticated department (requires department token)
- `GET /reports?dept=<department>` - Get reports for specific department (admin access)

## Troubleshooting

- **Login fails**: Verify email and password are correct
- **No reports shown**: Check if reports exist for your department category
- **Token expired**: Log out and log back in
- **Backend errors**: Ensure server is running on port 3000

## Security Notes

- Passwords should be changed in production
- Consider implementing JWT tokens for better security
- Add rate limiting for login attempts
- Implement proper session management
- Store credentials in a secure database instead of JSON file

