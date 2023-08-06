import { Employee, IEmployeeOrgApp } from "./interface";

export default class EmployeeOrgApp implements IEmployeeOrgApp {
  ceo: Employee;
  private moveActions: { employeeID: Employee; fromSupervisor: Employee; toSupervisor: Employee }[];
  private undoStack: { employeeID: Employee; fromSupervisor: Employee; toSupervisor: Employee }[];
  private redoStack: { employeeID: Employee; fromSupervisor: Employee; toSupervisor: Employee }[];

  constructor(ceo: Employee) {
    this.ceo = ceo;
    this.moveActions = [];
    this.undoStack = [];
    this.redoStack = [];
  }

  move(employeeID: number, supervisorID: number): void {
    const employee = this.findEmployeeById(this.ceo, employeeID);
    if (!employee) return;

    const fromSupervisor = this.findSupervisorOfEmployee(this.ceo, employeeID);
    const toSupervisor = this.findEmployeeById(this.ceo, supervisorID);

    if (!fromSupervisor || !toSupervisor || fromSupervisor === toSupervisor) return;

    // Move the employee
    this.removeEmployeeFromSubordinates(fromSupervisor, employeeID);
    this.addEmployeeToSubordinates(toSupervisor, employee);

    // Move existing subordinates to Cassandra if any
    const existingSubordinates = employee.subordinates.slice();
    for (const subordinate of existingSubordinates) {
      this.removeEmployeeFromSubordinates(employee, subordinate.uniqueId);
      this.addEmployeeToSubordinates(fromSupervisor, subordinate);
    }

    // Update move action history
    this.moveActions.push({ employeeID: employee, fromSupervisor, toSupervisor });
    this.redoStack = [];
  }

  undo(): void {
    const lastMove = this.moveActions.pop() || this.redoStack.pop();
    if (!lastMove) return
    const { employeeID, fromSupervisor, toSupervisor } = lastMove;
    console.log(fromSupervisor, toSupervisor, employeeID, 'from')
    // Undo the move action
    this.removeEmployeeFromSubordinates(toSupervisor, employeeID.uniqueId);
    // const val = this.findEmployeeById(this.ceo, fromSupervisor.uniqueId)
    this.addEmployeeToSubordinates(fromSupervisor, lastMove.employeeID);

    // Move subordinates back to Bob if any
    const bob = this.findEmployeeById(this.ceo, employeeID.uniqueId);
    const subordinates = bob?.subordinates.slice() || [];
    for (const subordinate of subordinates) {
      this.removeEmployeeFromSubordinates(fromSupervisor, subordinate.uniqueId);
      this.addEmployeeToSubordinates(bob, subordinate);
    }

    // Update undo/redo history
    this.undoStack.push(lastMove);
  }

  redo(): void {
    const lastUndo = this.undoStack.pop();
    if (!lastUndo) return;

    const { employeeID, fromSupervisor, toSupervisor } = lastUndo;

    // Redo the move action
    this.removeEmployeeFromSubordinates(fromSupervisor, employeeID.uniqueId);
    // const val = this.findEmployeeById(this.ceo, employeeID.uniqueId)

    this.addEmployeeToSubordinates(toSupervisor, lastUndo.employeeID);

    // Move existing subordinates to Cassandra if any
    const bob = this.findEmployeeById(this.ceo, employeeID.uniqueId);
    const subordinates = bob?.subordinates.slice() || [];
    for (const subordinate of subordinates) {
      this.removeEmployeeFromSubordinates(bob, subordinate.uniqueId);
      this.addEmployeeToSubordinates(fromSupervisor, subordinate);
    }

    // Update undo/redo history
    this.redoStack.push(lastUndo);
  }

  private findEmployeeById(root: Employee | undefined, id: number): Employee | undefined {
    console.log(id, root, 'in')
    if (root === undefined) return undefined;
    if (root.uniqueId === id) return root;
    console.log('here', root.uniqueId === id)
    for (const subordinate of root.subordinates) {
      console.log(subordinate, '1')
      const foundEmployee = this.findEmployeeById(subordinate, id);
      console.log(foundEmployee, 'find')
      if (foundEmployee) return foundEmployee;
    }
    return undefined;
  }

  private findSupervisorOfEmployee(root: Employee | undefined, id: number): Employee | undefined {
    if (root === undefined) return undefined;
    for (const subordinate of root.subordinates) {
      if (subordinate.uniqueId === id) return root;
      const foundSupervisor = this.findSupervisorOfEmployee(subordinate, id);
      if (foundSupervisor) return foundSupervisor;
    }
    return undefined;
  }

  private removeEmployeeFromSubordinates(supervisor: Employee | undefined, employeeID: number): void {
    if (supervisor === undefined) return;
    supervisor.subordinates = supervisor.subordinates.filter((e) => e.uniqueId !== employeeID);
  }

  private addEmployeeToSubordinates(supervisor: Employee | undefined, employee: Employee | undefined): void {

    if (employee === undefined || supervisor === undefined) return;
    supervisor.subordinates.push(employee);
  }
}
