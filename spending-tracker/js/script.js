//Document ready setup
$(document).ready(function() {

   // $('#purchase_entry').toggle();
    $('#spending_log_page').toggle();

    
});

//Default values setup
document.addEventListener('DOMContentLoaded', function() {
    get_todays_date()
});

// Methods
function toggleContainers() {
    $('#spending_log_page').toggle();
    $('#purchase_entry_page').toggle();
}

function get_todays_date() {
    const input = document.getElementById('date-entry');
    const today = new Date();
    
    // Format the date as YYYY-MM-DD
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const day = String(today.getDate()).padStart(2, '0');
    
    const formattedDate = `${year}-${month}-${day}`;
    input.value = formattedDate;
}

// Event bindings
$('#log-to-entry-btn').click(toggleContainers);
$('#entry-to-log-btn').click(toggleContainers);
