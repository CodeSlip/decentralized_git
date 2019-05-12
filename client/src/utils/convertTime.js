// convert from UNIX to today MM/DD/YYYY HH:MM

const unixToRegTimeConvert = unixTimestamp => {
  const t = new Date(unixTimestamp * 1000);
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const dayArr = [ 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const day = dayArr[t.getDay()];
  const month = months[t.getMonth()];
  const date = t.getDate();
  const year = t.getYear() + 1900; // adjust to julian calendar?
  const hour = t.getHours(); // adjust to 24 hours
  let mins = String(t.getMinutes()).length === 1 ? '0' + String(t.getMinutes()) : String(t.getMinutes());
  let sec = String(t.getSeconds()).length === 1 ? '0' + String(t.getSeconds()) : String(t.getSeconds());

  const pmOrAm = t.getHours() >= 12 ? 'PM' : 'AM';
  const time = `${day} ${month} ${date}, ${year} at ${hour}:${mins}:${sec} ${pmOrAm}`;

  return time;
}

export default unixToRegTimeConvert;