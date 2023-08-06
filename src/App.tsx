import React, { Component } from "react";
import { Employee } from "./interface";
import EmployeeOrgApp from "./EmployeeOrgApp";
import "./App.css"
// Import EmployeeOrgAppComponent
// ...

// const ceo: Employee = {
//   uniqueId: 1,
//   name: "John Smith",
//   subordinates: [
//     {
//       "uniqueId": 2,
//       "name": "Margot Donald",
//       "subordinates": [
//         {
//           "uniqueId": 3,
//           "name": "Cassandra Reynolds",
//           "subordinates": [
//             {
//               "uniqueId": 4,
//               "name": "Mary Blue",
//               "subordinates": []
//             },
//             {
//               "uniqueId": 5,
//               "name": "Bob Saget",
//               "subordinates": [
//                 {
//                   "uniqueId": 6,
//                   "name": "Tina Teff",
//                   "subordinates": [
//                     { "uniqueId": 7, "name": "Will Turner", "subordinates": [] }
//                   ]
//                 },

//               ]
//             }
//           ]
//         }
//       ],
//     },
//     {
//       "uniqueId": 8,
//       "name": "Tyler Simpson",
//       "subordinates": [
//         {
//           "uniqueId": 9, "name": "Harry Tobs", "subordinates": [
//             {
//               "uniqueId": 12,
//               "name": "Thomas Brown",
//               "subordinates": []
//             }
//           ]
//         },
//         { "uniqueId": 10, "name": "George Carrey", "subordinates": [] },
//         { "uniqueId": 11, "name": "Gary Styles", "subordinates": [] }
//       ]
//     },
//     {
//       "uniqueId": 13,
//       "name": "Ben Willis",
//       "subordinates": []
//     },
//     {
//       "uniqueId": 14,
//       "name": "Georgina Flangy",
//       "subordinates": [
//         { "uniqueId": 15, "name": "Sophie Turner", "subordinates": [] },
//       ]
//     }]
//   };

interface EmployeeNodeProps {
  employee: Employee;
  onEmployeeClick: (employeeID: number) => void;
}

interface EmployeeChartProps {
  ceo: Employee;
  onMoveEmployee: (employeeID: number, supervisorID: number) => void;
  onUndo: () => void;
  onRedo: () => void;
}

class EmployeeNode extends Component<EmployeeNodeProps> {
  handleEmployeeClick = () => {
    this.props.onEmployeeClick(this.props.employee.uniqueId);
  };

