import * as React from "react";
import { Event } from "./model/Event";
import { EventSummary } from "./model/EventSummary";
import { EventSharedEmails } from "./model/EventSharedEmails";
import { EventDetails } from "./EventDetails";
import { EventRepository } from "./EventRepository";
import { Navigate } from "react-router-dom";
import Table from "react-bootstrap/Table";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Alert from "react-bootstrap/Alert";
import Container from "react-bootstrap/Container";
import InputGroup from "react-bootstrap/InputGroup";
import { TagsInput } from "react-tag-input-component";
import { PageTitle } from "../common/PageTitle";
import { FiEdit } from "react-icons/fi";
import { MdDelete, MdIosShare } from "react-icons/md";
import { IoIosAdd } from "react-icons/io";
import { GrLocationPin } from "react-icons/gr";
import { BiTimeFive } from "react-icons/bi";
import { TbListDetails } from "react-icons/tb";

import moment from "moment";

// Properties
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface EventListProps { }

// State
export interface EventListState {
  events: EventSummary[];
  showModal: boolean;
  showShareModal: boolean;
  typeOfOperation: string;
  current: Event;
  currentSelectedSummary: Event;
  showAlert: boolean;
  alertText: string;
  clickView: boolean;
  //TODO: Not sure it belongs here
  sharedEmails: string[];
}

/**
 * This class implements main events logic .
 * The properties associated to it it are:
 *   - logged on userName
 * The state associated to it contains:
 *   - List of events.
 */
