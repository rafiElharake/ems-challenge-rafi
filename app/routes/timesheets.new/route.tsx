import { useLoaderData, Form, redirect, useActionData } from "react-router";
import { getDB } from "~/db/getDB";
interface Employee {
  id: number;
  full_name: string;
}
export async function loader() {
  const db = await getDB();
  const employees = await db.all('SELECT id, full_name FROM employees');
  return { employees };
}

import type { ActionFunction } from "react-router";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const employee_id = formData.get("employee_id");  
  const start_time = formData.get("start_time");
  const end_time = formData.get("end_time");
  const summary = formData.get("summary");  
  if (!start_time || !end_time || new Date(start_time.toString()) >= new Date(end_time.toString())) {
    return { error: "Start time must be before end time." };
  }

  const db = await getDB();
  await db.run(
    'INSERT INTO timesheets (employee_id, start_time, end_time, summary) VALUES (?, ?, ?, ?)',
    [employee_id, start_time, end_time, summary || null] 
  );

  return redirect("/timesheets");
}

export default function NewTimesheetPage() {
  const { employees } = useLoaderData();  
  const actionData = useActionData();
  return (
    <div>
      <h1>Create New Timesheet</h1>
      {actionData?.error && <p style={{ color: "red" }}>{actionData.error}</p>}

      <Form method="post">
        <div>
          <label htmlFor="employee_id">Employee</label>
          <select name="employee_id" id="employee_id" required>
            <option value="">Select Employee</option>
            {employees.map((employee: Employee) => (
              <option key={employee.id} value={employee.id}>
                {employee.full_name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="start_time">Start Time</label>
          <input type="datetime-local" name="start_time" id="start_time" required />
        </div>
        <div>
          <label htmlFor="end_time">End Time</label>
          <input type="datetime-local" name="end_time" id="end_time" required />
        </div>
        <div>
          <label htmlFor="summary">Summary (Optional)</label>
          <textarea name="summary" id="summary" rows={4} placeholder="Enter a brief summary of the work"></textarea>
        </div>
        <button type="submit">Create Timesheet</button>
      </Form>
      <hr />
      <ul>
        <li><a href="/timesheets">Timesheets</a></li>
        <li><a href="/employees">Employees</a></li>
      </ul>
    </div>
  );
}