  render() {
    const { employee } = this.props;
    return (
      <div className="flex flex-col gap-4">
        <div className="flex gap-4">
          <span>{employee.uniqueId} {employee.name}</span>
          <button className="bg-red-800 px-3 py-1 text-white rounded" onClick={this.handleEmployeeClick}>Move</button>
        </div>
        {employee.subordinates.length > 0 && (
          <ul className="ml-8 flex flex-col gap-2">
            {employee.subordinates.map((subordinate) => (
              <li key={subordinate.uniqueId}>
                <EmployeeNode employee={subordinate} onEmployeeClick={this.props.onEmployeeClick} />
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }
}

class EmployeeChart extends Component<EmployeeChartProps> {
  state = {
    selectedEmployeeID: 0,
    supervisorID: 0,
  };

  handleEmployeeClick = (employeeID: number) => {
    if (this.state.selectedEmployeeID === employeeID) {
      this.setState({ selectedEmployeeID: 0 });
    } else {
      this.setState({ selectedEmployeeID: employeeID });
    }
  };

  handleSupervisorChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    this.setState({ supervisorID: Number(event.target.value) });
  };

  handleMove = () => {
    const { selectedEmployeeID, supervisorID } = this.state;
    this.props.onMoveEmployee(selectedEmployeeID, supervisorID);
    this.setState({ selectedEmployeeID: 0, supervisorID: 0 });
  };

  handleUndo = () => {
    this.props.onUndo();
  };

  handleRedo = () => {
    this.props.onRedo();
  };

  render() {
    const { ceo } = this.props;
    const { selectedEmployeeID, supervisorID } = this.state;

    return (
      <div className="flex flex-col gap-8">
        <h1 className="text-2xl font-extrabold">Employee Organization Chart</h1>
        <div className="flex justify-center items-center gap-4">
          <button className="bg-yellow-500 px-3 py-1 text-white rounded" onClick={this.handleUndo} disabled={!this.props.onUndo}>
            Undo
          </button>
          <button className="bg-green-800 px-3 py-1 text-white rounded" onClick={this.handleRedo} disabled={!this.props.onRedo}>
            Redo
          </button>
        </div>
        <div className="bg-white w- flex flex-col gap-8 p-8">
          <EmployeeNode employee={ceo} onEmployeeClick={this.handleEmployeeClick} />
          {selectedEmployeeID > 0 && (
            <div className="flex gap-4">
              <label>Move employee {selectedEmployeeID} to supervisor:</label>
              <select
                value={supervisorID}
                onChange={this.handleSupervisorChange}
                className="bg-slate-400 rounded text-white"
              >
                <option value={0}>Select Supervisor</option>
                {ceo.subordinates.map((subordinate) => (
                  <option key={subordinate.uniqueId} value={subordinate.uniqueId}>
                    {subordinate.name}
                  </option>
                ))}
              </select>
              {/* <input type="number" value={supervisorID} onChange={this.handleSupervisorChange} /> */}
              <button className="bg-red-800 px-3 py-1 text-white rounded" onClick={this.handleMove}>Move</button>
            </div>
          )}
        </div>
      </div>
    );
  }
}

// Sample data to initialize the EmployeeOrgApp and render the UI
const ceo: Employee = {
  uniqueId: 1,
  name: "John Smith",
  subordinates: [
    {
      "uniqueId": 2,
      "name": "Margot Donald",
      "subordinates": [
        {
          "uniqueId": 3,
          "name": "Cassandra Reynolds",
          "subordinates": [
            {
              "uniqueId": 4,
              "name": "Mary Blue",
              "subordinates": []
            },
            {
              "uniqueId": 5,
              "name": "Bob Saget",
              "subordinates": [
                {
                  "uniqueId": 6,
                  "name": "Tina Teff",
                  "subordinates": [
                    { "uniqueId": 7, "name": "Will Turner", "subordinates": [] }
                  ]
                },

              ]
            }
          ]
        }
      ],
    },
    {
      "uniqueId": 8,
      "name": "Tyler Simpson",
      "subordinates": [
        {
          "uniqueId": 9, "name": "Harry Tobs", "subordinates": [
            {
              "uniqueId": 12,
              "name": "Thomas Brown",
              "subordinates": []
            }
          ]
        },
        { "uniqueId": 10, "name": "George Carrey", "subordinates": [] },
        { "uniqueId": 11, "name": "Gary Styles", "subordinates": [] }
      ]
    },
    {
      "uniqueId": 13,
      "name": "Ben Willis",
      "subordinates": []
    },
    {
      "uniqueId": 14,
      "name": "Georgina Flangy",
      "subordinates": [
        { "uniqueId": 15, "name": "Sophie Turner", "subordinates": [] },
      ]
    }]
};

class App extends Component {
  private employeeOrgApp: EmployeeOrgApp;

  constructor(props: any) {
    super(props);
    this.employeeOrgApp = new EmployeeOrgApp(ceo);
  }

  handleMoveEmployee = (employeeID: number, supervisorID: number) => {
    this.employeeOrgApp.move(employeeID, supervisorID);
    this.forceUpdate();
  };

  handleUndo = () => {
    this.employeeOrgApp.undo();
    this.forceUpdate();
  };

  handleRedo = () => {
    this.employeeOrgApp.redo();
    this.forceUpdate();
  };

  render() {
    return (
      <div className="flex min-h-screen justify-center items-center w-full bg-sky-100">
        <EmployeeChart
          ceo={this.employeeOrgApp.ceo}
          onMoveEmployee={this.handleMoveEmployee}
          onUndo={this.handleUndo}
          onRedo={this.handleRedo}
        />
      </div>
    );
  }
}

export default App;
