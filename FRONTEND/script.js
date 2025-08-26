// DOM Elements
const navLinks = document.querySelectorAll('.nav-links a');
const mealCards = document.querySelectorAll('.meal-card');
const addFoodButtons = document.querySelectorAll('.btn-add-food');

// Smooth scrolling for navigation links
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        // Update active link
        navLinks.forEach(navLink => navLink.classList.remove('active'));
        link.classList.add('active');
        
        // Smooth scroll to section
        targetSection.scrollIntoView({ behavior: 'smooth' });
    });
});

// Initialize Chart.js for nutrition insights
let nutritionChart = null;

function initializeChart() {
    const ctx = document.getElementById('nutritionChart');
    if (!ctx) return;
    
    // Initial data with zeros
    const data = {
        labels: ['Protein', 'Carbs', 'Fats'],
        datasets: [{
            data: [0, 0, 0],
            backgroundColor: [
                '#4CAF50', // Green for protein
                '#2196F3', // Blue for carbs
                '#FF9800'  // Orange for fats
            ],
            borderWidth: 1
        }]
    };
    
    const config = {
        type: 'doughnut',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.raw || 0;
                            return `${label}: ${value}g`;
                        }
                    }
                }
            },
            cutout: '70%',
            animation: {
                animateScale: true,
                animateRotate: true
            }
        }
    };
    
    // Store the chart instance in a global variable
    nutritionChart = new Chart(ctx, config);
    
    // Update chart data with initial values
    const initialProtein = 50;
    const initialCarbs = 200;
    const initialFats = 70;
    updateNutritionChart(initialProtein, initialCarbs, initialFats);
}

// Add food item to meal
function addFoodItem(mealCard) {
    const foodItemsList = mealCard.querySelector('.food-items');
    const foodName = prompt('Enter food name:');
    
    if (foodName) {
        const calories = prompt('Enter calories:');
        
        if (calories && !isNaN(calories)) {
            const foodItem = document.createElement('li');
            foodItem.innerHTML = `
                ${foodName} 
                <span>${calories} cal</span>
                <button class="remove-food"><i class="fas fa-times"></i></button>
            `;
            
            // Add event listener to remove button
            const removeBtn = foodItem.querySelector('.remove-food');
            removeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                foodItem.remove();
                updateMealCalories(mealCard);
            });
            
            foodItemsList.appendChild(foodItem);
            updateMealCalories(mealCard);
        } else {
            alert('Please enter a valid number for calories.');
        }
    }
}

// Update meal calories
function updateMealCalories(mealCard) {
    const calorieSpans = mealCard.querySelectorAll('.food-items li span');
    let totalCalories = 0;
    
    calorieSpans.forEach(span => {
        const calories = parseInt(span.textContent);
        if (!isNaN(calories)) {
            totalCalories += calories;
        }
    });
    
    const mealCalories = mealCard.querySelector('.meal-calories');
    if (mealCalories) {
        mealCalories.textContent = `${totalCalories} cal`;
    }
    
    updateDashboard();
}

// Update dashboard summary and nutrition chart
function updateDashboard() {
    const mealCards = document.querySelectorAll('.meal-card');
    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFats = 0;
    
    // Calculate totals from all meals
    mealCards.forEach(card => {
        const foodItems = card.querySelectorAll('.food-item');
        foodItems.forEach(item => {
            const calories = parseInt(item.querySelector('.food-calories').textContent) || 0;
            const protein = parseFloat(item.dataset.protein) || 0;
            const carbs = parseFloat(item.dataset.carbs) || 0;
            const fats = parseFloat(item.dataset.fats) || 0;
            
            totalCalories += calories;
            totalProtein += protein;
            totalCarbs += carbs;
            totalFats += fats;
        });
    });
    
    // Update the nutrition chart with current values
    updateNutritionChart(totalProtein, totalCarbs, totalFats);
}

// Update the nutrition chart with current macros
function updateNutritionChart(protein, carbs, fats) {
    try {
        // Calculate total calories (4 cal/g for protein and carbs, 9 cal/g for fats)
        const totalCalories = Math.round((protein * 4) + (carbs * 4) + (fats * 9));
        
        // Update stat cards
        updateStatCard('calories', totalCalories, 2000);
        updateStatCard('protein', protein, 120);
        updateStatCard('carbs', carbs, 300);
        updateStatCard('fats', fats, 90);
        
        // Initialize chart if it doesn't exist
        if (!nutritionChart) {
            initializeChart();
            // Wait for chart to initialize
            setTimeout(() => {
                if (nutritionChart) {
                    nutritionChart.data.datasets[0].data = [protein, carbs, fats];
                    nutritionChart.update();
                }
            }, 100);
        } else {
            // Update existing chart
            nutritionChart.data.datasets[0].data = [protein, carbs, fats];
            nutritionChart.update();
        }
    } catch (error) {
        console.error('Error updating nutrition chart:', error);
    }
}

// Update individual stat card
function updateStatCard(type, current, goal) {
    try {
        const statCard = document.querySelector(`.stat-card:nth-child(${
            type === 'calories' ? 1 : 
            type === 'protein' ? 2 : 
            type === 'carbs' ? 3 : 4
        })`);
        
        if (!statCard) {
            console.warn(`Stat card for ${type} not found`);
            return;
        }
        
        // Update the value display
        const valueEl = statCard.querySelector('.stat-value');
        const progressBar = statCard.querySelector('.progress-bar');
        const goalEl = statCard.querySelector('.stat-goal');
        
        if (valueEl) {
            const displayValue = type === 'calories' ? 
                current.toLocaleString() : 
                Math.round(current);
            valueEl.textContent = type === 'calories' ? displayValue : `${displayValue}g`;
        }
        
        if (progressBar) {
            const percentage = Math.min((current / goal) * 100, 100);
            progressBar.style.width = `${percentage}%`;
            
            // Update color based on percentage
            if (percentage > 90) {
                progressBar.style.backgroundColor = '#e74c3c'; // Red
            } else if (percentage > 70) {
                progressBar.style.backgroundColor = '#f39c12'; // Orange
            } else {
                progressBar.style.backgroundColor = '#4CAF50'; // Green
            }
        }
        
        // Update goal display if element exists
        if (goalEl) {
            const goalText = type === 'calories' ? 
                `Goal: ${goal.toLocaleString()}` : 
                `Goal: ${goal}g`;
            goalEl.textContent = goalText;
        }
    } catch (error) {
        console.error(`Error updating ${type} stat card:`, error);
    }
}

// Initialize event listeners
function init() {
    try {
        // Add food item buttons
        addFoodButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const mealCard = e.target.closest('.meal-card');
                addFoodItem(mealCard);
            });
        });
        
        // Initialize chart when DOM is loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initializeApp);
        } else {
            initializeApp();
        }
        
        // Function to initialize the app
        function initializeApp() {
            initializeChart();
            // Initial update with zeros
            setTimeout(() => {
                updateNutritionChart(0, 0, 0);
            }, 500);
        }
    } catch (error) {
        console.error('Error initializing app:', error);
    }
    
    // Set active nav link based on scroll position
    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY + 100;
        
        document.querySelectorAll('section').forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });
}

// Initialize the application
init();
