import { useLoaderData } from "react-router";
import { useSearchParams } from "react-router-dom";
import { getDB } from "~/db/getDB";

import type { LoaderFunctionArgs } from "react-router";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const sortColumn = url.searchParams.get("sortColumn") || "id"; // Default sort by ID
  const sortOrder = url.searchParams.get("sortOrder") || "ASC"; // Default ascending
  const search = url.searchParams.get("search") || "";

  const db = await getDB();
  const employees = await db.all(
    `SELECT * FROM employees
     WHERE full_name LIKE ? OR email LIKE ?
     ORDER BY ${sortColumn} ${sortOrder}`,
    [`%${search}%`, `%${search}%`]
  );

  return { employees, sortColumn, sortOrder, search };
}

export default function EmployeesPage() {
  const { employees, sortColumn, sortOrder, search } = useLoaderData();
  const [searchParams, setSearchParams] = useSearchParams();

  // Handle Sorting
  const handleSort = (column:any) => {
    const newOrder = sortColumn === column && sortOrder === "ASC" ? "DESC" : "ASC";
    setSearchParams({ search, sortColumn: column, sortOrder: newOrder });
  };

  // Handle Search
  const handleSearch = (event:any) => {
    const value = event.target.value;
    setSearchParams({ search: value, sortColumn, sortOrder });
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Employees</h2>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search by name or email..."
        value={search}
        onChange={handleSearch} 
      />

      <div  >
      <table border={1} cellPadding={8} cellSpacing={0}>
      <thead>
            <tr >
              <th onClick={() => handleSort("full_name")}>
                Name {sortColumn === "full_name" && (sortOrder === "ASC" ? "↑" : "↓")}
              </th>
              <th  onClick={() => handleSort("email")}>
                Email {sortColumn === "email" && (sortOrder === "ASC" ? "↑" : "↓")}
              </th>
              <th  >Job Title</th>
              <th  >Department</th>
              <th >Salary</th>
              <th>action</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee:any) => (
              <tr key={employee.id}  >
                <td >{employee.full_name}</td>
                <td >{employee.email}</td>
                <td >{employee.job_title}</td>
                <td >{employee.department}</td>
                <td  >{employee.salary}</td>
                <td><a href={`/employees/${employee.id}`}>Edit</a></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <hr className="my-4" />

      <ul>
        <li>
          <a href="/employees/new"  >
            New Employee
          </a>
        </li>
        <li>
          <a href="/timesheets/"  >
            Timesheets
          </a>
        </li>
      </ul>
    </div>
  );
}
