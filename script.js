// Smart Waste System - Core JavaScript

// ==================== DATA MANAGEMENT ====================

// Initialize data in localStorage if not exists
function initializeData() {
  if (!localStorage.getItem('sws_users')) {
    const defaultUsers = [
      {
        id: 1,
        name: 'Admin User',
        email: 'admin@sws.com',
        phone: '1234567890',
        address: 'Office',
        password: 'admin123',
        role: 'admin',
        createdAt: new Date().toISOString()
      },
      {
        id: 2,
        name: 'John Collector',
        email: 'john@sws.com',
        phone: '0987654321',
        address: 'Zone A',
        password: 'collector123',
        role: 'collector',
        zone: 'Zone A',
        createdAt: new Date().toISOString()
      },
      {
        id: 3,
        name: 'Alice Collector',
        email: 'alice@sws.com',
        phone: '1122334455',
        address: 'Zone B',
        password: 'collector123',
        role: 'collector',
        zone: 'Zone B',
        createdAt: new Date().toISOString()
      },
      {
        id: 4,
        name: 'Edwin Resident',
        email: 'edwin@sws.com',
        phone: '5556667777',
        address: '123 Main St',
        password: 'resident123',
        role: 'resident',
        points: 100,
        createdAt: new Date().toISOString()
      }
    ];
    localStorage.setItem('sws_users', JSON.stringify(defaultUsers));
  }

  if (!localStorage.getItem('sws_requests')) {
    const defaultRequests = [
      {
        id: 1,
        userId: 4,
        userName: 'Edwin Resident',
        wasteType: 'Biodegradable',
        date: '2026-04-20',
        notes: 'Kitchen waste',
        status: 'Pending',
        quantity: 0,
        createdAt: new Date().toISOString()
      },
      {
        id: 2,
        userId: 4,
        userName: 'Edwin Resident',
        wasteType: 'Recyclable',
        date: '2026-04-21',
        notes: 'Paper and plastic',
        status: 'Collected',
        quantity: 5,
        createdAt: new Date().toISOString()
      }
    ];
    localStorage.setItem('sws_requests', JSON.stringify(defaultRequests));
  }

  if (!localStorage.getItem('sws_complaints')) {
    const defaultComplaints = [
      {
        id: 102,
        userId: 4,
        userName: 'Edwin Resident',
        issue: 'Missed Pickup',
        description: 'Waste not collected on scheduled date',
        status: 'Pending',
        createdAt: new Date().toISOString()
      }
    ];
    localStorage.setItem('sws_complaints', JSON.stringify(defaultComplaints));
  }

  if (!localStorage.getItem('sws_schedules')) {
    const defaultSchedules = [
      {
        id: 1,
        zone: 'Zone A',
        collectorId: 2,
        collectorName: 'John Collector',
        day: 'Monday',
        date: '2026-04-20',
        time: '08:00 AM'
      },
      {
        id: 2,
        zone: 'Zone B',
        collectorId: 3,
        collectorName: 'Alice Collector',
        day: 'Tuesday',
        date: '2026-04-21',
        time: '09:00 AM'
      }
    ];
    localStorage.setItem('sws_schedules', JSON.stringify(defaultSchedules));
  }
}

// ==================== AUTHENTICATION ====================

// Get current logged-in user
function getCurrentUser() {
  const userStr = sessionStorage.getItem('sws_current_user');
  return userStr ? JSON.parse(userStr) : null;
}

// Set current user (on login)
function setCurrentUser(user) {
  sessionStorage.setItem('sws_current_user', JSON.stringify(user));
}

// Login function
function loginUser(email, password, role) {
  const users = JSON.parse(localStorage.getItem('sws_users') || '[]');
  const user = users.find(u => 
    (u.email === email || u.phone === email) && 
    u.password === password && 
    u.role === role
  );
  
  if (user) {
    setCurrentUser(user);
    return user;
  }
  return null;
}

// Register function
function registerUser(name, email, phone, address, password, role) {
  const users = JSON.parse(localStorage.getItem('sws_users') || '[]');
  
  // Check if email already exists
  if (users.find(u => u.email === email)) {
    return null;
  }
  
  const newUser = {
    id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
    name,
    email,
    phone,
    address,
    password,
    role,
    points: role === 'resident' ? 0 : undefined,
    zone: role === 'collector' ? 'Unassigned' : undefined,
    createdAt: new Date().toISOString()
  };
  
  users.push(newUser);
  localStorage.setItem('sws_users', JSON.stringify(users));
  
  return newUser;
}

// Logout function
function logout() {
  sessionStorage.removeItem('sws_current_user');
  window.location.href = 'login.html';
}

// Check if user is logged in, redirect if not
function requireAuth() {
  const user = getCurrentUser();
  if (!user) {
    window.location.href = 'login.html';
    return null;
  }
  return user;
}

// ==================== REQUEST MANAGEMENT ====================

