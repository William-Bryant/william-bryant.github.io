//* Local imports
import DatabaseReader from './DatabaseReader.js';
import DatabaseWriter from './DatabaseWriter.js'
//* Class declarations
const dbReader = new DatabaseReader();
const dbWriter = new DatabaseWriter();
class BtnManager {
    
    switchToPurchaseEntryPage() {
        $('#purchase_entry_page').show();
        $('#spending_log_page').hide()
        $('#admin_page').hide()
    }

    switchToSpendingLogPage() {
        $('#spending_log_page').show()
        $('#purchase_entry_page').hide();
        $('#admin_page').hide()
    }

    switchToSettingsPage() {
        $('#admin_page').show()
        $('#spending_log_page').hide()
        $('#purchase_entry_page').hide();
        
    }

    handleSubmit() {
        dbWriter.processPurchaseEntry()
        dbReader.updateLocalDisplays()//TODO: This shouldn't be called unless successful entry. Put this in processPurchaseEntry
        //toggleContainers()
    }

    goToDeleteRecords(){
        $('#spending_log_table_deleted_div').show()
        $('#admin_home').hide()
    }

    handleDeleteRequest(){

        const transactionKey = $(this).attr('transaction-key')
    
        dbWriter._deleteRecordFromDatabase(transactionKey)
        dbReader._fill_deletion_table()
        
    }
    closeDeleteTable() {
        $('#spending_log_table_deleted_div').hide()
        $('#admin_home').show()
    }
}

export default BtnManager