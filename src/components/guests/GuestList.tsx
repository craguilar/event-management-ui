import * as React from "react";
import { GuestDetail } from "./GuestDetails";
import Guest from "./model/Guest";
import { GuestRepository } from "./GuestRepository";
import { downloadCSV } from "../../dataTableUtils";
import DataTable from "react-data-table-component";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { IoIosAdd } from "react-icons/io";
import { CgExport } from "react-icons/cg";
import { MdDelete } from "react-icons/md";
import { FiEdit } from "react-icons/fi";
import Alert from "react-bootstrap/Alert";

// Properties
export interface GuestListProps {
  eventId: string;
}

export interface GuestListState {
  guests: Guest[];
  selected: Guest[];
  currentGuest: Guest;
  totalGuests: number;
  showModal: boolean;
  showAlert: boolean;
  alertText: string;
  toggledClearRows: boolean;
}

export class GuestList extends React.Component<GuestListProps, GuestListState> {
  private repository = new GuestRepository();
  private detailsComponent: React.RefObject<GuestDetail>;

  private columns = [
    {
      cell: (row: Guest) => this.rowEditButton(row),
      button: true,
      width: "50px",
    },
    {
      name: "First Name",
      selector: (row: Guest) => row.firstName,
      sortable: true,
    },
    {
      name: "Last Name",
      selector: (row: any) => row.lastName,
      sortable: true,
    },
    {
      name: "Guest of",
      selector: (row: any) => row.guestOf,
    },
    {
      name: "Email",
      selector: (row: any) => row.email,
    },
    {
      name: "Phone",
      selector: (row: any) => row.phone,
    },
    {
      name: "Tentative",
      selector: (row: any) => (row.isTentative ? "Yes" : "No"),
    },
    {
      name: "Country",
      selector: (row: any) => row.country,
      sortable: true,
    },
    {
      name: "State",
      selector: (row: any) => row.state,
    },
    {
      name: "No. Of seats",
      selector: (row: any) => row.numberOfSeats,
    },
  ];

  constructor(props: GuestListProps) {
    super(props);
    this.state = {
      guests: [],
      showAlert: false,
      currentGuest: {} as Guest,
      alertText: "",
      showModal: false,
      selected: [],
      toggledClearRows: false,
      totalGuests: 0,
    };
    this.detailsComponent = React.createRef();
    // TODO: Do I really need this?
    this.handleAlertClose = this.handleAlertClose.bind(this);
    this.handleModalClose = this.handleModalClose.bind(this);
    this.onSelectedRows = this.onSelectedRows.bind(this);
  }

  // TODO check wht it's called twice
  componentDidMount() {
    this.refreshList();
  }

  // Data handling methods

  refreshList() {
    this.repository
      .list(this.props.eventId != undefined ? this.props.eventId : "-")
      .then(results => {
        let numberOfSeats = 0;
        for (const row of results) {
          numberOfSeats += row.numberOfSeats;
        }
        this.setState({
          guests: results,
          totalGuests: numberOfSeats,
        });
      })
      .catch(error => {
        this.setState({
          showAlert: true,
          alertText: this.handleErrorFromServer(error),
        });
      });
  }

  addModel(value: Guest) {
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

  // UI handlers and Components
  onAddButtonClick() {
    this.setState({
      currentGuest: {} as Guest,
      showModal: true,
    });
  }

  onSelectedRows(event: any) {
    this.setState({
      selected: event.selectedRows,
    });
  }

  onDeleteButton() {
    for (const row of this.state.selected) {
      this.repository
        .delete(this.props.eventId, row.id)
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
  }

  handleAlertClose() {
    this.setState({
      showAlert: false,
      alertText: "",
    });
  }

  handleModalClose() {
    this.setState({
      currentGuest: {} as Guest,
      showModal: false,
    });
  }

  onSubmitClick = (event: any) => {
    const elements = event.target.elements;
    if (elements.length > 0) {
      this.addModel(this.getFromForm(elements));
    }
    this.setState({
      currentGuest: {} as Guest,
      showModal: false,
    });
    event.preventDefault();
  };

  getFromForm(elements: any) {
    const firstName = elements[0].value;
    const lastName = elements[1].value;
    const email = elements[2].value;
    const phone = elements[3].value;
    const numberOfSeats = parseInt(elements[4].value);
    const country = elements[5].value;
    const state = elements[6].value;
    const guestOf = elements[7].value;
    const isTentative = elements[8].checked;
    const guest: Guest = {
      id: this.state.currentGuest.id != "" ? this.state.currentGuest.id : "",
      firstName: firstName,
      lastName: lastName,
      email: email,
      phone: phone,
      numberOfSeats: numberOfSeats,
      country: country,
      state: state,
      guestOf: guestOf,
      isTentative: isTentative,
    };
    return guest;
  }

  deleteButton = () => {
    return (
      <Button
        onClick={() => {
          this.onDeleteButton();
        }}
        key="delete"
        variant="danger"
      >
        <MdDelete />
        Delete
      </Button>
    );
  };

  rowEditButton(event: Guest) {
    return (
      <ButtonGroup>
        <Button
          key={"eb-"}
          variant="outline-warning"
          onClick={() => {
            this.setState({
              currentGuest: event,
              showModal: true,
            });
          }}
        >
          <FiEdit />
        </Button>
      </ButtonGroup>
    );
  }

  gridActions = () => {
    return (
      <ButtonGroup>
        <Button
          onClick={() => {
            this.onAddButtonClick();
          }}
          type="button"
          variant="success"
        >
          <IoIosAdd />
          Guest
        </Button>
        <Button
          onClick={() => {
            downloadCSV(this.state.guests);
          }}
          type="button"
          variant="primary"
        >
          <CgExport /> csv
        </Button>
      </ButtonGroup>
    );
  };

  // TODO: this looks super ugly
  render() {
    return (
      <div>
        <Alert
          show={this.state.showAlert}
          onClose={this.handleAlertClose}
          key="alert"
          variant="warning"
          dismissible
        >
          {this.state.alertText}
        </Alert>
        <p>
          <b>Summary Total guests: </b>
          {this.state.totalGuests}
        </p>
        <DataTable
          columns={this.columns}
          data={this.state.guests}
          actions={this.gridActions()}
          contextActions={this.deleteButton()}
          onSelectedRowsChange={this.onSelectedRows}
          clearSelectedRows={this.state.toggledClearRows}
          selectableRows
          pagination
          highlightOnHover
        />
        <Modal
          show={this.state.showModal}
          onHide={this.handleModalClose}
          size="lg"
        >
          <Modal.Header closeButton>
            <Modal.Title>Add guest</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <GuestDetail
              ref={this.detailsComponent}
              onSubmit={this.onSubmitClick}
              current={this.state.currentGuest}
            />
          </Modal.Body>
        </Modal>
      </div>
    );
  }
}
