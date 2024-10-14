//* Local imports
import DateManager from './DateManager.js'


//* Class declarations
const dateManager = new DateManager();


class DatabaseReader2 {
    constructor() {
        // Replace these with your actual URL and anon key
        const SUPABASE_URL = 'https://gkzfslszwxcncnoiuksq.supabase.co';
        const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdremZzbHN6d3hjbmNub2l1a3NxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjg4NTM3NjIsImV4cCI6MjA0NDQyOTc2Mn0.dxCStAG5cDqENDHMKLdOkCeqTnDTjN3k-tz_10EJ6b8';

        // Create a Supabase client
        this.supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        
        //? Hard set based on preference
        this.payDay = 'Wednesday'
        this.frequency = 'weekly'
        const { currentPeriodStart, currentPeriodEnd } = dateManager._determine_pay_period_dates(this.payDay, this.frequency);
        
        //* These get defaulted to the current at start of program. 
        //* Can be globally changed in _move_current_period()
        this.currentPeriodStart = currentPeriodStart;
        this.currentPeriodEnd = currentPeriodEnd;


        
       }

    async updateLocalDisplays() {
        try {
            
            
            //* Format the dates for db use
            let periodStartDate = dateManager._format_date_yyyymmdd(this.currentPeriodStart)
            let periodEndDate = dateManager._format_date_yyyymmdd(this.currentPeriodEnd)

            //* Grab data from database
            let data = await this._fetchAllTransactionsInPeriod(periodStartDate, periodEndDate)

            //* Update transaction table
            this._updateLocalTransactionTable(data)
            
            //* Update date header
            this._updateDateHeaderDisplay(this.currentPeriodStart, this.currentPeriodEnd)

            //* Check if date filter btns should be displayed
            dateManager.checkWhichDateFilterBtnsToShow(this.currentPeriodStart, this.currentPeriodEnd)
        } catch (error) {
            console.error('Error loading table and updating total:', error);
        }
    }


    async _fetchAllTransactionsInPeriod(periodStartDate, periodEndDate) {
        //* Reads from databae all transactions that have dates within the desired period
        console.log('fetching transactions in range: '+periodStartDate+' - ',periodEndDate)

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
            console.log('All Transactions:', data);
            return data
        }
    }

    _updateDateHeaderDisplay(currentPeriodStart,currentPeriodEnd){
        //* This will update the date display based on what period is being looked at

        currentPeriodStart = dateManager._format_date_for_header_display(currentPeriodStart)
        currentPeriodEnd = dateManager._format_date_for_header_display(currentPeriodEnd)

        $('#cycle_start').html(currentPeriodStart)
        $('#cycle_end').html(currentPeriodEnd)
    }

    _updateLocalTransactionTable(data) {
        //* This will update the transaction table with passed in data

        const tableBody = $('#spending_log_table tbody'); 
        tableBody.empty(); 

        //* Iterate through each item in the data array
        data.forEach(item => {
            const $row = $('<tr></tr>');
            $row.append(`<td>${item['Price']}</td>`); 
            $row.append(`<td>${item['Description']}</td>`);
            $row.append(`<td>${item['Date']}</td>`); //* Ensure the date is in the correct format

            tableBody.append($row); //* Append the new row to the table body
        });
    }


    async _move_current_period(direction){
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

}

export default DatabaseReader2;
