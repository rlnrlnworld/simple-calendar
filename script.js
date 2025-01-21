const currentYear = new Date().getFullYear()
document.querySelector("footer p").textContent = `Copyright © ${currentYear} Calendar. All rights reserved.`

const calendarDates = document.getElementById("calendarDates")
const monthYear = document.getElementById("monthYear")
const prevMonth = document.getElementById("prevMonth")
const nextMonth = document.getElementById("nextMonth")

let currentMonth = new Date().getMonth()
let currentYearCalendar = new Date().getFullYear()

const renderCalendar = (month, year) => {
  const firstDay = new Date(year, month, 1).getDay()
  const lastDate = new Date(year, month + 1, 0).getDate()

  calendarDates.innerHTML = ""

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ]
  monthYear.textContent = `${months[month]} ${year}`

  for (let i=0; i< firstDay; i++) {
    const emptyCell = document.createElement("div")
    calendarDates.appendChild(emptyCell)
  }

  for (let date = 1; date <= lastDate; date++) {
    const dateCell = document.createElement("div")
    dateCell.textContent = date

    const today = new Date()
    if (
      date === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    ) {
      dateCell.classList.add("current-day")
    }

    calendarDates.appendChild(dateCell)
  }
}
prevMonth.addEventListener("click", () => {
  currentMonth--
  if (currentMonth < 0) {
    currentMonth = 11
    currentYearCalendar--
  }
  renderCalendar(currentMonth, currentYearCalendar)
})

nextMonth.addEventListener("click", () => {
  currentMonth++
  if (currentMonth > 11) {
    currentMonth = 0
    currentYearCalendar++
  }
  renderCalendar(currentMonth, currentYearCalendar)
})

renderCalendar(currentMonth, currentYearCalendar)