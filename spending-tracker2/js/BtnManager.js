//* Local imports
import DatabaseReader from './DatabaseReader.js';
import DatabaseWriter from './DatabaseWriter.js'
//* Class declarations
const dbReader = new DatabaseReader();
const dbWriter = new DatabaseWriter();
class BtnManager {
    constructor(){
        this.valid_user_entry = false
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    
    switchToPurchaseEntryPage() {
        $('#purchase_entry_page').show();
        $('#spending_log_page').hide()
        $('#admin_page').hide()
    }

    switchToSpendingLogPage() {
        $('#spending_log_page').show()
        $('#purchase_entry_page').hide();
        $('#admin_page').hide()
        $('#spending_log_table_deleted_div').hide()
        dbReader.updateLocalDisplays()

    }

    switchToSettingsPage() {
        $('#admin_page').show()
        $('#spending_log_page').hide()
        $('#purchase_entry_page').hide();
        
    }

    async handleSubmit() {
        //* Processes the entry. If valid, this.valid_user_entry will be true
        this.valid_user_entry = await dbWriter.processPurchaseEntry();
        
        if (this.valid_user_entry) {
            dbReader.updateLocalDisplays(); 
            $('#spending_log_page').show();
            $('#purchase_entry_page').hide();
            this._reset_user_view()
        } else {
            console.log('Submission failed, check error box for details.');
        }
    }

    goToDeleteRecords(){
        $('#spending_log_table_deleted_div').show()
        $('#admin_home').hide()
    }

    handleDeleteRequest(){

        const transactionKey = $(this).attr('transaction-key')
    
        dbWriter._deleteRecordFromDatabase(transactionKey)
        dbReader._update_deletion_table()
        
    }
    closeDeleteTable() {
        $('#spending_log_table_deleted_div').hide()
        $('#admin_home').show()
    }

    seePrevWeekData(){
        dbReader.updateLocalDisplaysPreviousWeek()
        $('#see_curr_weeks_data_btn').css('opacity', 100)
        $('#see_prev_weeks_data_btn').css('opacity', 0)
    }
    seeCurrWeekData(){
        dbReader.updateLocalDisplays()
        $('#see_prev_weeks_data_btn').css('opacity', 100)
    }
    _reset_user_view(){
      //  $('html, body').animate({ scrollTop: 0 }, 'fast');
        //* Reset the zoom level by modifying the viewport meta tag
        //$("meta[name=viewport]").setAttr("content", "width=device-width, initial-scale=1.0");
        const viewportmeta = document.querySelector('meta[name=viewport]');
        viewportmeta.setAttribute('content', "initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0")
    }


}

export default BtnManager