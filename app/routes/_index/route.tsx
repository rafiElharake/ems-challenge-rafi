export async function loader() {
  // No need to return anything from the loader in this case
  return null;
}

export default function RootPage() {
  return (
    <div>
      <h1>Welcome to the EMS Challenge</h1>
      <nav>
        <ul>
          <li><a href="/employees">Employees</a></li>
          <li><a href="/timesheets">Timesheets</a></li>
          <li><a href="/employees/new">New Employee</a></li>
        </ul>
      </nav>
    </div>
  );
}