"use strict";
var Event = (function () {
    function Event(eventId, adminId, name, description, dateStart, dateEnd, checkStart, checkEnd) {
        this.eventId = eventId;
        this.adminId = adminId;
        this.name = name;
        this.description = description;
        this.dateStart = dateStart;
        this.dateEnd = dateEnd;
        this.checkStart = checkStart;
        this.checkEnd = checkEnd;
    }
    return Event;
}());
exports.Event = Event;
//# sourceMappingURL=event.js.map