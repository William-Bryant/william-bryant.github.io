//* Local imports
import DateManager from './DateManager.js'

//* Class declarations
const dateManager = new DateManager();

class DatabaseReader2 {
    constructor() {
        //* Declare url and key
        const SUPABASE_URL = 'https://gkzfslszwxcncnoiuksq.supabase.co';
        const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdremZzbHN6d3hjbmNub2l1a3NxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjg4NTM3NjIsImV4cCI6MjA0NDQyOTc2Mn0.dxCStAG5cDqENDHMKLdOkCeqTnDTjN3k-tz_10EJ6b8';

        //* Create a Supabase client
        this.supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        
        //? Hard set based on preference
        this.payDay = 'Wednesday'
        this.frequency = 'weekly'

        //* Unpack current pay period dates
        const { currentPeriodStart, currentPeriodEnd } = dateManager.determinePayPeriodDates(this.payDay, this.frequency);
        
        //* These get defaulted to the current at start of program. 
        //* Can be globally changed in moveCurrentPeriod()
        this.currentPeriodStart = currentPeriodStart;
        this.currentPeriodEnd = currentPeriodEnd;
       }

    async updateLocalDisplays() {
        try {

            //* Format the dates for db use
            let periodStartDate = dateManager.formatDateYYYYMMDD(this.currentPeriodStart)
            let periodEndDate = dateManager.formatDateYYYYMMDD(this.currentPeriodEnd)

            //* Grab data from database
            let data = await this._fetchAllTransactionsInPeriod(periodStartDate, periodEndDate)

            //* Update transaction table
            this._updateLocalTransactionTable(data)
            
            //* Update date header
            this._updateDateHeaderDisplay(this.currentPeriodStart, this.currentPeriodEnd)

            //* Update sum display
            this._updateSumDisplay(data)

            //* Update delete table
            this._updateDeleteTable(data)
            //* Check if date filter btns should be displayed
            dateManager.checkWhichDateFilterBtnsToShow(this.currentPeriodStart, this.currentPeriodEnd)
        } catch (error) {
            console.error('Error loading table and updating total:', error);
        }
    }

    async _fetchAllTransactionsInPeriod(periodStartDate, periodEndDate) {
        //* Reads from databae all transactions that have dates within the desired period
        
        //console.log('fetching transactions in range: '+periodStartDate+' - ',periodEndDate)
        const { data, error } = await this.supabase
            .from('Transactions')
            .select('*')
            .gte('Date',periodStartDate)
            .lte('Date',periodEndDate)
            .order('Date', { ascending: true })
            .order('Insert_datetime', { ascending: true });
        if (error) {
            console.error('Error fetching transactions:', error);
        } else {
            //console.log('All Transactions:', data);
            return data
        }
    }

    _updateDateHeaderDisplay(currentPeriodStart,currentPeriodEnd){
        //* This will update the date display based on what period is being looked at

        currentPeriodStart = dateManager.formatDateForHeaderDisplay(currentPeriodStart)
        currentPeriodEnd = dateManager.formatDateForHeaderDisplay(currentPeriodEnd)

        $('#cycle_start').html(currentPeriodStart)
        $('#cycle_end').html(currentPeriodEnd)
    }

    _updateSumDisplay(data){
        //* This will update the sum display

        let total = 0
        for (let i = 0; i < data.length; i++) {
            total += data[i]['Price'] || 0;  //* Add price if it exists, otherwise add 0
        }
        $('#total_spent_display_num').text(total.toFixed(2)); 
    }

    _updateLocalTransactionTable(data) {
        //* This will update the transaction table with passed in data

        const tableBody = $('#spending_log_table tbody'); 
        tableBody.empty(); 

        //* Iterate through each item in the data array
        data.forEach(item => {
            const $row = $('<tr></tr>');
            $row.append(`<td>$${item['Price']}</td>`); 
            $row.append(`<td>${item['Description']}</td>`);
            $row.append(`<td>${item['Date']}</td>`); //* Ensure the date is in the correct format

            tableBody.append($row); //* Append the new row to the table body
        });
    }

    async moveCurrentPeriod(direction){
        //* This adjusts the date range that is being looked at in the class instance
        //* Adjusts by entire pay periods
        let range_length = null

        if (this.frequency == 'weekly'){
            range_length = 7
        }
        if (this.frequency == 'biweekly'){
            range_length = 14
        }

        if (direction == 'backwards'){
            this.currentPeriodStart.setDate(this.currentPeriodStart.getDate() - range_length); 
            this.currentPeriodEnd.setDate(this.currentPeriodEnd.getDate() - range_length); 
        }
        if (direction == 'forwards'){
            this.currentPeriodStart.setDate(this.currentPeriodStart.getDate() + range_length); 
            this.currentPeriodEnd.setDate(this.currentPeriodEnd.getDate() + range_length); 
        }
    }

    resetCurrentPeriod(){
        //* This resets the period to be the current date range
        const { currentPeriodStart, currentPeriodEnd } = dateManager.determinePayPeriodDates(this.payDay, this.frequency);
        
        //* These get defaulted to the current at start of program. 
        //* Can be globally changed in moveCurrentPeriod()
        this.currentPeriodStart = currentPeriodStart;
        this.currentPeriodEnd = currentPeriodEnd;
    }

    async _updateDeleteTable(data){
        //* This will update the delete table. Called during page load and after a
        //* delete request

        const tableBody = $('#spending_log_table_deleted tbody'); 

            //* Clear the table before adding new rows
            tableBody.empty();

            for (let i = 0; i < data.length; i++) {
                const transaction = data[i];
                const { Price, Description, Date } = transaction; // Destructure the transaction fields

                //* Create a new row with a delete button
                const $row = $('<tr class="dlt_btn_row"></tr>');
                const $cell = $('<td></td>'); 

                //* Create a delete button with that has the record id in the meta tag so it can
                //* be used to delete the right record
                $cell.append(`
                    <button class='delete_btn' transaction-id='${transaction['id']}'>
                        $${Price} ${Description}, ${Date}
                    </button>
                `);

                //* Append the cell to the row and then the row to the table body
                $row.append($cell);
                tableBody.append($row);
            }
        }
}

export default DatabaseReader2;
