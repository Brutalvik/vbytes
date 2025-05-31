"use client"
import { useMemo } from "react";
import { CalendarViewProps, Task } from "./types";

const CalendarView: React.FC<CalendarViewProps> = ({
  tasks,
  selectedDate,
  setSelectedDate,
  themeClasses,
}) => {
  const today = useMemo(() => new Date(), []);
  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth();

  const firstDayOfMonth = useMemo(() => new Date(year, month, 1), [year, month]);
  const lastDayOfMonth = useMemo(() => new Date(year, month + 1, 0), [year, month]);
  const daysInMonth = lastDayOfMonth.getDate();
  const startDayOfWeek = firstDayOfMonth.getDay(); // 0 (Sun) - 6 (Sat)

  const tasksByDate = useMemo(() => {
    const map = new Map();
    tasks.forEach((task: Task) => {
      if (task.dueDate) {
        const dateStr = task.dueDate.split("T")[0]; // YYYY-MM-DD
        if (!map.has(dateStr)) map.set(dateStr, []);
        map.get(dateStr).push(task);
      }
    });
    return map;
  }, [tasks]);

  const calendarDays = [];
  for (let i = 0; i < startDayOfWeek; i++) {
    calendarDays.push(<div key={`empty-prev-${i}`} className="calendar-day other-month"></div>);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const currentDate = new Date(year, month, day);
    const dateString = currentDate.toISOString().split("T")[0];
    const tasksOnThisDay = tasksByDate.get(dateString) || [];
    const isSelected = selectedDate.toDateString() === currentDate.toDateString();
    const isToday = today.toDateString() === currentDate.toDateString();

    let dayClasses = `calendar-day ${themeClasses.border} border text-sm`;
    if (tasksOnThisDay.length > 0)
      dayClasses += ` has-task font-bold ${themeClasses.bg === "app-bg-light" ? "bg-blue-200" : "bg-blue-700"}`;
    if (isSelected) dayClasses += ` selected ${themeClasses.btnPrimary}`;
    if (isToday && !isSelected)
      dayClasses += ` ${themeClasses.bg === "app-bg-light" ? "bg-blue-100" : "bg-blue-900"}`;

    calendarDays.push(
      <div key={day} className={dayClasses} onClick={() => setSelectedDate(currentDate)}>
        {day}
      </div>
    );
  }
  // Fill remaining cells for grid structure if month doesn't end on Saturday
  const totalCells = startDayOfWeek + daysInMonth;
  const remainingCells = (7 - (totalCells % 7)) % 7;
  for (let i = 0; i < remainingCells; i++) {
    calendarDays.push(<div key={`empty-next-${i}`} className="calendar-day other-month"></div>);
  }

  const selectedDateString = selectedDate.toISOString().split("T")[0];
  const tasksForSelectedDate = tasksByDate.get(selectedDateString) || [];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => setSelectedDate(new Date(year, month - 1, selectedDate.getDate()))}
          className={`p-2 rounded-md ${themeClasses.btnSecondary}`}
        >
          <i className="fas fa-chevron-left"></i>
        </button>
        <h3 className={`text-lg font-semibold ${themeClasses.text}`}>
          {selectedDate.toLocaleString("default", { month: "long" })} {year}
        </h3>
        <button
          onClick={() => setSelectedDate(new Date(year, month + 1, selectedDate.getDate()))}
          className={`p-2 rounded-md ${themeClasses.btnSecondary}`}
        >
          <i className="fas fa-chevron-right"></i>
        </button>
      </div>
      <div className={`calendar ${themeClasses.text}`}>
        {["S", "M", "T", "W", "T", "F", "S"].map((d) => (
          <div
            key={d}
            className={`font-semibold text-center text-xs ${themeClasses.text} opacity-70`}
          >
            {d}
          </div>
        ))}
        {calendarDays}
      </div>
      <div className="mt-6">
        <h4 className={`font-semibold ${themeClasses.text} mb-2`}>
          Tasks for{" "}
          {selectedDate.toLocaleDateString("en-CA", {
            weekday: "short",
            month: "long",
            day: "numeric",
          })}
          :
        </h4>
        {tasksForSelectedDate.length > 0 ? (
          tasksForSelectedDate.map((task: Task) => (
            <div
              key={task.id}
              className={`p-2 rounded ${themeClasses.card} ${themeClasses.border} border mb-2 text-sm ${task.completed ? "opacity-60 line-through" : ""}`}
            >
              {task.title}
            </div>
          ))
        ) : (
          <p className={`${themeClasses.text} opacity-70 text-sm`}>No tasks for this day.</p>
        )}
      </div>
    </div>
  );
};

export default CalendarView