// Create pickup request
function createPickupRequest(userId, userName, wasteType, date, notes) {
  const requests = JSON.parse(localStorage.getItem('sws_requests') || '[]');
  
  const newRequest = {
    id: requests.length > 0 ? Math.max(...requests.map(r => r.id)) + 1 : 1,
    userId,
    userName,
    wasteType,
    date,
    notes,
    status: 'Pending',
    quantity: 0,
    createdAt: new Date().toISOString()
  };
  
  requests.push(newRequest);
  localStorage.setItem('sws_requests', JSON.stringify(requests));
  
  return newRequest;
}

// Get requests by user ID
function getUserRequests(userId) {
  const requests = JSON.parse(localStorage.getItem('sws_requests') || '[]');
  return requests.filter(r => r.userId === userId);
}

// Get all requests (for admin/collector)
function getAllRequests() {
  return JSON.parse(localStorage.getItem('sws_requests') || '[]');
}

// Update request status
function updateRequestStatus(requestId, status, quantity = 0) {
  const requests = JSON.parse(localStorage.getItem('sws_requests') || '[]');
  const request = requests.find(r => r.id === requestId);
  
  if (request) {
    request.status = status;
    if (quantity > 0) {
      request.quantity = quantity;
    }
    localStorage.setItem('sws_requests', JSON.stringify(requests));
    return true;
  }
  return false;
}

// ==================== COMPLAINT MANAGEMENT ====================

// Create complaint
function createComplaint(userId, userName, issue, description) {
  const complaints = JSON.parse(localStorage.getItem('sws_complaints') || '[]');
  
  const newComplaint = {
    id: complaints.length > 0 ? Math.max(...complaints.map(c => c.id)) + 1 : 1,
    userId,
    userName,
    issue,
    description,
    status: 'Pending',
    createdAt: new Date().toISOString()
  };
  
  complaints.push(newComplaint);
  localStorage.setItem('sws_complaints', JSON.stringify(complaints));
  
  return newComplaint;
}

// Get all complaints
function getAllComplaints() {
  return JSON.parse(localStorage.getItem('sws_complaints') || '[]');
}

// Update complaint status
function updateComplaintStatus(complaintId, status) {
  const complaints = JSON.parse(localStorage.getItem('sws_complaints') || '[]');
  const complaint = complaints.find(c => c.id === complaintId);
  
  if (complaint) {
    complaint.status = status;
    localStorage.setItem('sws_complaints', JSON.stringify(complaints));
    return true;
  }
  return false;
}

// ==================== SCHEDULE MANAGEMENT ====================

// Get all schedules
function getAllSchedules() {
  return JSON.parse(localStorage.getItem('sws_schedules') || '[]');
}

// Get schedule by zone
function getScheduleByZone(zone) {
  const schedules = JSON.parse(localStorage.getItem('sws_schedules') || '[]');
  return schedules.filter(s => s.zone === zone);
}

// ==================== REWARDS MANAGEMENT ====================

// Get user points
function getUserPoints(userId) {
  const users = JSON.parse(localStorage.getItem('sws_users') || '[]');
  const user = users.find(u => u.id === userId);
  return user && user.points ? user.points : 0;
}

// Add points to user
function addPoints(userId, points) {
  const users = JSON.parse(localStorage.getItem('sws_users') || '[]');
  const user = users.find(u => u.id === userId);
  
  if (user) {
    user.points = (user.points || 0) + points;
    localStorage.setItem('sws_users', JSON.stringify(users));
    
    // Update session storage if it's the current user
    const currentUser = getCurrentUser();
    if (currentUser && currentUser.id === userId) {
      setCurrentUser(user);
    }
    
    return true;
  }
  return false;
}

// ==================== STATISTICS ====================

// Get dashboard statistics
function getStats() {
  const requests = JSON.parse(localStorage.getItem('sws_requests') || '[]');
  const complaints = JSON.parse(localStorage.getItem('sws_complaints') || '[]');
  const users = JSON.parse(localStorage.getItem('sws_users') || '[]');
  
  const totalRequests = requests.length;
  const totalComplaints = complaints.length;
  const totalCollected = requests.reduce((sum, r) => sum + (r.quantity || 0), 0);
  const totalCollectors = users.filter(u => u.role === 'collector').length;
  
  return {
    totalRequests,
    totalComplaints,
    totalCollected,
    totalCollectors
  };
}

// ==================== UTILITY FUNCTIONS ====================

// Format date
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
}

// Show notification
function showNotification(message, type = 'success') {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 15px 25px;
    background: ${type === 'success' ? '#4CAF50' : '#f44336'};
    color: white;
    border-radius: 5px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    z-index: 10000;
    animation: slideIn 0.3s ease;
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Add CSS animation for notifications
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from { transform: translateX(400px); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  @keyframes slideOut {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(400px); opacity: 0; }
  }
`;
document.head.appendChild(style);

// ==================== INITIALIZE ====================

// Initialize data on page load
initializeData();
