import { ref, get } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-database.js";
//* ref: creates a reference to a specific path in the database. 'transactions', i think for this one
//* get: used to fetch data, it returns a promise that resolves to a DataSnapshot object
//*     containing the data at the reference
import { db } from './firebaseSetup.js';

//* Local imports
import DateManager from './DateManager.js'

//* Class declarations
const dateManager = new DateManager();


class DatabaseReader {
    constructor() {
        this.transactionsRef = ref(db, 'transactions')
    }
    async updateLocalDisplays() {
        try {
            //* Read data from the database. 'data' is an array
            let data = await this._readDatabase(); // Await the promise to get the data;

            //* Filter data to only get this week's data
            data = this._filter_data_to_only_have_current_week(data)

            //* Update the purchase log
            this._updateLocalTransactionTable(data);
            
            //* Update the sum display
            this._updateLocalSumDisplay(data);

            
            this._update_deletion_table()
        } catch (error) {
            console.error('Error loading table and updating total:', error);
        }
    }

    async _readDatabase() {
        try {
            const snapshot = await get(this.transactionsRef);
            
            if (!snapshot.exists()) {
                console.log('No transactions found.');
                return [];
            }
            
            // Collect data into an array
            const data = [];
            snapshot.forEach((childSnapshot) => {
                data.push(childSnapshot.val());
            });
            
            return data;
        } catch (error) {
            console.error('Error in _readDataBase:', error);
            return [];
        }
    }

    _filter_data_to_only_have_current_week(data){
        //* This will filter out the data to have only the current week
        //************************************************************** */

        // Get the last Wednesday's date
        const lastWednesday = dateManager._get_last_wednesday();

        // Filter the data to keep only items from last Wednesday onward
        let current_weeks_data = data.filter(item => new Date(item.date) >= lastWednesday);

        return current_weeks_data;
    }

    _updateLocalTransactionTable(data) {
        const tableBody = $('#spending_log_table tbody'); 
        
        tableBody.empty(); 

        data.forEach((item) => {
            

            const $row = $('<tr></tr>');
            $row.append(`<td>${item.dollarValue}</td>`);
            $row.append(`<td>${item.description}</td>`);
            $row.append(`<td>${item.date}</td>`);
            
            
            tableBody.append($row);
        });
    }

    _updateLocalSumDisplay(data) {
        // Calculate total sum
        const total = data.reduce((sum, item) => {
            const dollarValue = parseFloat(item.dollarValue);
            return sum + (!isNaN(dollarValue) ? dollarValue : 0);
        }, 0);

        // Display the total in the HTML element
        $('#total_spent_display_num').text(total.toFixed(2)); // Format total to 2 decimal places
    }

    
   async _update_deletion_table(){

   const snapshot = await get(this.transactionsRef); 

    //* Clear existing rows
    const tableBody = $('#spending_log_table_deleted tbody');
    tableBody.empty();
    console.log(snapshot)
    if ( !snapshot.exists()) {
        tableBody.append('<tr><td colspan="3" style="font-style: italic;">No Data</td></tr>');
        return;
    }

    snapshot.forEach((childSnapshot) => {
        const firebaseKey = childSnapshot.key; //* Get Firebase-generated key
        const transaction = childSnapshot.val();

        let date_of_transaction = new Date(childSnapshot.val().date)

        //* if transaction happened in current week cycle
        if (date_of_transaction > dateManager._get_last_wednesday()){
            //* Destructure transaction data. implicit assigning of vars based on matching names
            const { dollarValue, description, date } = transaction;

            //* Create a new row with a delete button
            const $row = $('<tr class="dlt_btn_row"></tr>');
            const $cell = $('<td></td>'); 
            
            //* Create a delete button with data attributes for firebase key and record ID
            $cell.append(`
                <button class='delete_btn' transaction-key='${firebaseKey}'>
                    $${dollarValue} ${description}, ${date}
                </button>
            `);
            
            $row.append($cell);
            
            //* Append the new row to the table body
            tableBody.append($row);
        }
    });
   }
    



}

export default DatabaseReader