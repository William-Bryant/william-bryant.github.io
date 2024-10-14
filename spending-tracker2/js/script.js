


//* Local imports
import DatabaseReader from './DatabaseReader.js';
import DatabaseReader2 from './DatabaseReaderSQL.js'
import DatabaseWriter from './DatabaseWriter.js'
import DatabaseWriter2 from './DatabaseWriterSQL.js';
import DateManager from './DateManager.js'
import BtnManager from './BtnManager.js'

//* Class declarations
const dbReader = new DatabaseReader();
const dbReader2 = new DatabaseReader2()
const dbWriter = new DatabaseWriter();
const dbWriter2 = new DatabaseWriter2()
const dateManager = new DateManager();
const btnManager = new BtnManager();

//* Document ready setup
$(document).ready(function() {
    dateManager.set_default_date_for_input()
    //$('#spending_log_page').show();
    $('#purchase_entry_page').show();
    dbReader2.updateLocalDisplays()
    //dateManager.get_date_range_for_current_week()

    //* TEmps
    //$('#purchase_entry_page').hide();




    //dbReader2.updateLocalDisplays()
    //dbReader2._move_current_period('backwards')
    //dbReader2.updateLocalDisplays()

    $('#spending_log_table_deleted_div').hide()


});
//* This has to be this format because the btns are dynamically loaded
//* That causes an compatibility issue with jquery .click() handling for some reason
//* - Also is why handleDeleteRequest is not in BtnManager.
$(document).on('click', '.delete_btn', handleDeleteRequest);



//* Methods

function handleDeleteRequest(){

    const transactionKey = $(this).attr('transaction-key')

    dbWriter._deleteRecordFromDatabase(transactionKey)
    dbReader._update_deletion_table()
    
}



// Event bindings
$('#go_to_purchase_entry_btn').click(btnManager.switchToPurchaseEntryPage);
$('#go_to_spending_log_btn').click(btnManager.switchToSpendingLogPage);
$('#submit_btn').click(btnManager.handleSubmit)

$('#filter_date_backwards_forward_btn').click(btnManager.seePrevWeekData)
$('#filter_date_forwards_btn').click(btnManager.seeCurrWeekData)

$('#go_to_setting_page_btn').click(btnManager.switchToSettingsPage)
$('#close_admin_page_btn').click(btnManager.switchToSpendingLogPage)
$('#go_to_delete_records_btn').click(btnManager.goToDeleteRecords)
$('#close_delete_table_btn').click(btnManager.closeDeleteTable)