import * as React from "react";
import Table from "react-bootstrap/Table"
import ButtonGroup from "react-bootstrap/ButtonGroup"
import Button from "react-bootstrap/Button"
import { Event } from "./model/Event"
import { EventSummary } from "./model/EventSummary"
import { EventDetails } from "./EventDetails";
import { EventRepository } from "./EventRepository";
import Modal from "react-bootstrap/Modal";
import Alert from "react-bootstrap/Alert";
import Container from "react-bootstrap/Container";
import { PageTitle } from "../common/PageTitle";

// Properties 
export interface EventListProps {
  userName: string;
}

// State
export interface EventListState {
  events: EventSummary[],
  showModal: boolean,
  typeOfOperation: string,
  current: Event,
  showAlert: boolean,
  alertText: string
}

/**
  * This class implements main events logic .
  * The properties associated to it it are:
  *   - logged on userName
  * The state associated to it contains:
  *   - List of events. 
  */
const NEW_TYPE_OF_OPERATION = 'New';
const UPDATE_TYPE_OF_OPERATION = 'Update';

export class EventList extends React.Component<EventListProps, EventListState> {

  repository = new EventRepository();
  eventDetailsComponent: React.RefObject<EventDetails>;

  constructor(props: EventListProps) {

    super(props);
    this.state = { events: [], showModal: false, showAlert: false, alertText: '', typeOfOperation: NEW_TYPE_OF_OPERATION, current: {} as Event };
    this.refreshList()
    this.eventDetailsComponent = React.createRef();
    this.handleModalClose = this.handleModalClose.bind(this)
    this.handleAlertClose = this.handleAlertClose.bind(this)
    this.onAddButtonClick = this.onAddButtonClick.bind(this)

  }

  refreshList() {

    this.repository.list().then(results => {
      this.setState({
        events: results
      })
    }).catch(error => {
      this.setState({
        showAlert: true,
        alertText: this.handlerErrorFromServer(error)
      })
    })
  }

  handleUpdate(value: Event) {
    if (this.state.typeOfOperation === NEW_TYPE_OF_OPERATION) {
      this.repository.add(value).then(() => {
        this.refreshList()
      }).catch(error => {
        alert(error)
      })
    } else {
      this.repository.update(value).then(() => {
        this.refreshList()
      }).catch(error => {
        this.setState({
          showAlert: true,
          alertText: this.handlerErrorFromServer(error)
        })
      })
    }
  }


  handlerErrorFromServer(error: any) {
    let message = "From server -  unexpected error : "
    if (error.status === 401) {
      message = 'Unauthorized request'
    } else {
      message = message + error.message
    }
    return message;
  }


  onEditButtonClick(eventId: string) {
    this.repository.get(eventId).then(result => {
      this.setState({
        showModal: true,
        typeOfOperation: UPDATE_TYPE_OF_OPERATION,
        current: result
      })
    }).catch(error => {
      this.setState({
        showAlert: true,
        alertText: this.handlerErrorFromServer(error)
      })
    })
  }

  onAddButtonClick() {
    this.setState({
      showModal: true,
      typeOfOperation: NEW_TYPE_OF_OPERATION,
      current: {} as Event
    })
  }

  onSubmitClick = (event: any) => {

    const elements = event.target.elements
    if (elements.length > 0) {
      this.handleUpdate(this.getFromForm(elements))
    }
    this.setState({
      showModal: false
    })
    event.preventDefault()
  }

  getFromForm(elements: any) {
    const name = elements[0].value
    const mainLocation = elements[1].value
    const eventDay = elements[2].value
    const description = elements[3].value
    const event: Event = {
      name: name,
      mainLocation: mainLocation,
      eventDay: eventDay,
      description: description
    }
    return event
  }

  handleAlertClose() {
    this.setState({
      showAlert: false,
      alertText: ''
    })
  }

  handleModalClose() {
    this.setState({
      showModal: false
    })
  }

  displayTable() {
    return (
      <div>
        <div style={{ textAlign: 'right' }}>
          <ButtonGroup aria-label="Tool bar">
            <Button variant="success" onClick={() => { this.onAddButtonClick() }}>+Add event</Button>
          </ButtonGroup>
        </div>
        <br />
        <div>
          <Table striped responsive hover>
            <thead>
              <tr>
                <th>Actions</th>
                <th>Name</th>
                <th>Loation</th>
                <th>When?</th>
              </tr>
            </thead>
            <tbody>
              {
                this.state.events.map((event) => {
                  return (
                    <tr>
                      <td>
                        <ButtonGroup >
                          <Button key={event.id} variant="success" onClick={() => { window.location.href = '/details' }}>View</Button>
                          <Button key={event.id} variant="primary" onClick={() => { this.onEditButtonClick(event.id) }}>Edit</Button>
                        </ButtonGroup>
                      </td>
                      <td>{event.name}</td>
                      <td>{event.mainLocation}</td>
                      <td>{event.eventDay}</td>
                    </tr>
                  )
                })
              }
            </tbody>
          </Table>
        </div>
      </div>
    )
  }

  render() {
    return (
      <div>
        <Container>
          <br />
          <Alert show={this.state.showAlert} onClose={this.handleAlertClose} key='alert' variant='warning' dismissible>
            {this.state.alertText}
          </Alert>
          <PageTitle title={"Events for " + this.props.userName + " :"} />
          {this.displayTable()}
        </Container>

        <Modal show={this.state.showModal} onHide={this.handleModalClose} size="lg" >
          <Modal.Header closeButton>
            <Modal.Title>{this.state.typeOfOperation} event</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <EventDetails ref={this.eventDetailsComponent} current={this.state.current} onSubmit={this.onSubmitClick} />
          </Modal.Body>
        </Modal>

      </div>
    );
  }
}