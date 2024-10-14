//* Local imports
import DatabaseReader from './DatabaseReader.js';
import DatabaseReader2 from './DatabaseReaderSQL.js';
import DatabaseWriter from './DatabaseWriter.js'
import DatabaseWriter2 from './DatabaseWriterSQL.js';

//* Class declarations
const dbReader = new DatabaseReader();
const dbReader2 = new DatabaseReader2()
const dbWriter = new DatabaseWriter();
const dbWriter2 = new DatabaseWriter2()

class BtnManager {
    constructor(){
        this.valid_user_entry = false
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    
    switchToPurchaseEntryPage() {
        $('#purchase_entry_page').show();
        $('#spending_log_page').hide()
        $('#admin_page').hide()
        $('#main_purchase_entry').val('')
    }

    switchToSpendingLogPage() {
        $('#spending_log_page').show()
        $('#purchase_entry_page').hide();
        $('#admin_page').hide()
        $('#spending_log_table_deleted_div').hide()
        //dbReader.updateLocalDisplays()
        dbReader2.updateLocalDisplays()

    }

    switchToSettingsPage() {
        $('#admin_page').show()
        $('#spending_log_page').hide()
        $('#purchase_entry_page').hide();
        
    }

    async handleSubmit() {
        //* Processes the entry. If valid, this.valid_user_entry will be true
        //!this.valid_user_entry = await dbWriter.processPurchaseEntry();
        this.valid_user_entry = await dbWriter2.processPurchaseEntry()
        
        

        if (this.valid_user_entry) {
            //dbReader.updateLocalDisplays();
            console.log('updating!')

            dbReader2.updateLocalDisplays(); 
            $('#spending_log_page').show();
            $('#purchase_entry_page').hide();
            this._reset_user_view()
        } else {
            console.log('Submission failed, check error box for details.');
        }
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
        //dbReader.updateLocalDisplaysPreviousWeek()
        dbReader2._move_current_period('backwards')
        dbReader2.updateLocalDisplays()
        $('#filter_date_forwards_btn').css('opacity', 100)
        //$('#see_prev_weeks_data_btn').css('opacity', 0)
    }
    seeCurrWeekData(){
        //dbReader.updateLocalDisplays()
        dbReader2._move_current_period('forwards')
        dbReader2.updateLocalDisplays()
        //$('#see_prev_weeks_data_btn').css('opacity', 100)
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