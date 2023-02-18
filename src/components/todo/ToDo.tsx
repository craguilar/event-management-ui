import React, { useEffect, useState } from "react";
import Task from "./model/Task";
import { TaskRepository } from "./TaskRepository";
import Container from "react-bootstrap/Container";
import ListGroup from "react-bootstrap/ListGroup";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { IoIosAdd } from "react-icons/io";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Alert from "react-bootstrap/Alert";
import Badge from "react-bootstrap/Badge";

enum STATUS {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
}

export interface ToDoProps {
  eventId: string;
}

function ToDo(props: ToDoProps) {
  const [input, setInput] = useState("");
  const [pendingTasks, setPendingTasks] = useState<Task[]>([]);
  const [completedTasks, setCompletedTasks] = useState<Task[]>([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertText, setAlertText] = useState("");
  const repository = new TaskRepository();

  const handleErrorFromServer = (error: Response) => {
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
  };

  const onInput = (event: React.BaseSyntheticEvent): void => {
    setInput(event.currentTarget.value as string);
  };

  useEffect(() => {
    listTasks();
  }, []);

  const listTasks = () => {
    function processTasks(allTasks: Task[]) {
      const pending: Task[] = [];
      const completed: Task[] = [];
      allTasks.forEach((e: Task) => {
        if (e.status == STATUS.PENDING) {
          pending.push(e);
        } else {
          completed.push(e);
        }
      });
      setPendingTasks(pending);
      setCompletedTasks(completed);
    }
    repository
      .list(props.eventId)
      .then(results => {
        processTasks(results);
      })
      .catch(error => {
        setAlertText(handleErrorFromServer(error));
        setShowAlert(true);
      });
  };

  const onMarkAsDone = (event: any, todo: Task) => {
    todo.status = STATUS.COMPLETED;
    repository
      .update(props.eventId, todo)
      .then(() => {
        listTasks();
      })
      .catch(error => {
        setAlertText(handleErrorFromServer(error));
        setShowAlert(true);
      });
  };

  const onUnMarkAsDone = (event: any, todo: Task) => {
    todo.status = STATUS.PENDING;
    repository
      .update(props.eventId, todo)
      .then(() => {
        listTasks();
      })
      .catch(error => {
        setAlertText(handleErrorFromServer(error));
        setShowAlert(true);
      });
  };

  const addTask = () => {
    const task: Task = {
      name: input,
      status: STATUS.PENDING,
    };
    repository
      .add(props.eventId, task)
      .then(() => {
        setInput("");
        listTasks();
      })
      .catch(error => {
        setAlertText(handleErrorFromServer(error));
        setShowAlert(true);
      });
  };

  const handleAlertClose = () => {
    setShowAlert(false);
    setAlertText("");
  };

  return (
    <div>
      <Alert
        show={showAlert}
        onClose={handleAlertClose}
        variant="warning"
        dismissible
      >
        {alertText}
      </Alert>
      <Container>
        <Row>
          <Col xs={2}></Col>
          <Col>
            <InputGroup>
              <Form.Control
                type="text"
                placeholder="Pick up kids at 3 pm..."
                value={input}
                onInput={onInput}
                required
              />
              <Button variant="success" id="button-addon1" onClick={addTask}>
                <IoIosAdd /> Task
              </Button>
            </InputGroup>
          </Col>
          <Col xs={2}></Col>
        </Row>
        <br />
        <h4>Tasks</h4>
        <Row>
          <Col>
            <p>
              <b>Pending</b> - <i>Total pending {pendingTasks.length}</i>
            </p>
            <ListGroup>
              {pendingTasks.map(todo => {
                return (
                  <ListGroup.Item key={"ig-todo" + todo.id}>
                    <input
                      key={"input-todo" + todo.id}
                      type="checkbox"
                      onChange={e => {
                        onMarkAsDone(e, todo);
                      }}
                    />
                    {" " + todo.name}
                    <Badge bg="secondary" className="float-end">
                      {todo.status}
                    </Badge>
                  </ListGroup.Item>
                );
              })}
            </ListGroup>
          </Col>
          <Col>
            <p>
              <b>Completed</b> - <i>Total completed {completedTasks.length}</i>
            </p>
            <ListGroup>
              {completedTasks.map(todo => {
                return (
                  <ListGroup.Item key={"lg" + todo.id}>
                    <input
                      key={"input" + todo.id}
                      type="checkbox"
                      checked={true}
                      onChange={e => {
                        onUnMarkAsDone(e, todo);
                      }}
                    />
                    <s>{" " + todo.name}</s>
                    <Badge
                      key={"badge" + todo.id}
                      bg="success"
                      className="float-end"
                    >
                      {todo.status}
                    </Badge>
                  </ListGroup.Item>
                );
              })}
            </ListGroup>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default ToDo;
