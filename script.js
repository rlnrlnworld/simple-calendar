import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js"

const db = getFirestore()

const calendarDates = document.getElementById("calendarDates")
const monthYear = document.getElementById("monthYear")
const prevMonth = document.getElementById("prevMonth")
const nextMonth = document.getElementById("nextMonth")
const eventForm = document.getElementById("eventForm")
const eventList = document.getElementById("eventList")
const eventListContent = document.getElementById("eventListContent")
const selectEventDate = document.getElementById("selectEventDate")


let currentMonth = new Date().getMonth()
let currentYearCalendar = new Date().getFullYear()

const getEvents = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "events"))
    const events = []
    querySnapshot.forEach((doc) => {
      events.push(doc.data())
    })
    return events
  } catch (err) {
    console.error("Error fetching events:", err)
    return []
  }
}

const saveEvents = async (date, title, description) => {
  try {
    await addDoc(collection(db, "events"), {
      date,
      title,
      description,
      createdAt: new Date()
    })
    renderCalendarWithEvents(currentMonth, currentYearCalendar)
  } catch (err) {
    console.error("Error saving event:", err)
    alert("Failed to save the event.")
  }
}

const renderEventsForDate = (events, date) => {
  eventListContent.innerHTML = ""
  const [year, month, day] = date.split("-")
  const formattedDate = `${month}.${day}`
  selectEventDate.innerHTML = formattedDate

  const dateEvents = events.filter(event => event.date === date)
  if (dateEvents.length === 0) {
    eventListContent.innerHTML = "<div style=\"font-size: 0.9rem;\">등록된 일정이 없습니다.</div>"
  } else {
    dateEvents.forEach(event => {
      const eventItem = document.createElement("div")
      eventItem.id = "eventItem"
      eventItem.innerHTML = `<strong>📌 ${event.title}</strong> <span>${event.description}</span>`
      eventListContent.appendChild(eventItem)
    })
  }
}

const renderCalendarWithEvents = async (month, year) => {
  const firstDay = new Date(year, month, 1).getDay()
  const lastDate = new Date(year, month + 1, 0).getDate()
  const events = await getEvents()

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

  for (let i = 0; i < firstDay; i++) {
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

    const currentDate = `${year}-${String(month + 1).padStart(2, "0")}-${String(
      date
    ).padStart(2, "0")}`
    const dateEvents = events.filter((event) => event.date === currentDate)

    if (dateEvents.length > 0) {
      const eventIndicator = document.createElement("span")
      eventIndicator.textContent = "•"
      eventIndicator.classList.add("event-indicator")
      dateCell.appendChild(eventIndicator)
    }

    dateCell.addEventListener("click", () => {
      renderEventsForDate(events, currentDate)
    })

    calendarDates.appendChild(dateCell)
  }
}

prevMonth.addEventListener("click", () => {
  currentMonth--
  if (currentMonth < 0) {
    currentMonth = 11
    currentYearCalendar--
  }
  renderCalendarWithEvents(currentMonth, currentYearCalendar)
})

nextMonth.addEventListener("click", () => {
  currentMonth++
  if (currentMonth > 11) {
    currentMonth = 0
    currentYearCalendar++
  }
  renderCalendarWithEvents(currentMonth, currentYearCalendar)
})

eventForm.addEventListener("submit", (e) => {
  e.preventDefault()
  const date = document.getElementById("eventDate").value
  const title = document.getElementById("eventTitle").value
  const memo = document.getElementById("eventMemo").value

  if (date && title) {
    saveEvents(date, title, memo)
    eventForm.reset()
  } else {
    alert("모든 필드를 입력해주세요!")
  }
})

renderCalendarWithEvents(currentMonth, currentYearCalendar)