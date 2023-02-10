import * as React from "react";
import { ExpensesRepository } from "./ExpensesRepository";
import { ExpenseCategory, Expense, ExpensesSummary } from "./model/ExpenseCategory";
import Alert from "react-bootstrap/Alert";
import DataTable from "react-data-table-component";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import InputGroup from 'react-bootstrap/InputGroup';
import ListGroup from "react-bootstrap/ListGroup";
import Container from "react-bootstrap/Container";
import DatePicker from "react-datepicker";
import { MdDelete } from "react-icons/md";
import { IoIosAdd } from "react-icons/io";
import { FiEdit } from "react-icons/fi";

import moment from "moment";

// Properties
export interface ExpensesListProps {
  eventId: string;
}


// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ExpensesListState {
  expenses: ExpenseCategory[];
  selected: ExpenseCategory[];
  summary: ExpensesSummary;
  showAlert: boolean;
  alertText: string;
  toggledClearRows: boolean;
  showCategoryModal: boolean;
  expenseCategoryValidated: boolean;
  showExpenseModal: boolean;
  expenseValidated: boolean;
  // Selection on individual rows
  currentCategory: ExpenseCategory;
  currentExpenseDate: Date;
}

export class ExpensesList extends React.Component<ExpensesListProps, ExpensesListState> {

  repository = new ExpensesRepository();

  columns = [
    {
      cell: (row: any) => this.rowEditButton(row),
      button: true,
      width: '50px'
    },
    {
      name: "Category",
      selector: (row: any) => row.category,
      sortable: true,
    },
    {
      name: "Projected Amount",
      selector: (row: any) => row.amountProjected,
      sortable: true,
    },
    {
      name: "Amount Paid",
      selector: (row: any) => row.amountPaid,
    },
    {
      name: "Amount total",
      selector: (row: any) => row.amountTotal,
    },
    {
      cell: (row: any) => this.rowAddExpensetButton(row),
      button: true,
    }
  ];

  constructor(props: ExpensesListProps) {
    super(props);
    this.state = {
      expenses: [],
      selected: [],
      summary: {} as ExpensesSummary,
      showAlert: false,
      alertText: "",
      toggledClearRows: false,
      showCategoryModal: false,
      expenseCategoryValidated: false,
      showExpenseModal: false,
      expenseValidated: false,
      currentExpenseDate: new Date(),
      currentCategory: {} as ExpenseCategory,
    };
  }

  componentDidMount() {
    this.refreshList();
  }


  refreshList() {
    this.repository
      .list(this.props.eventId)
      .then(results => {
        const calculatedSummary: ExpensesSummary = {
          projectedTotal: 0,
          paidTotal: 0,
          actualTotal: 0
        };
        for (const row of results) {
          calculatedSummary.projectedTotal += (row.amountProjected != undefined ? row.amountProjected : 0.0);
          calculatedSummary.paidTotal += (row.amountPaid != undefined ? row.amountPaid : 0);
          calculatedSummary.actualTotal += (row.amountTotal != undefined ? row.amountTotal : 0);
        }
        this.setState({
          expenses: results,
          summary: calculatedSummary,
        });
      })
      .catch(error => {
        this.setState({
          showAlert: true,
          alertText: this.handleErrorFromServer(error),
        });
      });
  }

  addModel(value: ExpenseCategory) {
    this.repository
      .add(this.props.eventId, value)
      .then(() => {
        this.refreshList();
      })
      .catch(error => {
        this.setState({
          showAlert: true,
          alertText: this.handleErrorFromServer(error),
        });
      });
  }

  // TODO: No updates as of now
  updateModel(value: ExpenseCategory): Promise<ExpenseCategory> {
    return this.repository
      .update(this.props.eventId, value);
  }

  deleteModel(expenseCategoryId: string) {
    this.repository
      .delete(this.props.eventId, expenseCategoryId)
      .then(() => {
        this.refreshList();
        this.setState((prevState, props) => ({
          toggledClearRows: !prevState.toggledClearRows,
          selected: [],
        }));
      })
      .catch(error => {
        this.setState({
          showAlert: true,
          alertText: this.handleErrorFromServer(error),
        });
      });
  }

  handleErrorFromServer(error: Response) {
    const message = "From server - error : ";
    if (error.status === 401) {
      return "Unauthorized request";
    } else if (error.status === 400) {
      return message + "Invalid request";
    }
    if (error.statusText != undefined && error.statusText != "") {
      return message + (error as Response).statusText;
    }
    return message + " Unexpected , please verify console logs.";
  }

  // Ui handlers

  handleAlertClose() {
    this.setState({
      showAlert: false,
      alertText: "",
    });
  }