const NEW_TYPE_OF_OPERATION = "New";
const UPDATE_TYPE_OF_OPERATION = "Update";
// Credit to https://github.com/angular/angular.js/blob/65f800e19ec669ab7d5abbd2f6b82bf60110651a/src/ng/directive/input.js#L27
const EMAIL_REGEXP = /^(?=.{1,254}$)(?=.{1,64}@)[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+(\.[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+)*@[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?(\.[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*$/;

export class EventList extends React.Component<EventListProps, EventListState> {
  private repository = new EventRepository();
  private eventDetailsComponent: React.RefObject<EventDetails>;

  constructor(props: EventListProps) {
    super(props);

    this.state = {
      events: [],
      showModal: false,
      showShareModal: false,
      showAlert: false,
      alertText: "",
      typeOfOperation: NEW_TYPE_OF_OPERATION,
      current: {} as Event,
      clickView: false,
      sharedEmails: [],
      currentSelectedSummary: {} as Event,
    };
    // https://stackoverflow.com/questions/59490111/react-typeerror-undefined-onsubmit
    this.eventDetailsComponent = React.createRef();
    this.handleModalClose = this.handleModalClose.bind(this);
    this.handleShareClose = this.handleShareClose.bind(this);
    this.handleAlertClose = this.handleAlertClose.bind(this);
    this.onEmailsShared = this.onEmailsShared.bind(this);
  }

  // TODO check wht it's called twice
  componentDidMount() {
    this.refreshList();
  }

  // Data handling methods
  refreshList() {
    this.repository
      .list()
      .then(results => {
        this.setState({
          events: results,
        });
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

  addOrUpdateModel(value: Event) {
    if (this.state.typeOfOperation === NEW_TYPE_OF_OPERATION) {
      this.repository
        .add(value)
        .then(() => {
          this.refreshList();
        })
        .catch(error => {
          this.setState({
            showAlert: true,
            alertText: this.handleErrorFromServer(error),
          });
        });
    } else {
      this.repository
        .update(value)
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
  }

  editButtonClick(eventId: string) {
    this.repository
      .get(eventId)
      .then(result => {
        this.setState({
          showModal: true,
          typeOfOperation: UPDATE_TYPE_OF_OPERATION,
          current: result,
        });
      })
      .catch(error => {
        this.setState({
          showAlert: true,
          alertText: this.handleErrorFromServer(error),
        });
      });
  }

  deleteEvent(eventId: string) {
    this.repository
      .delete(eventId)
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


  updateSharedEvent() {
    if (this.state.sharedEmails.length == 0) {
      return;
    }
    if (this.state.currentSelectedSummary.id == undefined || this.state.currentSelectedSummary.id == "") {
      this.setState({
        showAlert: true,
        alertText: "Error the current selected event context is empty",
      });
    }
    const sharedEmails: EventSharedEmails = {
      eventId: this.state.currentSelectedSummary.id != undefined ? this.state.currentSelectedSummary.id : "",
      sharedEmails: this.state.sharedEmails
    };
    // Then save
    this.repository
      .updateSharedEmails(sharedEmails)
      .then(() => {
        this.setState({
          showShareModal: false,
          sharedEmails: []
        });
      })
      .catch(error => {
        this.setState({
          showShareModal: false,
          showAlert: true,
          alertText: this.handleErrorFromServer(error),
        });
      });

  }

  handleShareOpen(event: EventSummary) {
    this.repository
      .listSharedEmails(event.id)
      .then((response) => {
        this.setState({ 
          sharedEmails: response.sharedEmails,
          currentSelectedSummary: event, 
          showShareModal: true })
      })
      .catch(error => {
        this.setState({
          showShareModal: false,
          showAlert: true,
          alertText: this.handleErrorFromServer(error),
        });
      });
  }

  // UI Actions
  onAddButtonClick() {
    this.setState({
      showModal: true,
      typeOfOperation: NEW_TYPE_OF_OPERATION,
      current: {} as Event,
    });
  }

  onSubmitClick = (event: any, mainEventDay: Date) => {
    const elements = event.target.elements;
    if (elements.length > 0) {
      this.addOrUpdateModel(this.getFromForm(elements, mainEventDay));
    }
    this.setState({
      showModal: false,
      current: {} as Event
    });
    event.preventDefault();
  };


  getFromForm(elements: any, mainEventDay: Date) {
    const name = elements[0].value;
    const mainLocation = elements[1].value;
    const date = mainEventDay.toISOString();
    const description = elements[3].value;
    const event: Event = {
      id: this.state.current.id != undefined && this.state.current.id != "" ? this.state.current.id : "",
      name: name,
      mainLocation: mainLocation,
      eventDay: date,
      description: description,
    };
    return event;
  }


  onEmailsShared(value: string[]) {

    if (value == null || value == undefined) {
      return;
    }
    this.setState({
      sharedEmails: value
    })
  }

  handleAlertClose() {
    this.setState({
      showAlert: false,
      alertText: "",
    });
  }

  handleModalClose() {
    this.setState({
      showModal: false,
    });
  }

  handleShareClose() {
    this.setState({
      showShareModal: false,
    });
  }

  displayTable() {
    return (
      <div>
        <div style={{ textAlign: "right" }}>
          <ButtonGroup aria-label="Tool bar">
            <Button
              variant="success"
              onClick={() => {
                this.onAddButtonClick();
              }}
            >
              <IoIosAdd />
              Add event
            </Button>
          </ButtonGroup>
        </div>
        <br />
        <div>
          <Table striped responsive hover>
            <thead>
              <tr>
                <th>Actions</th>
                <th>Name</th>
                <th>
                  <GrLocationPin /> Location
                </th>
                <th>
                  <BiTimeFive /> When?
                </th>
                <th>_</th>
              </tr>
            </thead>
            <tbody>
              {this.state.events.map(event => {
                return (
                  <tr key={"tr-" + event.id}>
                    <td>
                      <ButtonGroup>
                        <Button
                          key={"vb-" + event.id}
                          variant="outline-success"
                          onClick={() =>
                            this.setState({ currentSelectedSummary: event, clickView: true })
                          }
                        >
                          <TbListDetails />
                        </Button>
                        <Button
                          key={"eb-" + event.id}
                          variant="outline-success"
                          onClick={() => {
                            this.editButtonClick(event.id);
                          }}
                        >
                          <FiEdit />
                        </Button>
                        <Button key={"sb-" + event.id}
                          variant="outline-success"
                          onClick={() => this.handleShareOpen(event)}>
                          <MdIosShare />
                        </Button>
                      </ButtonGroup>
                    </td>
                    <td>{event.name}</td>
                    <td>{event.mainLocation}</td>
                    <td>
                      {moment(event.eventDay).format(
                        "dddd, MMMM Do YYYY, h:mm:ss a"
                      )}
                    </td>
                    <td>
                      <ButtonGroup>
                        <Button
                          key={"db-" + event.id}
                          variant="outline-danger"
                          onClick={() => this.deleteEvent(event.id)}
                          disabled>
                          <MdDelete />
                        </Button>
                      </ButtonGroup>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            {this.state.clickView && (
              <Navigate
                to="/details"
                state={this.state.currentSelectedSummary}
                replace={true}
              />
            )}
          </Table>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div>
        <Container>
          <br />
          <Alert
            show={this.state.showAlert}
            onClose={this.handleAlertClose}
            key="alert"
            variant="warning"
            dismissible
          >
            {this.state.alertText}
          </Alert>
          <PageTitle title={"My events"} />
          {this.displayTable()}
        </Container>
        <Modal
          show={this.state.showModal}
          onHide={this.handleModalClose}
          size="lg"
        >
          <Modal.Header closeButton>
            <Modal.Title>{this.state.typeOfOperation} event</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <EventDetails
              ref={this.eventDetailsComponent}
              current={this.state.current}
              onSubmit={this.onSubmitClick}
            />
          </Modal.Body>
        </Modal>
        <Modal
          show={this.state.showShareModal}
          onHide={this.handleShareClose}
        >
          <Modal.Header closeButton>
            <Modal.Title>Share event</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>You can share your event with others! Add an email below and <b style={{ color: "blue" }}>hit enter</b> , when you are ready click save!</p>
            <InputGroup >
              <TagsInput
                name="emails"
                placeHolder="Enter emails ..."
                beforeAddValidate={this.validateEmail}
                value={this.state.sharedEmails}
                onExisting={(value) => alert('Already added ' + value)}
                onChange={this.onEmailsShared} />
            </InputGroup>
            <i>NOTE: Remove emails is not supported on save </i>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={() => { this.updateSharedEvent(); }}>Save changes</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }

  // TODO: Utility should move there
  validateEmail(tag: string): boolean {
    if (!EMAIL_REGEXP.test(tag)) {
      return false;
    }
    return true
  }
}
