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
        const month = String(date.getMonth() + 1);

        //* Get the day. Pad with 0s until len is 2
        const day = String(date.getDate());
        
        const formattedDate = `${month}/${day}`;

        return formattedDate
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

        const content = `${formattedPayCycleStart} - ${formattedPayCycleEnd}`;
        $('#date_display').html(content);
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