  onAddCategoryButtonClick() {
    this.setState({
      showCategoryModal: true,
    });
  }

  handleCategoryModalClose() {
    this.setState({
      showCategoryModal: false,
    });
  }

  onAddExpenseButtonClick() {
    this.setState({
      showExpenseModal: true,
    });
  }

  onDeleteCategoryButton() {
    for (const row of this.state.selected) {
      this.deleteModel(row.id != undefined ? row.id : "");
    }
  }

  onDeleteExpenseButton(category: ExpenseCategory, expense: Expense) {
    const expenses = category.expenses != undefined ? category.expenses : [];
    const index = expenses.indexOf(expense, 0);
    if (index > -1 && category.expenses != undefined) {
      category.expenses.splice(index, 1);
      this.updateModel(category)
        .then(() => {
          this.refreshList();
        }).catch(error => {
          this.setState({
            showAlert: true,
            alertText: this.handleErrorFromServer(error),
          });
        });
    }
  }


  handleExpenseModalClose() {
    this.setState({
      currentCategory: {} as ExpenseCategory,
      showExpenseModal: false,
    });
  }


  onSelectedRows(event: any) {
    this.setState({
      selected: event.selectedRows,
    });
  }

  onDateChange(date: Date) {
    this.setState({
      currentExpenseDate: date,
    });
  }

