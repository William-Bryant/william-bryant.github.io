class DateManager {
    
    setDefaultDateForTransactionInput(){
        //*
        //* Sets the default date to today in the date-entry field
        //* in format YYYY-MM-DD
        //*
        let today = new Date();
        let formattedDate = this.formatDateYYYYMMDD(today)

        $('#date-entry').val(formattedDate)
    }

    formatDateYYYYMMDD(date) {
        //*
        //* Returns the given date in format YYYY-MM-DD
        //* Called in set_default_date_for_transaction_
        //*

        const year = date.getFullYear();

        //* Get the month (+1 due to 0 index) Pad with 0s until len is 2
        const month = String(date.getMonth() + 1).padStart(2, '0');
        

        //* Get the day. Pad with 0s until len is 2
        const day = String(date.getDate()).padStart(2, '0');
        
        const formattedDate = `${year}-${month}-${day}`;

        return formattedDate
    }

    determinePayPeriodDates(starting_day, frequency) {
        // Map days of the week to numbers (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
        const daysMap = {
            Sunday: 0,
            Monday: 1,
            Tuesday: 2,
            Wednesday: 3,
            Thursday: 4,
            Friday: 5,
            Saturday: 6
        };

        const currentDate = new Date();
        const startingDayIndex = daysMap[starting_day];

        // Calculate days back to the most recent occurrence of starting_day
        const daysSinceStartingDay = (currentDate.getDay() - startingDayIndex + 7) % 7;
        const currentPeriodStart = new Date(currentDate);
        currentPeriodStart.setDate(currentDate.getDate() - daysSinceStartingDay);

        // Determine the end date based on frequency
        let currentPeriodEnd;
        if (frequency === 'weekly') {
            currentPeriodEnd = new Date(currentPeriodStart);
            currentPeriodEnd.setDate(currentPeriodStart.getDate() + 6); // Add 6 days for weekly
        } else if (frequency === 'biweekly') {
            currentPeriodEnd = new Date(currentPeriodStart);
            currentPeriodEnd.setDate(currentPeriodStart.getDate() + 13); // Add 13 days for biweekly
        } else {
            throw new Error('Frequency must be either "weekly" or "biweekly".');
        }

        return {
            currentPeriodStart: currentPeriodStart,
            currentPeriodEnd: currentPeriodEnd
        };
    }

    checkWhichDateFilterBtnsToShow(currentPeriodStart, currentPeriodEnd){
        //* This will remove the 'forward' date filter if date period is in current period
        //* Just a UI thing
        let today = new Date()
        today.setHours(0, 0, 0, 0);
        currentPeriodStart.setHours(0, 0, 0, 0);
        currentPeriodEnd.setHours(0, 0, 0, 0);

        if (today >= currentPeriodStart && today <= currentPeriodEnd){

            $('#filter_date_forwards_btn').css('opacity', 0)
        }
    }

    formatDateForHeaderDisplay(date) {
        //*
        //* Returns the given date in format 'Mon. Xth'
        //*

        //* Get the month (+1 due to 0 index) Pad with 0s until len is 2
        //const month = String(date.getMonth() + 1);
        const month = date.toLocaleString('default', { month: 'short' });

        //* Get the day. Pad with 0s until len is 2
        const day = String(date.getDate());
        
        const formattedDate = `${month}. ${day}${this._getDaySuffix(day)}`;

        return formattedDate
    }

    getTimestamp(){
        //* Will get the current datetime stamp for the db entry
        const now = new Date();

        //* Get the current time in milliseconds since the Unix epoch
        const utcTime = now.getTime() + (now.getTimezoneOffset() * 60000); // Convert offset to milliseconds

        //* Create a new date object in EST (UTC-5)
        const estDate = new Date(utcTime - (8 * 60 * 60 * 1000)); // Subtract 8 hours for EST

        //* Format the date and time as YYYY-MM-DD HH:mm:ss
        const currentDateTime = estDate.toISOString().slice(0, 19).replace('T', ' ');
        
        return currentDateTime
    }

    _getDaySuffix(day) {
        if (day >= 11 && day <= 13) {
            return 'th'; //* Special case for 11, 12, 13
        }
        switch (day % 10) {
            case 1: return 'st';
            case 2: return 'nd';
            case 3: return 'rd';
            default: return 'th';
        }
    }
}

export default DateManager;