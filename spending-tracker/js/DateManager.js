class DateManager {
    

    set_default_date_for_input(){
        let today = new Date();
        let formattedDate = this._format_date_yyyymmdd(today)

        $('#date-entry').val(formattedDate)
    }

    _format_date_yyyymmdd(date) {
        //*
        //* Returns the given date in format YYYY-MM-DD
        //*
    
        const year = date.getFullYear();

        //* Get the month (+1 due to 0 index) Pad with 0s until len is 2
        const month = String(date.getMonth() + 1).padStart(2, '0');
        

        //* Get the day. Pad with 0s until len is 2
        const day = String(date.getDate()).padStart(2, '0');
        
        const formattedDate = `${year}-${month}-${day}`;

        return formattedDate
    }

    _format_date_mmdd(date) {
        //*
        //* Returns the given date in format YYYY-MM-DD
        //*

        //* Get the month (+1 due to 0 index) Pad with 0s until len is 2
        //const month = String(date.getMonth() + 1);
        const month = date.toLocaleString('default', { month: 'short' });

        //* Get the day. Pad with 0s until len is 2
        const day = String(date.getDate());
        
        const formattedDate = `${month}. ${day}${this._get_day_suffix(day)}`;

        return formattedDate
    }

    _get_day_suffix(day) {
        if (day >= 11 && day <= 13) {
            return 'th'; // Special case for 11, 12, 13
        }
        switch (day % 10) {
            case 1: return 'st';
            case 2: return 'nd';
            case 3: return 'rd';
            default: return 'th';
        }
    }

    get_date_range_for_current_week() {
        let today = new Date()
        let payCycleStart = this._get_last_wednesday();

        //* End of cycle is 6 days after the start
        let payCycleEnd = new Date(payCycleStart);
        payCycleEnd.setDate(payCycleStart.getDate() + 6);

        let formattedPayCycleStart = this._format_date_mmdd(payCycleStart)
        let formattedPayCycleEnd = this._format_date_mmdd(payCycleEnd)

        console.log(formattedPayCycleEnd)

        $('#cycle_start').html(formattedPayCycleStart)
        $('#cycle_end').html(formattedPayCycleEnd)
}

    _get_last_wednesday() {
        let today = new Date()
        const dayOfWeek = today.getDay();
        const lastWednesday = new Date();

        //* Calculate days back to last Wednesday (Sunday is 0)
        const daysSinceWednesday = (dayOfWeek + 4) % 7; //
        lastWednesday.setDate(today.getDate() - daysSinceWednesday);

        // Reset time to 00:00:00 for accurate comparison
        lastWednesday.setHours(0, 0, 0, 0);


        return lastWednesday;
    }

}

export default DateManager;