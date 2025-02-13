import { Form, redirect, useActionData, type ActionFunction } from "react-router";
import { getDB } from "~/db/getDB";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const full_name = formData.get("full_name");
  const email = formData.get("email");
  const phone = formData.get("phone");
  const date_of_birth = formData.get("date_of_birth");
  const job_title = formData.get("job_title");
  const department = formData.get("department");
  const salary = formData.get("salary");
  const dob = new Date(date_of_birth as string);
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  const dayDiff = today.getDate() - dob.getDate();
 
  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0))  
    age--; 
 
  if (age < 18) {
    return { error: "Employee must be over 18" };
  }

  const db = await getDB(); 
  await db.run(
    'INSERT INTO employees (full_name, email, phone, date_of_birth, job_title, department, salary) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [full_name, email, phone, date_of_birth, job_title, department, salary]
  );

  return redirect("/employees");
}

export default function NewEmployeePage() {
  const actionData = useActionData();
  return (
    <div>
      <h1>Create New Employee</h1>
      {actionData?.error && <p style={{ color: "red" }}>{actionData.error}</p>}

      <Form method="post">
        <div>
          <label htmlFor="full_name">Full Name</label>
          <input type="text" name="full_name" id="full_name" required />
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input type="email" name="email" id="email" required />
        </div>
        <div>
          <label htmlFor="phone">Phone Number</label>
          <input type="tel" name="phone" id="phone" required />
        </div>
        <div>
          <label htmlFor="date_of_birth">Date of Birth</label>
          <input type="date" name="date_of_birth" id="date_of_birth" required />
        </div>
        <div>
          <label htmlFor="job_title">Job Title</label>
          <input type="text" name="job_title" id="job_title" />
        </div>
        <div>
          <label htmlFor="department">Department</label>
          <input type="text" name="department" id="department" />
        </div>
        <div>
          <label htmlFor="salary">Salary</label>
          <input type="number" step="0.01" name="salary" id="salary" />
        </div>
        <button type="submit">Create Employee</button>
      </Form>
      <hr />
      <ul>
        <li><a href="/employees">Employees</a></li>
        <li><a href="/timesheets">Timesheets</a></li>
      </ul>
    </div>
  );
}
