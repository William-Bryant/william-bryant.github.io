//Document ready setup
$(document).ready(function() {

    //$('#purchase_entry_page').toggle();
    $('#spending_log_page').toggle();

   
});

//Default values setup
document.addEventListener('DOMContentLoaded', function() {
    get_todays_date()
});

// Methods
function toggleContainers() {
    $('#spending_log_page').toggle();
    $('#purchase_entry_page').toggle();
}

function get_todays_date() {
    const input = document.getElementById('date-entry');
    const today = new Date();
    
    // Format the date as YYYY-MM-DD
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const day = String(today.getDate()).padStart(2, '0');
    
    const formattedDate = `${year}-${month}-${day}`;
    input.value = formattedDate;
}

function triggerSubmission() {
    // Gather the inputs provided by the user
    const mainPurchaseEntry = $('#main_purchase_entry').val();
    const dateEntry = $('#date-entry').val();

    if (inputValidation(mainPurchaseEntry)){
        // Split the string into dollarValue and description
        const { dollarValue, description } = split_input_into_dollar_and_desc(mainPurchaseEntry);

        // Add a row to the table
        addRowToTable(dollarValue, description, dateEntry);

        toggleContainers()

        $('#error-box').hide()
    }

    
}

function inputValidation(inputStr){
    //Trim input
    const trimmedInput = inputStr.trim();
    //Find where the whitespace is
    const spaceIndex = trimmedInput.indexOf(' ');
    //Grab description from string
    const description = trimmedInput.substring(spaceIndex + 1).trim();
    //Valid chars
    const validCharsPattern = /^[a-zA-Z0-9$ ]+$/;
    
    //Set default
    isValid = true
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

function split_input_into_dollar_and_desc(inputStr){

    if (inputStr.charAt(0) === '$') {
        // Remove the dollar sign from the string
        inputStr = inputStr.substring(1);
    }

    // Find the index of the first blank space
    const spaceIndex = inputStr.indexOf(' ');

    // Extract 'dollar value' from the start of the string up to the first space
    const dollarValue = inputStr.substring(0, spaceIndex);

    // Extract 'description' from the first space to the end of the string
    const description = inputStr.substring(spaceIndex + 1);

    return {
        dollarValue: dollarValue,
        description: description
    };
}

function addRowToTable(dollarValue, description, date){
    $('#spending_log_table tbody').append(
        `<tr>
            <td>${dollarValue}</td>
            <td>${description}</td>
            <td>${date}</td>
        </tr>`
    );
}

// Event bindings
$('#log-to-entry-btn').click(toggleContainers);
$('#entry-to-log-btn').click(toggleContainers);
$('#submit_btn').click(triggerSubmission)
