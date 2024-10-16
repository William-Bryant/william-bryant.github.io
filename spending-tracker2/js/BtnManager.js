//* Local imports
import DatabaseReader2 from './DatabaseReader.js';
import DatabaseWriter2 from './DatabaseWriter.js';

//* Class declarations
const dbReader = new DatabaseReader2()
const dbWriter = new DatabaseWriter2()

class BtnManager {
    constructor(){
        this.was_insert_successful = false
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    
    switchToPurchaseEntryPage() {
        $('#purchase_entry_page').show();
        $('#spending_log_page').hide()
        $('#admin_page').hide()
        $('#main_purchase_entry').val('')
        dbReader.resetCurrentPeriod()
    }

    switchToSpendingLogPage() {
        $('#spending_log_page').show()
        $('#purchase_entry_page').hide();
        $('#admin_page').hide()
        $('#spending_log_table_deleted_div').hide()
        //dbReader.updateLocalDisplays()
        dbReader.updateLocalDisplays()
        
    }

    switchToSettingsPage() {
        $('#admin_page').show()
        $('#spending_log_page').hide()
        $('#purchase_entry_page').hide();
        dbReader.resetCurrentPeriod()
    }

    goToDeleteRecords(){
        $('#spending_log_table_deleted_div').show()
        $('#admin_home').hide()
    }
    
    closeDeleteTable() {
        $('#spending_log_table_deleted_div').hide()
        $('#admin_home').show()
    }

    async handleSubmit() {
        //* Processes the entry. If valid, this.was_insert_successful will be true
        this.was_insert_successful = await dbWriter.processPurchaseEntry()

        if (this.was_insert_successful) {
            dbReader.updateLocalDisplays(); 
            $('#spending_log_page').show();
            $('#purchase_entry_page').hide();
            this._reset_user_view()
        } else {
            console.log('Submission failed, check error box for details.');
        }
    }


    seePrevWeekData(){
        dbReader.moveCurrentPeriod('backwards')
        dbReader.updateLocalDisplays()
        $('#filter_date_forwards_btn').css('opacity', 100)
    }
    seeCurrWeekData(){
        dbReader.moveCurrentPeriod('forwards')
        dbReader.updateLocalDisplays()
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