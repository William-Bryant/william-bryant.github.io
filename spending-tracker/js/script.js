//* Local imports
import DatabaseReader from './DatabaseReader.js';
import DatabaseWriter from './DatabaseWriter.js'
import DateManager from './DateManager.js'

//* Class declarations
const dbReader = new DatabaseReader();
const dbWriter = new DatabaseWriter();
const dateManager = new DateManager();

//* Document ready setup
$(document).ready(function() {
    dateManager.set_default_date_for_input()
    $('#spending_log_page').hide();
    dbReader.updateLocalDisplays()
    dateManager.get_date_range_for_current_week()


});



//* Methods

function toggleContainers() {
    $('#spending_log_page').toggle();
    $('#purchase_entry_page').toggle();
}


function handleSubmit() {
    dbWriter.processPurchaseEntry()
    dbReader.updateLocalDisplays()//TODO: This shouldn't be called unless successful entry. Put this in processPurchaseEntry
    toggleContainers()
}





// Event bindings
$('#log-to-entry-btn').click(toggleContainers);
$('#entry-to-log-btn').click(toggleContainers);
$('#submit_btn').click(handleSubmit)
