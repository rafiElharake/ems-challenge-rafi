import { Form, redirect, useLoaderData,type ActionFunction,useActionData} from "react-router";
import { getDB } from "~/db/getDB";
export async function loader({ params }:  { params: { timesheetId: string } }) {
  const db = await getDB();
  const timesheet = await db.get("SELECT * FROM timesheets WHERE id = ?", [params.timesheetId]);
  const employees = await db.all('SELECT id, full_name FROM employees');

  if (!timesheet) {
    throw new Response("timesheet not found", { status: 404 });
  }

  return { timesheet, employees };
}
export const action: ActionFunction = async ({ request, params }) => {
  const formData = await request.formData();
  const start_time = formData.get("start_time");
  const end_time = formData.get("end_time");
  const summary = formData.get("summary");
  const employee_id = formData.get("employee_id"); 
  if (!start_time || !end_time || new Date(start_time.toString()) >= new Date(end_time.toString())) {
    return { error: "Start time must be before end time." };
  }
  const db = await getDB();
  await db.run(
    `UPDATE timesheets SET start_time = ?, end_time = ?, summary = ?, employee_id = ? WHERE id = ?`,
    [start_time, end_time, summary, employee_id,params.timesheetId]
  );

  return redirect("/timesheets");
};
export default function TimesheetPage() {
  const { timesheet } = useLoaderData();
  const { employees } = useLoaderData();
  const actionData = useActionData();
  return (
    <div>
      <div>
      <h1>Edit timesheet</h1>
      {actionData?.error && <p style={{ color: "red" }}>{actionData.error}</p>}

      <Form method="post">
        <div>
          <label htmlFor="start_time">Start Date</label>
          <input type="datetime-local" name="start_time" id="start_time" defaultValue={timesheet.start_time} required />
        </div>
        <div>
          <label htmlFor="end_time">End Date</label>
          <input type="datetime-local" name="end_time" id="end_time" defaultValue={timesheet.end_time} required />
        </div>
        <div>
          <label htmlFor="summary">Summary</label>
          <input type="text" name="summary" id="summary" defaultValue={timesheet.summary} />
        </div>
        <div>
        <label htmlFor="summary">Employee</label>
        <select name="employee_id" id="employee_id" defaultValue={timesheet.employee_id} required>
            <option value="">Select Employee</option>
            {employees.map((employee: any) => (
              <option key={employee.id} value={employee.id}>
                {employee.full_name}
              </option>
            ))}
          </select>
           </div> 
        <button type="submit">Save Changes</button>
      </Form> 
      </div>
      <ul>
        <li><a href="/timesheets">Timesheets</a></li>
        <li><a href="/timesheets/new">New Timesheet</a></li>
        <li><a href="/employees/">Employees</a></li>
      </ul>
    </div>
  )
}
 