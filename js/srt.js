class Srt {
    constructor(srtContent) {
        if (!srtContent)
            return;
        this.srtContent = srtContent;
        this.lines = [];
        this.init();
    }
    init() {
        this.parse();
    }
    parse() {
        var lines = this.srtContent.split('\n\r\n');
        for (var i = 0; i < lines.length; i++) {
            var line = lines[i];
            var origin = line.split('\n');
            if (origin.length < 2) {
                //TODO: throw exception
            }
            else {
                // counter
                var counter = origin[0];
                // time
                var timeLine = origin[1];
                var startText = timeLine.match(/^[0-9][0-9]:[0-9][0-9]:[0-9][0-9],[0-9][0-9][0-9]/)[0];
                var endText = timeLine.match(/\s[0-9][0-9]:[0-9][0-9]:[0-9][0-9],[0-9][0-9][0-9]/)[0].replace(' ', '');
                var startDate = this.stringToDate(startText);
                var endDate = this.stringToDate(endText);
                // subtitle 
                var subtitle = '';
                if (origin.length >= 3) {
                    for (var j = 2; j < origin.length; j++) {
                        subtitle = subtitle + origin[j] + '\n';
                    }
                }
                // push to list
                this.lines.push({
                    counter: counter,
                    subtitle: subtitle,
                    start: this.dateToObject(startDate),
                    end: this.dateToObject(endDate)
                });
            }
        }
    }
    shift(delta, unit) {
        var time, get;
        switch (unit) {
            case 'hours':
                {
                    time = 1000 * 60 * 60;
                    break;
                }
            case 'minutes':
                {
                    time = 1000 * 60;
                    break;
                }
            case 'seconds':
                {
                    time = 1000;
                    break;
                }
            case 'milliseconds':
                {
                    time = 1;
                    break;
                }
        }
        for (var i = 0; i < this.lines.length; i++) {
            var line = this.lines[i];
            var newStartTime = new Date(line.start.time.getTime() + delta * time);
            var newEndTime = new Date(line.end.time.getTime() + delta * time);
            this.updateLineTime(i, newStartTime, newEndTime);
        }
        // update content
        this.updateSrtContent();
    }
    updateLineTime(n, newStartTime, newEndTime) {
        var line = this.lines[n];
        this.lines[n] = {
            counter: line.counter,
            subtitle: line.subtitle,
            start: this.dateToObject(newStartTime),
            end: this.dateToObject(newEndTime)
        };
    }
    updateSrtContent() {
        var srt = '';
        for (var i = 0; i < this.lines.length; i++) {
            var line = this.lines[i];
            srt += line.counter + '\n' +
                line.start.text + ' --> ' + line.end.text + '\n' +
                line.subtitle + '\n\r\n';
        };
        this.srtContent = srt;
    }
    getSrtContent() {
        return this.srtContent;
    }
    // helper functions
    // not main methods
    // used to make everything simple
    stringToDate(string) {
        // turn string format like "00:12:42,321" to date
        var firstColonIndex = string.indexOf(':');
        var secondColonIndex = this.nthChar(string, ':', 2);
        var commaIndex = string.indexOf(',');
        var hour = string.substring(0, firstColonIndex);
        var minute = string.substring(firstColonIndex + 1, secondColonIndex);
        var second = string.substring(secondColonIndex + 1, commaIndex);
        var msecond = string.substring(commaIndex + 1);
        return new Date(1970, 0, 1, hour, minute, second, msecond);
    }
    dateToObject(date) {
        return {
            text: (date.getHours() < 10 ? '0' : '') + date.getHours() + ':' + (date.getMinutes() < 10 ? '0' : '') + date.getMinutes() + ':' + (date.getSeconds() < 10 ? '0' : '') + date.getSeconds() + ',' + (date.getMilliseconds() < 10 ? '00' : '') + ((date.getMilliseconds() < 100 && date.getMilliseconds() >= 10) ? '0' : '') + date.getMilliseconds(),
            time: date,
            hours: date.getHours(),
            minutes: date.getMinutes(),
            seconds: date.getSeconds(),
            milliseconds: date.getMilliseconds(),
            timeInSeconds: Date.UTC(1970, 0, 1, date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds())/1000
        };
    }
    nthChar(string, character, n) {
        // find the index of the nth char in string
        var count = 0, i = 0;
        while (count < n && (i = string.indexOf(character, i) + 1)) {
            count++;
        }
        if (count == n)
            return i - 1;
        return NaN;
    }
}

