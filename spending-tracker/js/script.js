//* Local imports
import DatabaseManager from './DatabaseManager.js';


//* Class declarations
const dbManager = new DatabaseManager();

//* Document ready setup
$(document).ready(function() {
    set_default_date()
    $('#spending_log_page').hide();
    dbManager.updateLocalDisplays()
    
});



//* Methods

function toggleContainers() {
    $('#spending_log_page').toggle();
    $('#purchase_entry_page').toggle();
}

function set_default_date() {
    const input = document.getElementById('date-entry');
    const today = new Date();
    
    // Format the date as YYYY-MM-DD
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const day = String(today.getDate()).padStart(2, '0');
    
    const formattedDate = `${year}-${month}-${day}`;
    input.value = formattedDate;
}

function handleSubmit() {
    dbManager.processPurchaseEntry()
    dbManager.updateLocalDisplays()
    toggleContainers()
}





// Event bindings
$('#log-to-entry-btn').click(toggleContainers);
$('#entry-to-log-btn').click(toggleContainers);
$('#submit_btn').click(handleSubmit)
