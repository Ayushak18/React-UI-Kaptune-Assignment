import { useState, useEffect } from 'react';
import './App.css';

function App() {
  let [employees, setEmployees] = useState();
  let [newEmployee, setNewEmployee] = useState(false);
  let [editEmployee, setEditEmployee] = useState(false);
  let [employee, setEmployee] = useState();

  function fetchData() {
    return fetch('http://localhost:4000/employees')
      .then((data) => data.json())
      .then((employeesData) => setEmployees(employeesData));
  }
  useEffect(() => fetchData(), []);

  function handleClick() {
    setNewEmployee((newEmployee = true));
  }

  function handleEdit(id, firstName, lastName, designation, number) {
    setEmployee({ id, firstName, lastName, designation, number });
    setEditEmployee((editEmployee = true));
  }

  function handleDelete(id) {
    fetch(`http://localhost:4000/employees/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((res) => {
      if (!res.ok) {
        throw new Error('Failed');
      } else {
        window.location.href = '/';
      }
    });
  }

  function handleFormSubmit(event) {
    event.preventDefault();

    let firstName = event.target.firstName.value;
    let lastName = event.target.lastName.value;
    let designation = event.target.designation.value;
    let number = event.target.number.value;

    fetch('http://localhost:4000/employees', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName: firstName,
        lastName: lastName,
        designation: designation,
        number: number,
      }),
    }).then((res) => {
      if (!res.ok) {
        alert('Error');
      } else {
        window.location.href = '/';
      }
    });
  }

  function showNewEmployeeForm() {
    return (
      <div className="newEmployeePopUp">
        <div className="newEmployeePopUp-header">
          <h1>Add Employee</h1>
          <i
            onClick={() => {
              setNewEmployee((newEmployee = false));
            }}
            className="far fa-window-close fa-2x"
          ></i>
        </div>
        <form onSubmit={handleFormSubmit}>
          <label>
            First Name*{' '}
            <input
              type="text"
              placeholder="Enter First Name"
              name="firstName"
              required
            />
          </label>
          <label>
            Last Name*{' '}
            <input
              type="text"
              placeholder="Enter Last Name"
              name="lastName"
              required
            />
          </label>
          <label>
            Designation *{' '}
            <input
              type="text"
              placeholder="Enter Designation"
              name="designation"
              required
            />
          </label>
          <label>
            Contact Number*{' '}
            <input
              type="number"
              placeholder="Enter Contact Number"
              name="number"
              required
              minLength="10"
            />
          </label>

          <input className="add-form-button" type="submit" value="Add" />
          <button
            onClick={() => {
              setNewEmployee((newEmployee = false));
            }}
            className="cancel-button"
          >
            Cancel
          </button>
        </form>
      </div>
    );
  }

  function handleEditFormSubmit(event) {
    event.preventDefault();

    let firstName = event.target.firstName.value;
    let lastName = event.target.lastName.value;
    let designation = event.target.designation.value;
    let number = event.target.number.value;

    fetch(`http://localhost:4000/employees/${employee.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName: firstName,
        lastName: lastName,
        designation: designation,
        number: number,
      }),
    }).then((res) => {
      if (!res.ok) {
        alert('Error');
      } else {
        window.location.href = '/';
      }
    });
  }

  function showEditEmployeeForm() {
    return (
      <div className="newEmployeePopUp">
        <div className="newEmployeePopUp-header">
          <h1>Edit Employee</h1>
          <i
            onClick={() => {
              setEmployee();
              setEditEmployee((editEmployee = false));
            }}
            className="far fa-window-close fa-2x"
          ></i>
        </div>
        <form onSubmit={handleEditFormSubmit}>
          <label>
            First Name*{' '}
            <input
              type="text"
              name="firstName"
              required
              defaultValue={employee.firstName}
            />
          </label>
          <label>
            Last Name*{' '}
            <input
              type="text"
              name="lastName"
              required
              defaultValue={employee.lastName}
            />
          </label>
          <label>
            Designation *{' '}
            <input
              type="text"
              name="designation"
              required
              defaultValue={employee.designation}
            />
          </label>
          <label>
            Contact Number*{' '}
            <input
              type="number"
              defaultValue={employee.number}
              name="number"
              required
              minLength="10"
            />
          </label>

          <input className="add-form-button" type="submit" value="Update" />
          <button
            onClick={() => {
              setEditEmployee((editEmployee = false));
            }}
            className="cancel-button"
          >
            Cancel
          </button>
        </form>
      </div>
    );
  }

  if (employees) {
    return (
      <>
        {newEmployee ? showNewEmployeeForm() : ''}
        {editEmployee ? showEditEmployeeForm() : ''}
        <hr />
        <header>
          <h1>Employee Information</h1>
          <button onClick={handleClick}>Add Employee</button>
        </header>
        <hr />
        <main>
          <table>
            <thead>
              <tr key="">
                <td>First Name</td>
                <td>Last Name</td>
                <td>Designation</td>
                <td>Number</td>
                <td></td>
              </tr>
            </thead>

            <tbody>
              {employees.map((employee) => {
                return (
                  <tr key={employee._id}>
                    <td>{employee.firstName}</td>
                    <td>{employee.lastName}</td>
                    <td>{employee.designation}</td>
                    <td>{employee.number}</td>
                    <td>
                      <button
                        onClick={() =>
                          handleEdit(
                            employee._id,
                            employee.firstName,
                            employee.lastName,
                            employee.designation,
                            employee.number
                          )
                        }
                        className="edit-button"
                      >
                        Edit
                      </button>
                    </td>
                    <td>
                      <button
                        onClick={() => {
                          handleDelete(employee._id);
                        }}
                        className="delete-button"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </main>
      </>
    );
  } else {
    return <h1>No data</h1>;
  }
}

export default App;
