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
function initializeChart() {
    const ctx = document.getElementById('nutritionChart').getContext('2d');
    
    // Sample data - in a real app, this would come from your backend
    const data = {
        labels: ['Protein', 'Carbs', 'Fats', 'Fiber', 'Sugar'],
        datasets: [{
            data: [65, 45, 30, 20, 15],
            backgroundColor: [
                '#4CAF50',
                '#2196F3',
                '#FF9800',
                '#9C27B0',
                '#F44336'
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
                            return `${context.label}: ${context.raw}% of daily value`;
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
    
    new Chart(ctx, config);
}

// Add food item to meal
function addFoodItem(mealCard) {
    const foodItemsList = mealCard.querySelector('.food-items');
    const addFoodBtn = mealCard.querySelector('.btn-add-food');
    
    // Check if form already exists
    let form = mealCard.querySelector('.food-form');
    if (form) {
        form.remove();
        return;
    }
    
    // Create a form that appears below the button
    form = document.createElement('div');
    form.className = 'food-form';
    form.innerHTML = `
        <table class="food-form-table">
            <thead>
                <tr>
                    <th>Food Name</th>
                    <th>Calories</th>
                    <th>Protein (g)</th>
                    <th>Carbs (g)</th>
                    <th>Fats (g)</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><input type="text" id="foodName" placeholder="e.g., Grilled Chicken" required></td>
                    <td><input type="number" id="calories" placeholder="0" required></td>
                    <td><input type="number" id="protein" placeholder="0"></td>
                    <td><input type="number" id="carbs" placeholder="0"></td>
                    <td><input type="number" id="fats" placeholder="0"></td>
                    <td class="form-actions">
                        <button type="button" class="btn btn-sm btn-primary" id="addFoodBtn">Add</button>
                        <button type="button" class="btn btn-sm btn-outline" id="cancelBtn">×</button>
                    </td>
                </tr>
            </tbody>
        </table>
    `;
    
    // Insert the form after the food items list
    foodItemsList.parentNode.insertBefore(form, foodItemsList.nextSibling);
    
    // Focus on the first input
    const foodNameInput = form.querySelector('#foodName');
    foodNameInput.focus();
    
    // Handle form submission
    const addBtn = form.querySelector('#addFoodBtn');
    addBtn.addEventListener('click', () => {
        const foodName = foodNameInput.value.trim();
        const calories = form.querySelector('#calories').value.trim();
        const protein = form.querySelector('#protein').value.trim() || '0';
        const carbs = form.querySelector('#carbs').value.trim() || '0';
        const fats = form.querySelector('#fats').value.trim() || '0';
        
        if (!foodName || !calories) {
            alert('Please fill in all required fields');
            return;
        }
        
        if (isNaN(calories) || isNaN(protein) || isNaN(carbs) || isNaN(fats)) {
            alert('Please enter valid numbers for all fields');
            return;
        }
        
        // Parse values to ensure they're numbers
        const parsedProtein = parseFloat(protein) || 0;
        const parsedCarbs = parseFloat(carbs) || 0;
        const parsedFats = parseFloat(fats) || 0;
        const parsedCalories = parseFloat(calories) || 0;
        
        // Create food item row for the table
        const foodItem = document.createElement('tr');
        foodItem.className = 'food-item';
        foodItem.dataset.protein = parsedProtein;
        foodItem.dataset.carbs = parsedCarbs;
        foodItem.dataset.fats = parsedFats;
        
        foodItem.innerHTML = `
            <td class="food-name">${foodName}</td>
            <td class="food-calories">${calories}</td>
            <td>${protein}</td>
            <td>${carbs}</td>
            <td>${fats}</td>
            <td class="actions">
                <button class="remove-food" title="Remove"><i class="fas fa-times"></i></button>
            </td>
        `;
        
        // Add event listener to remove button
        const removeBtn = foodItem.querySelector('.remove-food');
        removeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            foodItem.remove();
            updateMealCalories(mealCard);
        });
        
        // Add the food item to the top of the list
        const foodItemsTable = foodItemsList.querySelector('table') || createFoodItemsTable();
        const tbody = foodItemsTable.querySelector('tbody');
        tbody.appendChild(foodItem);
        
        // If this is the first item, add the table to the container
        if (!foodItemsList.contains(foodItemsTable)) {
            foodItemsList.appendChild(foodItemsTable);
        }
        
        // Clear the form
        foodNameInput.value = '';
        form.querySelector('#calories').value = '';
        form.querySelector('#protein').value = '';
        form.querySelector('#carbs').value = '';
        form.querySelector('#fats').value = '';
        foodNameInput.focus();
        
        updateMealCalories(mealCard);
    });
    
    // Handle cancel button
    const cancelBtn = form.querySelector('#cancelBtn');
    cancelBtn.addEventListener('click', () => {
        form.remove();
    });
    
    // Helper function to create food items table if it doesn't exist
    function createFoodItemsTable() {
        const table = document.createElement('table');
        table.className = 'food-items-table';
        table.innerHTML = `
            <thead>
                <tr>
                    <th>Food Name</th>
                    <th>Calories</th>
                    <th>Protein (g)</th>
                    <th>Carbs (g)</th>
                    <th>Fats (g)</th>
                    <th></th>
                </tr>
            </thead>
            <tbody></tbody>
        `;
        return table;
    }
}

// Update meal calories and macros
function updateMealCalories(mealCard) {
    const foodItems = mealCard.querySelectorAll('table.food-items-table tbody tr.food-item');
    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFats = 0;
    
    foodItems.forEach(row => {
        // Get values from the table cells (td elements)
        const cells = row.querySelectorAll('td');
        if (cells.length >= 5) {
            const calories = parseFloat(cells[1].textContent.trim()) || 0;
            const protein = parseFloat(cells[2].textContent.trim()) || 0;
            const carbs = parseFloat(cells[3].textContent.trim()) || 0;
            const fats = parseFloat(cells[4].textContent.trim()) || 0;
            
            // Add to totals
            totalCalories += calories;
            totalProtein += protein;
            totalCarbs += carbs;
            totalFats += fats;
            
            // Update data attributes for reference
            row.dataset.protein = protein;
            row.dataset.carbs = carbs;
            row.dataset.fats = fats;
        }
    });
    
    // Update the meal card's total calories display
    const mealCaloriesElement = mealCard.querySelector('.meal-calories');
    if (mealCaloriesElement) {
        mealCaloriesElement.textContent = `${Math.round(totalCalories)} cal`;
    }
    
    // Update the dashboard with the new totals
    updateDashboard(totalCalories, totalProtein, totalCarbs, totalFats);
}

// Update dashboard summary and nutrition chart
function updateDashboard(calories, protein, carbs, fats) {
    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFats = 0;
    
    // If no parameters are passed, calculate totals from all meal cards
    if (arguments.length === 0) {
        const mealCards = document.querySelectorAll('.meal-card');
        mealCards.forEach(card => {
            const foodItems = card.querySelectorAll('table.food-items-table tbody tr.food-item');
            foodItems.forEach(row => {
                const cells = row.querySelectorAll('td');
                if (cells.length >= 5) {
                    totalCalories += parseFloat(cells[1].textContent.trim()) || 0;
                    totalProtein += parseFloat(cells[2].textContent.trim()) || 0;
                    totalCarbs += parseFloat(cells[3].textContent.trim()) || 0;
                    totalFats += parseFloat(cells[4].textContent.trim()) || 0;
                }
            });
        });
    } else {
        // Use the provided values
        totalCalories = parseFloat(calories) || 0;
        totalProtein = parseFloat(protein) || 0;
        totalCarbs = parseFloat(carbs) || 0;
        totalFats = parseFloat(fats) || 0;
    }
    
    // Update the stats cards
    updateStatCard('calories', totalCalories, 3000);
    updateStatCard('protein', totalProtein, 200);
    updateStatCard('carbs', totalCarbs, 300);
    updateStatCard('fats', totalFats, 90);
    
    // Update the nutrition chart if it exists
    updateNutritionChart(totalProtein, totalCarbs, totalFats);
}

// Update the nutrition chart with current values
function updateNutritionChart(protein, carbs, fats) {
    const ctx = document.getElementById('nutritionChart')?.getContext('2d');
    
    if (!ctx) return;
    
    // If chart already exists, update its data
    if (window.nutritionChart) {
        window.nutritionChart.data.datasets[0].data = [protein, carbs, fats];
        window.nutritionChart.update();
        return;
    }
    
    // Create new chart if it doesn't exist
    window.nutritionChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Protein', 'Carbs', 'Fats'],
            datasets: [{
                data: [protein, carbs, fats],
                backgroundColor: [
                    '#4CAF50',  // Green for protein
                    '#2196F3',  // Blue for carbs
                    '#FF9800'   // Orange for fats
                ],
                borderWidth: 1
            }]
        },
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
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
                            return `${label}: ${value}g (${percentage}%)`;
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
    });
}

