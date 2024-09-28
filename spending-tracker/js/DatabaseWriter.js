import { ref, push, remove} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-database.js";
//* ref: creates a reference to a specific path in the database. 'transactions', i think for this one
//* push: lets you add to database
//* get: used to fetch data, it returns a promise that resolves to a DataSnapshot object
// *     containing the data at the reference
import { db } from './firebaseSetup.js';


class DatabaseWriter {
    constructor() {
        this.transactionsRef = ref(db, 'transactions')
    }

    //! WRITES
    processPurchaseEntry() {
        //* Gather the inputs provided by the user
        const mainPurchaseEntry = $('#main_purchase_entry').val();
        const dateEntry = $('#date-entry').val();

        if (this._validateTransactionInput(mainPurchaseEntry) == true){
            //* Split the string into dollarValue and description
            const { dollarValue, description } = this._split_input_into_dollar_and_desc(mainPurchaseEntry);


            //* Add transaction to database
            this._writeToDatabase( dollarValue, description, dateEntry);

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
            $('#error-box').text(message).fadeIn().delay(300).fadeOut();
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
         //*
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
        const record_for_entry = {dollarValue, description, date };
      
        try {
          await push(this.transactionsRef, record_for_entry); // Wait for data to be pushed
          $('#main_purchase_entry').val(''); // Clear input field after adding data
        } catch (error) {
          console.error('Error adding data:', error); // Handle errors
        }
      }

    async _deleteRecordFromDatabase(transactionKey){
        const recordRef = ref(db, `transactions/${transactionKey}`);
        console.log(`recordRef: ${recordRef}`)
        return remove(recordRef)
            .then(() => {
                console.log(`Record with ID ${transactionKey} deleted successfully.`);
            })
            .catch((error) => {
                console.error(`Error deleting record: ${error}`);
            });
    }

}

export default DatabaseWriter;