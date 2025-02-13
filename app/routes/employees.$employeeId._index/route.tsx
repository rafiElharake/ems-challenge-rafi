import { Form, redirect, useLoaderData,type ActionFunction} from "react-router";
import { getDB } from "~/db/getDB"; // Adjust this import based on your file structure
 
export async function loader({ params }:  { params: { employeeId: string } }) {
  const db = await getDB();
  const employee = await db.get("SELECT * FROM employees WHERE id = ?", [params.employeeId]);

  if (!employee) {
    throw new Response("Employee not found", { status: 404 });
  }

  return { employee };
}

export const action: ActionFunction = async ({ request, params }) => {
  const formData = await request.formData();
  const full_name = formData.get("full_name");
  const email = formData.get("email");
  const phone = formData.get("phone");
  const date_of_birth = formData.get("date_of_birth");
  const job_title = formData.get("job_title");
  const department = formData.get("department");
  const salary = formData.get("salary");

  const db = await getDB();
  await db.run(
    `UPDATE employees SET full_name = ?, email = ?, phone = ?, date_of_birth = ?, job_title = ?, department = ?, salary = ? WHERE id = ?`,
    [full_name, email, phone, date_of_birth, job_title, department, salary, params.employeeId]
  );

  return redirect("/employees");

};

export default function EmployeePage() {
  const { employee } = useLoaderData(); 
 
  return (
    <div>
      <h1>Edit Employee</h1>
      <Form method="post">
        <div>
          <label htmlFor="full_name">Full Name</label>
          <input type="text" name="full_name" id="full_name" defaultValue={employee.full_name} required />
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input type="email" name="email" id="email" defaultValue={employee.email} required />
        </div>
        <div>
          <label htmlFor="phone">Phone Number</label>
          <input type="tel" name="phone" id="phone" defaultValue={employee.phone} required />
        </div>
        <div>
          <label htmlFor="date_of_birth">Date of Birth</label>
          <input type="date" name="date_of_birth" id="date_of_birth" defaultValue={employee.date_of_birth} required />
        </div>
        <div>
          <label htmlFor="job_title">Job Title</label>
          <input type="text" name="job_title" id="job_title" defaultValue={employee.job_title} />
        </div>
        <div>
          <label htmlFor="department">Department</label>
          <input type="text" name="department" id="department" defaultValue={employee.department} />
        </div>
        <div>
          <label htmlFor="salary">Salary</label>
          <input type="number" step="0.01" name="salary" id="salary" defaultValue={employee.salary} />
        </div>
        <button type="submit">Save Changes</button>
      </Form>
      <hr />
      <ul>
        <li><a href="/employees">Employees</a></li>
        <li><a href="/employees/new">New Employee</a></li>
        <li><a href="/timesheets/">Timesheets</a></li>
      </ul>
    </div>
  );
}
