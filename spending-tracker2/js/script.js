
//* Local imports
import DatabaseReader from './DatabaseReader.js'
import DatabaseWriter from './DatabaseWriter.js';
import DateManager from './DateManager.js'
import BtnManager from './BtnManager.js'

//* Class declarations
const dbReader = new DatabaseReader()
const dbWriter = new DatabaseWriter()
const dateManager = new DateManager();
const btnManager = new BtnManager();

//* Document ready setup
$(document).ready(function() {
    dateManager.setDefaultDateForTransactionInput()
    //$('#spending_log_page').show();
    $('#purchase_entry_page').show();
    dbReader.updateLocalDisplays()

    $('#spending_log_table_deleted_div').hide()


});
//* This has to be this format because the btns are dynamically loaded
//* That causes an compatibility issue with jquery .click() handling for some reason
//* - Also is why handleDeleteRequest is not in BtnManager.
$(document).on('click', '.delete_btn', handleDeleteRequest);



//* Methods

async function handleDeleteRequest(){

    const transactionId = $(this).attr('transaction-id')

    await dbWriter.deleteRecordFromDatabase(transactionId)
    dbReader.updateLocalDisplays()
    
}



// Event bindings
$('#go_to_purchase_entry_btn').click(btnManager.switchToPurchaseEntryPage);
$('#go_to_spending_log_btn').click(btnManager.switchToSpendingLogPage);
$('#submit_btn').click(btnManager.handleSubmit)

$('#filter_date_backwards_btn').click(btnManager.seePrevWeekData)
$('#filter_date_forwards_btn').click(btnManager.seeCurrWeekData)

$('#go_to_settings_page_btn1').click(btnManager.switchToSettingsPage)
$('#go_to_settings_page_btn2').click(btnManager.switchToSettingsPage)
$('#close_admin_page_btn').click(btnManager.switchToSpendingLogPage)
$('#go_to_delete_records_btn').click(btnManager.goToDeleteRecords)
$('#close_delete_table_btn').click(btnManager.closeDeleteTable)