  handleExpenseCategorySubmit(event: any) {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
    }
    const expense: ExpenseCategory = {
      //id?: string;
      category: event.target[0].value,
      amountProjected: parseInt(event.target[1].value),
      amountTotal: event.target[2].value != '' ? parseInt(event.target[3].value) : undefined,
    };
    this.addModel(expense);
    this.setState({
      expenseCategoryValidated: true,
      showCategoryModal: false
    });
    event.preventDefault();
  }

  handleExpenseSubmit(event: any) {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
    }
    const expense: Expense = {
      whoPaid: event.target[0].value,
      timePaidOn: this.state.currentExpenseDate.toISOString(),
      amountPaid: parseInt(event.target[1].value),
    };
    const category = this.state.currentCategory;
    if (category.expenses == null || category.expenses == undefined) {
      category.expenses = []
    }
    category.expenses?.push(expense)
    this.addModel(category);

    this.setState({
      expenseValidated: true,
      showExpenseModal: false
    });
    event.preventDefault();
  }

  gridActions = () => {
    return (
      <ButtonGroup>
        <Button
          onClick={() => {
            this.onAddCategoryButtonClick();
          }}
          type="button"
          variant="success"
        >
          <IoIosAdd />
          Expense
        </Button>
      </ButtonGroup>
    );
  };

  //TODO: Edit
  rowEditButton(event: any) {
    return (<ButtonGroup>
      <Button
        key={"eb-"}
        variant="outline-success"
        disabled
      >
        <FiEdit />
      </Button>
    </ButtonGroup>)
  }

  rowAddExpensetButton(row: ExpenseCategory) {
    return (<ButtonGroup>
      <Button key={"sb-" + row.id}
        variant="outline-success"
        onClick={() => {
          this.setState({
            currentCategory: row,
            showExpenseModal: true
          })
        }}
      >
        <IoIosAdd />
      </Button>
    </ButtonGroup>)
  }

  deleteButton = () => {
    return (
      <Button
        onClick={() => {
          this.onDeleteCategoryButton();
        }}
        key="delete"
        variant="danger"
      >
        <MdDelete />
        Delete
      </Button>
    );
  }

  modalAddCategory() {
    return (
      <Modal
        show={this.state.showCategoryModal}
        onHide={() => this.handleCategoryModalClose()}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Add Expense Category</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form validated={this.state.expenseCategoryValidated} onSubmit={(form) => this.handleExpenseCategorySubmit(form)}>
            <Row>
              <Form.Group as={Col}>
                <Form.Label column>Category</Form.Label>
                <Col>
                  <Form.Control
                    type="text"
                    placeholder="Food..."
                    required
                  />
                </Col>
              </Form.Group>
            </Row>
            <Row>
              <Form.Group
                as={Col}
                controlId="validationFormik101"
                className="position-relative"
              >
                <Form.Label column>Projected Amount</Form.Label>
                <InputGroup className="mb-3">
                  <InputGroup.Text>$</InputGroup.Text>
                  <Form.Control aria-label="Amount (to the nearest dollar)" type="number" required />
                </InputGroup>
                <Form.Control.Feedback tooltip>Looks good!</Form.Control.Feedback>
              </Form.Group>
              <Form.Group
                as={Col}
                controlId="validationFormik102"
                className="position-relative"
              >
                <Form.Label column>Total Amount</Form.Label>
                <InputGroup className="mb-3">
                  <InputGroup.Text>$</InputGroup.Text>
                  <Form.Control aria-label="Amount (to the nearest dollar)" />
                </InputGroup>
                <Form.Control.Feedback tooltip>Looks good!</Form.Control.Feedback>
              </Form.Group>
            </Row>
            <br />
            <Form.Group as={Col}>
              <Button className="float-end" variant="primary" type="submit">
                Save changes
              </Button>
            </Form.Group>
          </Form>
        </Modal.Body>
      </Modal>
    );
  }

  modalAddExpense() {
    return (
      <Modal
        show={this.state.showExpenseModal}
        onHide={() => this.handleExpenseModalClose()}
      >
        <Modal.Header closeButton>
          <Modal.Title>{this.state.currentCategory.category}
            Expense</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form validated={this.state.expenseValidated} onSubmit={(form) => this.handleExpenseSubmit(form)}>
            <Row>
              <Form.Group as={Col}>
                <Form.Label column>Who Paid?</Form.Label>
                <Col>
                  <Form.Control
                    type="text"
                    placeholder="John Doe"
                    required
                  />
                </Col>
              </Form.Group>
            </Row>
            <Row>
              <Form.Group
                as={Col}
                controlId="validationFormik101"
                className="position-relative"
              >
                <Form.Label column>Paid Amount</Form.Label>
                <InputGroup className="mb-3">
                  <InputGroup.Text>$</InputGroup.Text>
                  <Form.Control aria-label="Amount (to the nearest dollar)" type="number" required />
                </InputGroup>
                <Form.Control.Feedback tooltip>Looks good!</Form.Control.Feedback>
              </Form.Group>
              <Form.Group
                as={Col}
                controlId="validationFormik102"
                className="position-relative"
              >
                <Form.Label column>When?</Form.Label>
                <DatePicker
                  selected={this.state.currentExpenseDate}
                  onChange={(date: Date) => {
                    this.onDateChange(date);
                  }}
                  required
                />
                <Form.Control.Feedback tooltip>Looks good!</Form.Control.Feedback>
              </Form.Group>
            </Row>
            <br />
            <Form.Group as={Col}>
              <Button className="float-end" variant="primary" type="submit">
                Save changes
              </Button>
            </Form.Group>
          </Form>
        </Modal.Body>
      </Modal>
    );
  }

  ExpenseDetailsComponent = (data: any) => this.expenseDetails(data);

  expenseDetails(row: any) {
    const category: ExpenseCategory = row.data != undefined ? row.data : {} as ExpenseCategory;
    const details = row.data.expenses != null ? row.data.expenses : []
    if (details.length == 0) {
      return (<Container>No expenses yet!</Container>);
    }
    return (
      <Container>
        <b>Expenses:</b>
        <ListGroup variant="flush">
          {details.map((expense: Expense) => {
            return (
              <ListGroup.Item key={"ig-todo" + expense.id}>
                <Row>
                  <Col><b style={{ color: "darkcyan" }}>{" " + expense.whoPaid}</b> paid ${expense.amountPaid} on {moment(expense.timePaidOn).format("dddd, MMMM Do YYYY, h:mm:ss a")}</Col>
                  <Col>
                    <ButtonGroup>
                      <Button
                        key={"db-" + expense.id}
                        variant="outline-danger"
                        className="float-end"
                        onClick={(event) => this.onDeleteExpenseButton(category, expense)}
                      >
                        <MdDelete />
                      </Button>
                    </ButtonGroup>
                  </Col>
                </Row>
              </ListGroup.Item>

            )
          })}
        </ListGroup>
      </Container>
    );
  }

  render() {
    return (
      <div>
        <Container>
          <Alert
            show={this.state.showAlert}
            onClose={() => this.handleAlertClose}
            key="alert"
            variant="warning"
            dismissible
          >
            {this.state.alertText}
          </Alert>
          <p><b>Projected total $ </b>{this.state.summary.projectedTotal} , <b>Paid total $ </b> {this.state.summary.paidTotal} and <b>Actual total $ </b> {this.state.summary.actualTotal} </p>
          <DataTable
            columns={this.columns}
            data={this.state.expenses}
            actions={this.gridActions()}
            contextActions={this.deleteButton()}
            onSelectedRowsChange={(change) => this.onSelectedRows(change)}
            clearSelectedRows={this.state.toggledClearRows}
            expandableRowsComponent={this.ExpenseDetailsComponent}
            selectableRows
            pagination
            expandableRows
            highlightOnHover
          />
        </Container>

        {this.modalAddCategory()}
        {this.modalAddExpense()}
      </div >
    );
  }

}
