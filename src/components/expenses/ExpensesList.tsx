import * as React from "react";
import { ExpensesRepository } from "./ExpensesRepository";
import { ExpenseCategory, Expense, ExpensesSummary } from "./model/ExpenseCategory";
import { DateFormat } from "../../dataUtils";
import { CURRENCY_FORMATTER } from "../../dataUtils";
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
import { Trans } from 'react-i18next';

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
      cell: (row: ExpenseCategory) => this.rowEditButton(row),
      button: true,
      width: '50px'
    },
    {
      name: <Trans>Category</Trans>,
      selector: (row: ExpenseCategory) => row.category,
      sortable: true,
    },
    {
      name: <Trans>Projected Amount</Trans>,
      selector: (row: ExpenseCategory) => row.amountProjected != undefined ? CURRENCY_FORMATTER.format(row.amountProjected) : 0.0,
      sortable: true,
    },
    {
      name: <Trans>Paid Amount</Trans>,
      selector: (row: ExpenseCategory) => row.amountPaid != undefined ? CURRENCY_FORMATTER.format(row.amountPaid) : 0.0,
    },
    {
      name: <Trans>Total Amount</Trans>,
      selector: (row: ExpenseCategory) => row.amountTotal != undefined ? CURRENCY_FORMATTER.format(row.amountTotal) : 0.0,
    },
    {
      cell: (row: ExpenseCategory) => this.rowAddExpensetButton(row),
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

  handleCategoryModalClose() {
    this.setState({
      currentCategory: {} as ExpenseCategory,
      showCategoryModal: false,
    });
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
      id: this.state.currentCategory.id != "" ? this.state.currentCategory.id : "",
      category: event.target[0].value,
      amountProjected: parseFloat(event.target[1].value),
      amountTotal: event.target[2].value != '' ? parseFloat(event.target[2].value) : undefined,
    };
    this.addModel(expense);
    this.setState({
      currentCategory: {} as ExpenseCategory,
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
      currentCategory: {} as ExpenseCategory,
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
            this.setState({
              currentCategory: {} as ExpenseCategory,
              showCategoryModal: true,
            });
          }}
          type="button"
          variant="success"
        >
          <IoIosAdd />
          <Trans>Expense</Trans>
        </Button>
      </ButtonGroup>
    );
  };

  rowEditButton(event: ExpenseCategory) {
    return (<ButtonGroup>
      <Button
        key={"eb-"}
        variant="outline-warning"
        onClick={() => {
          this.setState({
            currentCategory: event,
            showCategoryModal: true
          })
        }}
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
        <Trans>Delete</Trans>
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
          <Modal.Title><Trans>Expense Category</Trans></Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form validated={this.state.expenseCategoryValidated} onSubmit={(form) => this.handleExpenseCategorySubmit(form)}>
            <Row>
              <Form.Group as={Col}>
                <Form.Label column><Trans>Category</Trans></Form.Label>
                <Col>
                  <Form.Control
                    type="text"
                    placeholder="Food..."
                    defaultValue={this.state.currentCategory.category}
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
                <Form.Label column><Trans>Projected Amount</Trans></Form.Label>
                <InputGroup className="mb-3">
                  <InputGroup.Text>$</InputGroup.Text>
                  <Form.Control aria-label="Amount (to the nearest dollar)" type="number" step=".01" defaultValue={this.state.currentCategory.amountProjected} required />
                </InputGroup>
                <Form.Control.Feedback tooltip>Looks good!</Form.Control.Feedback>
              </Form.Group>
              <Form.Group
                as={Col}
                controlId="validationFormik102"
                className="position-relative"
              >
                <Form.Label column><Trans>Total Amount</Trans></Form.Label>
                <InputGroup className="mb-3">
                  <InputGroup.Text>$</InputGroup.Text>
                  <Form.Control aria-label="Amount (to the nearest dollar)" type="number" step=".01" defaultValue={this.state.currentCategory.amountTotal} />
                </InputGroup>
                <Form.Control.Feedback tooltip>Looks good!</Form.Control.Feedback>
              </Form.Group>
            </Row>
            <br />
            <Form.Group as={Col}>
              <Button className="float-end" variant="primary" type="submit">
                <Trans>Save changes</Trans>
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
          <Modal.Title>{this.state.currentCategory.category} Expense</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form validated={this.state.expenseValidated} onSubmit={(form) => this.handleExpenseSubmit(form)}>
            <Row>
              <Form.Group as={Col}>
                <Form.Label column><Trans>Who Paid?</Trans></Form.Label>
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
                <Form.Label column><Trans>Paid Amount</Trans></Form.Label>
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
                <Form.Label column><Trans>When?</Trans></Form.Label>
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
                <Trans>Save changes</Trans>
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
                  <Col><b style={{ color: "darkcyan" }}>{" " + expense.whoPaid}</b> paid ${CURRENCY_FORMATTER.format(expense.amountPaid)} on {moment(expense.timePaidOn).format(DateFormat)}</Col>
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
          <p><b><Trans>Summary Projected total </Trans></b>{CURRENCY_FORMATTER.format(this.state.summary.projectedTotal)} , <b>Paid total </b> {CURRENCY_FORMATTER.format(this.state.summary.paidTotal)} and <b>Actual total $ </b> {CURRENCY_FORMATTER.format(this.state.summary.actualTotal)} </p>
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