// Update individual stat card
function updateStatCard(type, current, goal) {
    const statCards = document.querySelectorAll('.stat-card');
    let statCard = null;
    
    // Find the correct stat card based on type
    statCards.forEach(card => {
        const label = card.querySelector('.stat-label')?.textContent?.toLowerCase();
        if (label && label.includes(type.toLowerCase())) {
            statCard = card;
        }
    });
    
    if (!statCard) return;
    
    // Update the value
    const valueEl = statCard.querySelector('.stat-value');
    const progressBar = statCard.querySelector('.progress-bar');
    const goalEl = statCard.querySelector('.stat-goal');
    
    if (valueEl) {
        valueEl.textContent = type === 'calories' ? Math.round(current).toLocaleString() : Math.round(current);
    }
    
    if (goalEl) {
        goalEl.textContent = `Goal: ${type === 'calories' ? goal.toLocaleString() : Math.round(goal)}${type === 'calories' ? '' : 'g'}`;
    }
    
    if (progressBar) {
        const percentage = Math.min((current / goal) * 100, 100);
        progressBar.style.width = `${percentage}%`;
        
        // Update color based on percentage
        if (percentage > 90) {
            progressBar.style.backgroundColor = '#e74c3c';
        } else if (percentage > 70) {
            progressBar.style.backgroundColor = '#f39c12';
        } else {
            progressBar.style.backgroundColor = 'var(--primary-color)';
        }
    }
}

// Initialize event listeners
function init() {
    // Add food item buttons
    addFoodButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const mealCard = e.target.closest('.meal-card');
            addFoodItem(mealCard);
        });
    });
    
    // Initialize chart when DOM is loaded
    document.addEventListener('DOMContentLoaded', () => {
        initializeChart();
        // Update dashboard with initial values (0)
        updateDashboard(0, 0, 0, 0);
    });
    
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
    
    // Initialize stats with 0 values
    updateStatCard('calories', 0, 3000);
    updateStatCard('protein', 0, 200);
    updateStatCard('carbs', 0, 300);
    updateStatCard('fats', 0, 90);
}

// Initialize the application
init();
