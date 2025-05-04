// Enhanced version with additional UI features
document.addEventListener('DOMContentLoaded', () => {
    // Initialize theme
    initTheme();
    
    // Set today's date with a nicer format
    const today = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('today-date').textContent = today.toLocaleDateString('en-US', options);
    
    // Initialize Firebase
    initFirebase();
    
    // Check auth status
    checkAuthStatus();
    
    // Load a random quote
    fetchRandomQuote();
    
    // Set up event listeners
    setupEventListeners();
    
    // Generate calendar
    generateCalendar();
});

function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-bs-theme', savedTheme);
    
    const themeToggle = document.getElementById('themeToggle');
    if (savedTheme === 'light') {
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    }
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-bs-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-bs-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    const themeToggle = document.getElementById('themeToggle');
    if (newTheme === 'light') {
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    } else {
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
}

function initFirebase() {
    // Your Firebase config
    const firebaseConfig = {
        apiKey: "YOUR_API_KEY",
        authDomain: "YOUR_AUTH_DOMAIN",
        projectId: "YOUR_PROJECT_ID",
        storageBucket: "YOUR_STORAGE_BUCKET",
        messagingSenderId: "YOUR_SENDER_ID",
        appId: "YOUR_APP_ID"
    };
    
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    const messaging = firebase.messaging();
    
    // Request notification permission
    requestNotificationPermission(messaging);
    
    // Handle incoming messages
    messaging.onMessage((payload) => {
        console.log('Message received. ', payload);
        showToast(payload.notification.title, payload.notification.body);
    });
}

function requestNotificationPermission(messaging) {
    Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
            console.log('Notification permission granted.');
            getFCMToken(messaging);
        }
    });
}

function getFCMToken(messaging) {
    messaging.getToken({ vapidKey: 'YOUR_VAPID_KEY' }).then((currentToken) => {
        if (currentToken) {
            console.log('FCM Token:', currentToken);
            // Send token to your backend server
        }
    });
}

function setupEventListeners() {
    // Theme toggle
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);
    
    // Quote refresh
    document.getElementById('refresh-quote').addEventListener('click', fetchRandomQuote);
    
    // Check all habits
    document.getElementById('check-all').addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelectorAll('.habit-checkbox:not(:checked)').forEach(checkbox => {
            checkbox.checked = true;
            const habitId = checkbox.getAttribute('data-habit-id');
            logHabit(habitId, true);
        });
    });
    
    // Uncheck all habits
    document.getElementById('uncheck-all').addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelectorAll('.habit-checkbox:checked').forEach(checkbox => {
            checkbox.checked = false;
            const habitId = checkbox.getAttribute('data-habit-id');
            logHabit(habitId, false);
        });
    });
    
    // FAB add habit
    document.getElementById('fab-add-habit').addEventListener('click', function() {
        document.getElementById('habit-name').focus();
    });
}

function generateCalendar() {
    const calendarEl = document.getElementById('calendar');
    calendarEl.innerHTML = '';
    
    // Create day headers
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    days.forEach(day => {
        const dayEl = document.createElement('div');
        dayEl.className = 'calendar-day calendar-day-header';
        dayEl.textContent = day;
        calendarEl.appendChild(dayEl);
    });
    
    // Get current date info
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth();
    
    // Get first day of month
    const firstDay = new Date(year, month, 1).getDay();
    
    // Get days in month
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    // Add empty cells for days before first day of month
    for (let i = 0; i < firstDay; i++) {
        const emptyEl = document.createElement('div');
        emptyEl.className = 'calendar-day empty';
        calendarEl.appendChild(emptyEl);
    }
    
    // Add days of month
    for (let i = 1; i <= daysInMonth; i++) {
        const dayEl = document.createElement('div');
        dayEl.className = 'calendar-day';
        dayEl.textContent = i;
        
        // Randomly mark some days as completed for demo
        if (Math.random() > 0.7 && i <= date.getDate()) {
            dayEl.classList.add('completed');
        }
        
        calendarEl.appendChild(dayEl);
    }
}

function showToast(title, message) {
    const toastEl = document.getElementById('toast');
    const toastTitle = document.getElementById('toast-title');
    const toastMessage = document.getElementById('toast-message');
    
    toastTitle.textContent = title;
    toastMessage.textContent = message;
    
    const toast = new bootstrap.Toast(toastEl);
    toast.show();
}

// ... (rest of your existing JavaScript code for auth, habits, etc.)