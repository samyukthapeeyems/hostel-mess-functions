export function _date(){
    let _dateObj  = {}
    _dateObj.currentDate = new Date();
    _dateObj.firstDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    _dateObj.lastDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    return _dateObj;
}