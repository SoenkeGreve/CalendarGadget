/**
 * Created by Sönke Greve on 13.01.2015.
 */


function loadPrefs(){

    GLOBAL

}

function loadEvents(year){



    var startDate = {year: year, month: 1, date : 1, hour : 0, minute:0, second: 0};
    var endDate = {year: parseInt(year), month: 1, date : 1, hour : 0, minute:0, second: 0};
    google.calendar.read.getEvents(eventCallback, ["david@gmail.com"], startDate, endDate);
}

function eventCallback(response) {
    var daveResponse = response[0];
    if ('error' in response[0]) {
        alert('Something went wrong');
        return;
    }

    var events = response[0]['events'];
    var out = '';
    for(var i = 0; i < events.length; ++i) {
        var e = events[i];
        if ('title' in e) {
            out += 'Title = ' + e.title + '\n';
        }
    }
    alert(out);
}

