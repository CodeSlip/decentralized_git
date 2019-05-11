// convert from UNIX to today MM/DD/YYYY HH:MM

const unixToRegTimeConvert = unixTimestamp => {
  const t = new Date(unixTimestamp * 1000);
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const dayArr = [ 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const day = dayArr[t.getDay()];
  const month = months[t.getMonth()];
  const date = t.getDate();
  const year = t.getYear() + 1900; // adjust to julian calendar?
  const hour = 24 - t.getHours(); // adjust to 24 hours
  const mins = t.getMinutes();
  const sec = t.getSeconds();
  const time = `${day}, ${date} ${month} ${year} ${hour}:${mins}:${sec}`;

  return time;
}

export default unixToRegTimeConvert;