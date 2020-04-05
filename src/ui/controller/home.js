class Calender {
    constructor() {
        this.currentDT = new Date();
        this.currentMonth = this.currentDT.getMonth();
        this.currentYear = this.currentDT.getFullYear();
        this.months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        this.monthAndYear = document.getElementById("monthAndYear");
        this.showCalendar(this.currentMonth, this.currentYear);
        //
        this.times = [];
        let fromtime = document.getElementById('from-time');
        let totime = document.getElementById('to-time');
        for (let i = 0; i <= 23; i++) {
            let text = (i < 10 ? `0${i}:00` : `${i}:00`);
            fromtime.options.add(new Option(text, text));
            totime.options.add(new Option(text, text));
            this.times.push(text);
            text = (i < 10 ? `0${i}:30` : `${i}:30`);
            fromtime.options.add(new Option(text, text));
            totime.options.add(new Option(text, text));
            this.times.push(text);
        }
        totime.options.remove(0);
        totime.options.add(new Option("24:00", "24:00"));
        this.times.push("24:00");
        // 
    }

    next() {
        this.currentYear = (this.currentMonth === 11) ? this.currentYear + 1 : this.currentYear;
        this.currentMonth = (this.currentMonth + 1) % 12;
        this.showCalendar(this.currentMonth, this.currentYear);
    }

    previous() {
        this.currentYear = (this.currentMonth === 0) ? this.currentYear - 1 : this.currentYear;
        this.currentMonth = (this.currentMonth === 0) ? 11 : this.currentMonth - 1;
        this.showCalendar(this.currentMonth, this.currentYear);
    }

    // jump() {
    //     this.currentYear = parseInt(this.selectedYear.value);
    //     this.currentMonth = parseInt(this.selectedMonthvalue);
    //     this.showCalendar(this.currentMonth, this.currentYear);
    // }

    showCalendar(month, year) {

        let firstDay = (new Date(year, month)).getDay();

        let tbl = document.getElementById("calendar-body"); // body of the calendar

        // clearing all previous cells
        tbl.innerHTML = "";

        // filing data about month and in the page via DOM.
        this.monthAndYear.innerHTML = this.months[month] + " " + year;
        this.monthAndYear.accessKey = `${month}_${year}`;
        // this.selectedYear.value = year;
        // this.selectedMonth.value = month;

        // creating all cells
        let date = 1;
        for (let i = 0; i < 6; i++) {
            // creates a table row
            let row = document.createElement("tr");

            let cell, cellText;
            //creating individual cells, filing them up with data.
            for (let j = 0; j < 7; j++) {
                if (i === 0 && j < firstDay) {
                    cell = document.createElement("td");
                    cellText = document.createTextNode("");
                    cell.appendChild(cellText);
                    row.appendChild(cell);
                } else if (date > this.daysInMonth(month, year)) {
                    break;
                } else {
                    cell = document.createElement("td");
                    //cellText = document.createTextNode(date);
                    cell.style.cursor = "pointer";
                    cell.onclick = this.cellClick;
                    let today = new Date();
                    if (date === today.getDate() && year === today.getFullYear() && month === today.getMonth()) {
                        cell.classList.add("bg-info");
                        cell.classList.add("selected-date");
                        let bookingDT = new Date(today.getFullYear(), today.getMonth(), today.getDate());
                        this.list(bookingDT.toISOString());
                    } // color today's date
                    //cell.appendChild(cellText);
                    cell.innerText = date;
                    row.appendChild(cell);
                    date++;
                }


            }

            tbl.appendChild(row); // appending each row into calendar body.
        }

    }

    /* When the Date() function is given a day number that is greater than the number of days 
    in the given month of the given year, it wraps the date into the next month. 
    The getDate() function returns the day of the month, starting from the beginning of the month
    that the date is in. So, day 32 of Febreuary is considered to be day 4 of March. Subtracting 4 from 
    32 gives the correct number of days in February!
    */
    daysInMonth(iMonth, iYear) {
        return 32 - new Date(iYear, iMonth, 32).getDate();
    }

    fromTimeChange() {
        let totime = document.getElementById('to-time');
        let fromtime = document.getElementById('from-time').value;
        let validTotime = this.times.filter(item => item > fromtime);
        totime.options.length = 0;
        validTotime.forEach(item => {
            let opt = new Option(item, item);
            totime.options.add(opt);
        });
    }
    cellClick(event) {
        $('#calendar td').removeClass('bg-info');
        $('#calendar td').removeClass('selected-date');
        let monthYear = document.getElementById('monthAndYear');
        let month = monthYear.accessKey.split('_')[0];
        let year = monthYear.accessKey.split('_')[1];
        let date = event.toElement.innerText;
        event.toElement.classList.add('bg-info');
        event.toElement.classList.add('selected-date');
        let currentDT =  new Date();
        let bookingDT= new Date(year, month, date).toISOString()
        calender.list(bookingDT);
    }
    list(bookingDT) {
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function (err, data) {
            if (this.readyState == 4 && this.status == 200) {
                calender.listAppointments(this.response);
                let errMsg = document.getElementById("error-message")
                errMsg.innerHTML = this.statusText;
                errMsg.hidden = true;
                document.getElementById("book-time-modal").close();
            }
            if (this.status != 200 && this.status != 0) {
                let errMsg = document.getElementById("error-message")
                errMsg.innerHTML = this.statusText;
                errMsg.hidden = false;
                return;
            }
        };
        xhttp.open("POST", `/appointment/list`, true);
        xhttp.setRequestHeader("Content-type", "application/json");

        let body = JSON.stringify({
            date: bookingDT
        });

        xhttp.send(body);
    }
    book() {
        let bookNotes = document.getElementById('book-notes').value;
        let fromtime = document.getElementById('from-time').value;
        let totime = document.getElementById('to-time').value;
        let fromhour = parseInt(fromtime.split(":")[0]);
        let frommin = parseInt(fromtime.split(":")[1]);
        let tohour = parseInt(totime.split(":")[0]);
        let tomin = parseInt(totime.split(":")[1]);
        let date = document.getElementsByClassName('selected-date')[0].innerText;
        let month = document.getElementById('monthAndYear').accessKey.split('_')[0];
        let year = document.getElementById('monthAndYear').accessKey.split('_')[1];
        let bookingDT = new Date(year, month, date);
        let fromDT = new Date(bookingDT);
        fromDT.setHours(fromhour, frommin, 0, 0);
        let toDT = new Date(bookingDT);
        toDT.setHours(tohour, tomin, 0, 0);
        let body = {
            date: bookingDT.toISOString(),
            fromDate: fromDT.toISOString(),
            toDate: toDT.toISOString(),
            bookNotes: bookNotes
        }
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function (err, data) {
            if (this.readyState == 4 && this.status == 200) {
                calender.listAppointments(this.response);
                let errMsg = document.getElementById("error-message")
                errMsg.innerHTML = this.statusText;
                errMsg.hidden = true;
                $('#book-time-modal').modal('hide');
            }
            if (this.status != 200 && this.status != 0) {
                let errMsg = document.getElementById("error-message")
                errMsg.innerHTML = this.statusText;
                errMsg.hidden = false;
                return;
            }
        };
        xhttp.open("POST", `/appointment/book`, true);
        xhttp.setRequestHeader("Content-type", "application/json");
        xhttp.send(JSON.stringify(body));
    }

    listAppointments(dataArr) {
        let bookings = document.getElementById("bookings");
        bookings.innerHTML = "";
        dataArr = JSON.parse(dataArr);
        dataArr.sort((a, b) => {
            if (a.fromDate > b.fromDate) {
                return 1
            } else {
                return -1
            }
        });
        dataArr.forEach(item => {
            let li = document.createElement("li");
            li.classList.add('list-group-item');
            let div1 = document.createElement('div');
            let fromTime = new Date(item.fromDate).toLocaleTimeString();
            let toTime = new Date(item.toDate).toLocaleTimeString();
            div1.innerHTML = `<b>FROM:</b> ${fromTime} <b>TO:</b> ${toTime}`
            let div2 = document.createElement('div');
            div2.innerText = `NOTES: ${item.bookNotes}`;
            li.appendChild(div1);
            li.appendChild(div2);
            bookings.appendChild(li);
        });
    }
}

var calender = new Calender();

var logout = function () {
    var date = new Date();
    date.setTime(date.getTime() + (1 * 24 * 60 * 60 * 1000));
    document.cookie = 'auth-token' + "=" + "" + "; expires=" + date.toGMTString();
    window.location.pathname = '/login';
}