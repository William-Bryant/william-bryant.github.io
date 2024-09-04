import { ref, push, get } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-database.js";
//* ref: creates a reference to a specific path in the database. 'transactions', i think for this one
//* push: lets you add to database
//* get: used to fetch data, it returns a promise that resolves to a DataSnapshot object
// *     containing the data at the reference
import { db } from './firebaseSetup.js';


class DatabaseManager {
    constructor() {
        this.transactionsRef = ref(db, 'transactions')
    }

    //! WRITES
    processPurchaseEntry() {
        //* Gather the inputs provided by the user
        const mainPurchaseEntry = $('#main_purchase_entry').val();
        const dateEntry = $('#date-entry').val();

        if (this._validateTransactionInput(mainPurchaseEntry)){
            //* Split the string into dollarValue and description
            const { dollarValue, description } = this._split_input_into_dollar_and_desc(mainPurchaseEntry);

            //* Add transaction to database
            this._writeToDatabase(dollarValue, description, dateEntry);

            $('#error-box').hide()
        }

        
    }

    _validateTransactionInput(inputStr){
        //Trim input
        const trimmedInput = inputStr.trim();
        //Find where the whitespace is
        const spaceIndex = trimmedInput.indexOf(' ');
        //Grab description from string
        const description = trimmedInput.substring(spaceIndex + 1).trim();
        //Valid chars
        const validCharsPattern = /^[a-zA-Z0-9$ .]+$/;
        
        //Set default
        let isValid = true
        let message = ''
        if (trimmedInput === '') {// If input is blank
            isValid = false
            message = 'Input cannot be blank'
        } else if (spaceIndex === -1) { // There is no blank space
            isValid = false
            message = 'Input needs description'
        } else if (description === '') {// If there are no characters after the blank space
            isValid = false
            message = 'Input needs description'
        }else if (!validCharsPattern.test(trimmedInput)) {// If there are any characters besides normal letters, numbers, spaces, and the dollar sign
            isValid = false
            message = 'Input contains invalid characters'
        }

        if (isValid == false) {
            $('#error-box').text(message).fadeIn();
            return false
        }

            return true
    

    }

    _split_input_into_dollar_and_desc(inputStr){
         //**
         //* Parses inputStr to get the dollar value and desc of each input. Used to promote
         //* faster/easier inputs for the user.
         //* 
         //* @param {str} [inputStr] - [The user input from $(#'main_purchase_entry')]
         //* @return {int} [dollarValue] [The dollar value of the transacation, parsed from the inputStr]
         //* @return {str} [description] [The description of the transacation, parsed from the inputStr]
         //*/
        if (inputStr.charAt(0) === '$') {
            //* Remove the dollar sign from the string, if it exists
            inputStr = inputStr.substring(1);
        }

        //* Find the index of the first blank space
        const spaceIndex = inputStr.indexOf(' ');

        //* Extract 'dollar value' from the start of the string up to the first space
        const dollarValue = inputStr.substring(0, spaceIndex);

        //* Extract 'description' from the first space to the end of the string
        const description = inputStr.substring(spaceIndex + 1);

        return {
            dollarValue: dollarValue,
            description: description
        };
    }

    async _writeToDatabase(dollarValue, description, date) { //async so you can use await
        const record_for_entry = { dollarValue, description, date };
      
        try {
          await push(this.transactionsRef, record_for_entry); // Wait for data to be pushed
          $('#main_purchase_entry').val(''); // Clear input field after adding data
        } catch (error) {
          console.error('Error adding data:', error); // Handle errors
        }
      }


    //! READS
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

export default DatabaseManager;