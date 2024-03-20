function getNow() {
  const thisYear = new Date().getFullYear();
  const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const thisMonth = month[new Date().getMonth()];
  const today = new Date().getDate() > 9 ? new Date().getDate() : "0" + new Date().getDate();
  const thisHour = new Date().getHours() > 9 ? new Date().getHours() : "0" + new Date().getHours();
  const thisMinute = new Date().getMinutes() > 9 ? new Date().getMinutes() : "0" + new Date().getMinutes();
  const thisSecond = new Date().getSeconds() > 9 ? new Date().getSeconds() : "0" + new Date().getSeconds();
  const thisMilliSeconds = new Date().getMilliseconds();

  return `${thisYear}_${thisMonth}_${today}_${thisHour}_${thisMinute}_${thisSecond}_${thisMilliSeconds}`;
}

export default getNow;
