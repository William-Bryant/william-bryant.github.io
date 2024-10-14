//* Local imports
import DateManager from './DateManager.js'


//* Class declarations
const dateManager = new DateManager();


class DatabaseWriter2 {
    constructor() {
        // Replace these with your actual URL and anon key
        const SUPABASE_URL = 'https://gkzfslszwxcncnoiuksq.supabase.co';
        const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdremZzbHN6d3hjbmNub2l1a3NxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjg4NTM3NjIsImV4cCI6MjA0NDQyOTc2Mn0.dxCStAG5cDqENDHMKLdOkCeqTnDTjN3k-tz_10EJ6b8';

        // Create a Supabase client
        this.supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    }

    async processPurchaseEntry() {
        //* Gather the inputs provided by the user
        let mainPurchaseEntry = $('#main_purchase_entry').val();
        let dateEntry = $('#date-entry').val();
    
        if (this._validateTransactionInput(mainPurchaseEntry)) {
            //* Split the string into dollarValue and description
            const { dollarValue, description } = this._split_input_into_dollar_and_desc(mainPurchaseEntry);
    
            //* Add transaction to database
            //! await this._writeToDatabase(dollarValue, description, dateEntry);
            await this.insertTransaction(dollarValue,description,dateEntry)
            
            $('#error-box').hide();
            return true;  // Return true if entry is successful
        } else {
            return false; // Return false if validation fails
        }
    }

    _validateTransactionInput(inputStr){
        //Trim input
        const trimmedInput = inputStr.trim();
        //Find where the whitespace is
        const spaceIndex = trimmedInput.indexOf(' ');
        //Grab description from string
        const description = trimmedInput.substring(spaceIndex + 1).trim();
        //Grab price for sring
        const price = trimmedInput.substring(0, spaceIndex).trim();
        //Valid chars
        const validCharsPattern = /^[a-zA-Z0-9$ .]+$/;
        const validPricePattern = /^\d+(\.\d+)?$/
        console.log(price)
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
        } else if (!validPricePattern.test(price)) { // Check if price is a valid number
            isValid = false;
            message = 'Price must be a valid number';
        } else if (parseFloat(price) < 0) { // Check if price is non-negative
            isValid = false;
            message = 'Price must be a non-negative number';
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
 
   
   async insertTransaction(price, description, date, category=null) {
    try {
        let timestamp = dateManager._get_timestamp()
        console.log(timestamp)
        const { data, error } = await this.supabase
            .from('Transactions') // Replace with your actual table name
            .insert([
                {
                    Price: price,
                    Description: description,
                    Date: date, // Make sure this date is in the correct format (YYYY-MM-DD)
                    Category: category,
                    Insert_datetime: timestamp
                }
            ]);

        if (error) {
            console.error('Error inserting transaction:', error);
            return null; // You may want to handle errors more gracefully
        } else {
            console.log('Transaction inserted:', data);
            return data; // Return the inserted data if needed
        }
    } catch (error) {
        console.error('Error during insert operation:', error);
    }
}

   
}

export default DatabaseWriter2;
