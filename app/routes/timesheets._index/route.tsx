import { useLoaderData } from "react-router";
import { useState } from "react";
import { getDB } from "~/db/getDB";
import { useCalendarApp, ScheduleXCalendar } from "@schedule-x/react";
import {
  createViewDay,
  createViewWeek,
  createViewMonthGrid,
} from "@schedule-x/calendar";
import { createEventsServicePlugin } from "@schedule-x/events-service";

import "@schedule-x/theme-default/dist/index.css";
export async function loader() {
  const db = await getDB();
  const timesheetsAndEmployees = await db.all(
    "SELECT timesheets.*, employees.full_name, employees.id AS employee_id FROM timesheets JOIN employees ON timesheets.employee_id = employees.id"
  );
  const employees = await db.all("SELECT id, full_name FROM employees");

  return { timesheetsAndEmployees, employees };
}

export default function TimesheetsPage() {
  const { timesheetsAndEmployees } = useLoaderData();
  const { employees } = useLoaderData();

  const eventsService = useState(() => createEventsServicePlugin())[0];
  const [isTableView, setIsTableView] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState("All");

  const formatTime = (dateString:any) => {
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16).replace("T", " "); 
  };

  const calendar = useCalendarApp({
    views: [createViewDay(), createViewWeek(), createViewMonthGrid()],
    events: timesheetsAndEmployees.map((timesheet:any) => ({
      id: String(timesheet.id),
      title: `Shift - ${timesheet.full_name}`,
      start: formatTime(timesheet.start_time),
      end: formatTime(timesheet.end_time),
    })),
    plugins: [eventsService],
  });

const filteredTimesheets = timesheetsAndEmployees.filter((timesheet: any) =>
  (timesheet.summary?.toLowerCase().includes(searchQuery.toLowerCase()) || (searchQuery === "" && !timesheet.summary)) &&
  (selectedEmployee === "All" || timesheet.employee_id === parseInt(selectedEmployee))
);

  return (
    <div>
      <div>
        <button onClick={() => setIsTableView(true)}>Table View</button>
        <button onClick={() => setIsTableView(false)}>Calendar View</button>
      </div>
      
      <div>
        <input
          type="text"
          placeholder="Search by summary"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
<select onChange={(e) => setSelectedEmployee(e.target.value)} value={selectedEmployee}>
  <option value="All">All Employees</option>
  {employees.map((employee: any) => (
    <option key={employee.id} value={employee.id}>
      {employee.full_name}
    </option>
  ))}
</select>
      </div>

      {isTableView ? (
        <table border={1} cellPadding={8} cellSpacing={0}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Employee</th>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Summary</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTimesheets.map((timesheet:any) => (
              <tr key={timesheet.id}>
                <td>{timesheet.id}</td>
                <td>
                  {timesheet.full_name} (ID: {timesheet.employee_id})
                </td>
                <td>{timesheet.start_time.replace("T", " ")}</td>
                <td>{timesheet.end_time.replace("T", " ")}</td>
                <td>{timesheet.summary}</td>
                <td>
                  <a href={`/timesheets/${timesheet.id}`}>Edit</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div>
          <ScheduleXCalendar calendarApp={calendar} />
        </div>
      )}

      <hr />
      <ul>
        <li>
          <a href="/timesheets/new">New Timesheet</a>
        </li>
        <li>
          <a href="/employees">Employees</a>
        </li>
      </ul>
    </div>
  );
}
