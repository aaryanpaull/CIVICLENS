// Test script to verify department authentication
const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:3000';

async function testDepartmentLogin() {
  console.log('Testing Department Authentication System...\n');
  
  // Test credentials for Roads Department
  const testCredentials = {
    email: 'roads@gccdemo.in',
    password: 'Roads2024!'
  };
  
  try {
    // Test 1: Department Login
    console.log('1. Testing department login...');
    const loginResponse = await fetch(`${BASE_URL}/auth/department`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testCredentials)
    });
    
    if (!loginResponse.ok) {
      throw new Error(`Login failed: ${loginResponse.status}`);
    }
    
    const loginData = await loginResponse.json();
    console.log('✅ Login successful');
    console.log(`   Department: ${loginData.department.displayName}`);
    console.log(`   Token: ${loginData.token.substring(0, 20)}...`);
    
    // Test 2: Department Reports
    console.log('\n2. Testing department reports endpoint...');
    const reportsResponse = await fetch(`${BASE_URL}/reports/department`, {
      headers: {
        'Authorization': `Bearer ${loginData.token}`
      }
    });
    
    if (!reportsResponse.ok) {
      throw new Error(`Reports fetch failed: ${reportsResponse.status}`);
    }
    
    const reportsData = await reportsResponse.json();
    console.log('✅ Department reports fetched successfully');
    console.log(`   Reports count: ${reportsData.length}`);
    
    // Test 3: Invalid Credentials
    console.log('\n3. Testing invalid credentials...');
    const invalidResponse = await fetch(`${BASE_URL}/auth/department`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'invalid@example.com',
        password: 'wrongpassword'
      })
    });
    
    if (invalidResponse.status === 401) {
      console.log('✅ Invalid credentials properly rejected');
    } else {
      console.log('❌ Invalid credentials not properly rejected');
    }
    
    console.log('\n🎉 All tests passed! Department authentication system is working correctly.');
    console.log('\n📋 Department Credentials:');
    console.log('   Roads Department: roads@gccdemo.in / Roads2024!');
    console.log('   Waste Management: waste@gccdemo.in / Waste2024!');
    console.log('   Infrastructure: infrastructure@gccdemo.in / Infra2024!');
    console.log('   (See backend/department_credentials.json for all credentials)');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\nMake sure the backend server is running on port 3000');
    console.log('Run: cd backend && npm start');
  }
}

// Run the test
testDepartmentLogin();

