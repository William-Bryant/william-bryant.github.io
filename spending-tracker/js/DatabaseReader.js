import { ref, get } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-database.js";
//* ref: creates a reference to a specific path in the database. 'transactions', i think for this one
//* get: used to fetch data, it returns a promise that resolves to a DataSnapshot object
//*     containing the data at the reference
import { db } from './firebaseSetup.js';

class DatabaseReader {
    constructor() {
        this.transactionsRef = ref(db, 'transactions')
    }
    async updateLocalDisplays() {
        try {
            //* Read data from the database. 'data' is an array
            const data = await this._readDatabase(); // Await the promise to get the data;

            //* Filter data to only get this week's data
            //TODO Put method here

            //* Update the purchase log
            this._updateLocalTransactionTable(data);
            
            //* Update the sum display
            this._updateLocalSumDisplay(data);
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

    _updateLocalTransactionTable(data) {
        const tableBody = $('#spending_log_table tbody'); // Select the table body using jQuery
        
        tableBody.empty(); // Clear existing rows

        data.forEach((item) => {
            // Create a new row and cells using jQuery
            const $row = $('<tr></tr>');
            $row.append(`<td>${item.dollarValue}</td>`);
            $row.append(`<td>${item.description}</td>`);
            $row.append(`<td>${item.date}</td>`);
            
            // Append the new row to the table body
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
        $('#total_spent_display_char').text(total.toFixed(2)); // Format total to 2 decimal places
    }

}

export default DatabaseReader