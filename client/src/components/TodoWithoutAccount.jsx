import React, { useEffect, useState } from "react";
import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/Container";
import { CloseButton, Col, ListGroup, Row } from "react-bootstrap";
import { Button, Checkbox } from "antd";
import Swal from "sweetalert2";
import "boxicons";
import '../css/todo.css'
const TodoWithoutAccount = ({ theme, toggleTheme }) => {
    const [todo, setTodo] = useState([]);
    const [item, setItem] = useState('');
    const [item1, setItem1] = useState('');
    const [id, setId] = useState(0);
    const [currentPage, setCurrentPage] = useState(-1);
    const [addTask, setAddTask] = useState(false);
    const [isLoading, setLoading] = useState(false);
    const [isLoading1, setLoading1] = useState(false);
    const [isLoading2, setLoading2] = useState(false);
    const [number, setNumber] = useState(0);
    const [type, setType] = useState('');
    useEffect(() => {
        function simulateNetworkRequest() {
            return new Promise((resolve) => setTimeout(resolve, 1500));
        }

        if (isLoading) {
            simulateNetworkRequest().then(() => {
                setLoading(false);
            });
        }
    }, [isLoading]);

    const handleClick = () => setLoading(true);

    const getTodo = () => {
        if (localStorage.getItem("todo")) {
            setTodo(JSON.parse(localStorage.getItem("todo")));
        }
    };
    const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener("mouseenter", Swal.stopTimer);
            toast.addEventListener("mouseleave", Swal.resumeTimer);
        },
    });
    const calculateRemainingTasks = () => {
        return todo.filter(todo => todo.isCompleted === false).length;
    };
    const editTodoName = (event) => {
        if (event.key === "Enter" && item1) {
            var todos = JSON.parse(localStorage.getItem('todo')) || [];
            todos.map(todo => {
                if (todo.id === id) {
                    todo.taskname = item1;
                    todo.edit = false;
                }
            })
            localStorage.setItem('todo', JSON.stringify(todos));
            getTodo();
            setItem1('');
        }
    }

    const changeEditTodoName = (old, id) => {
        var todos = JSON.parse(localStorage.getItem('todo')) || [];
        todos.map(todo => {
            if (todo.id === id) {
                todo.edit = true;
            }
        })
        localStorage.setItem('todo', JSON.stringify(todos));
        setId(id)
        setItem1(old);
        getTodo();
    }
    const todoList = todo.map((item) => (
        <ListGroup.Item key={item.id} id={theme}>
            <Row>
                <Col className="col-1 mt-1">
                    {item.isCompleted === false ? (
                        <Checkbox
                            className="form-check-input"
                            type="checkbox"
                            onChange={(e) => updateTodo(item.id, e)}
                            name=""
                            id=""
                        />
                    ) : (
                        <Checkbox type="checkbox" checked disabled name="" id="" />
                    )}
                </Col>
                <Col className="col-6 mt-1"><Col className='col-md-4'>
                    {
                        item.edit === true ?
                            <input type="text" value={item1} onChange={(e) => (setItem1(e.target.value))} onKeyDown={editTodoName} />
                            :
                            (item.isCompleted === 1 ?
                                <label className="form-check-label" onDoubleClick={() => changeEditTodoName(item.taskname, item.id)} ><s>{item.taskname}</s></label>
                                :
                                <label className="form-check-label" onDoubleClick={() => changeEditTodoName(item.taskname, item.id)}>{item.taskname}</label>
                            )
                    }
                </Col></Col>
                <Col className="col-3 mt-1">{item.estPomodoro}</Col>
                <Col className="col-2">
                    <Button
                        className="btn btn-danger btn-sm"
                        disabled={isLoading1}
                        onClick={() => deleteTodo(item.id)}
                    >
                        {isLoading1 ? "..." : <box-icon name="trash" color="#ffffff"></box-icon>}
                    </Button>
                </Col>
            </Row>
        </ListGroup.Item >
    ));
    useEffect(() => {
        getTodo();
    }, []);
    const addTodo = () => {
        Toast.fire({
            icon: "success",
            title: "Add successfully",
        }).then(() => {
            var item1 = {
                id: Date.now(),
                taskname: item,
                tasktype: type,
                estPomodoro: number,
                isCompleted: false,
                edit: false,
            };
            setItem('');
            setType('');
            setNumber(0);
            var temp = [];
            if (localStorage.getItem("todo")) {
                temp = JSON.parse(localStorage.getItem("todo"));
            }
            temp = [...temp, item1];
            localStorage.setItem("todo", JSON.stringify(temp));
            setTodo([...todo, item1]);
        });
    };

    const deleteTodo = (i) => {
        Swal.fire({
            icon: "question",
            title: "Xóa task này ?",
            showDenyButton: true,
            showCancelButton: false,
            confirmButtonText: "Xóa",
            denyButtonText: `Hủy`,
        }).then((result) => {
            if (result.isConfirmed) {
                setLoading1(true);
                Toast.fire({
                    icon: "success",
                    title: "Xóa thành công",
                }).then(() => {
                    var temp = JSON.parse(localStorage.getItem("todo"));
                    temp = temp.filter((todo) => todo.id !== i);
                    localStorage.setItem("todo", JSON.stringify(temp));
                    setTodo(temp);
                    setLoading1(false);
                });
            } else if (result.isDenied) {
                setLoading1(false);
            }
        });
    };

    const updateTodo = (i, e) => {
        Swal.fire({
            icon: "question",
            title: "Hoàn thành task này ?",
            showDenyButton: true,
            showCancelButton: false,
            confirmButtonText: "Xác nhận",
            denyButtonText: `Hủy`,
        }).then((result) => {
            if (result.isConfirmed) {
                Toast.fire({
                    icon: "success",
                    title: "Thực hiện thành công",
                }).then(() => {
                    var item = JSON.parse(localStorage.getItem("todo"));
                    item.map((todo) => {
                        if (todo.id === i) {
                            todo["isCompleted"] = true;
                        }
                    });
                    localStorage.setItem("todo", JSON.stringify(item));
                    changepage(currentPage);
                });
            } else if (result.isDenied) { }
        });
    };
    const deleteAll = () => {
        Swal.fire({
            icon: "question",
            title: "Xóa hết task ?",
            showDenyButton: true,
            showCancelButton: false,
            confirmButtonText: "Xóa hết task ?",
            denyButtonText: `Hủy`,
        }).then((result) => {
            setLoading2(true);
            if (result.isConfirmed) {
                Toast.fire({
                    icon: "success",
                    title: "Xóa hết thành công",
                }).then(() => {
                    localStorage.removeItem("todo");
                    setTodo([]);
                    setLoading2(false);
                });
            }
            else {
                setLoading2(false);
            }
        });
    };
    const changepage = (isCompleted) => {
        var item = JSON.parse(localStorage.getItem("todo")) || [];
        let filteredItems;

        switch (isCompleted) {
            case 0:
                filteredItems = item.filter((todo) => todo.isCompleted === false);
                break;
            case 1:
                filteredItems = item.filter((todo) => todo.isCompleted === true);
                break;
            default:
                filteredItems = item;
                break;
        }
        setCurrentPage(isCompleted);
        setTodo(filteredItems);
    };
    return (
        <div>
            <Container id={theme}>
                <h1 className="text-center mt-3 mb-3">Task</h1>
                <Nav justify variant="underline" id={theme} data-bs-theme={theme} className='bg-`+{theme}+`dark p-2'>
                    <Nav.Item>
                        <Nav.Link style={{ textDecorationColor: "white" }}
                            onClick={() => changepage(-1)}
                            active={currentPage === -1}
                        >
                            <span id={theme}><b>All</b></span>
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link onClick={() => changepage(0)} active={currentPage === 0}>
                            <span id={theme}><b>Active</b></span>
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link onClick={() => changepage(1)} active={currentPage === 1}>
                            <span id={theme}><b>Completed</b></span>
                        </Nav.Link>
                    </Nav.Item>
                </Nav>
                <Row className="row mt-3 ms-1" id={theme}>
                    <form className="form-inline">
                        <div className="row mb-3">
                            {
                                addTask === true ?
                                    <Row>
                                        <div role="dialog">
                                            <div role="document">
                                                <div>
                                                    <Row className='mb-3'>
                                                        <Col>

                                                        </Col>
                                                        <Col align="end" data-bs-theme={theme} className='bg-`+{theme}+`dark p-2'>
                                                            <CloseButton data-dismiss="modal" aria-label="Close" onClick={() => setAddTask(!addTask)} style={{ color: "white" }}>
                                                            </CloseButton>
                                                        </Col>
                                                    </Row>
                                                    <Row className='mb-3'>
                                                        <Col>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                value={item}
                                                                placeholder="Nhập task"
                                                                onChange={(e) => setItem(e.target.value)}

                                                            />
                                                        </Col>
                                                        <Col>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                placeholder="Nhập loại task..."
                                                                onChange={(e) => setType(e.target.value)}
                                                                id=""
                                                                value={type}
                                                            /></Col>
                                                    </Row>
                                                    <Row className='mb-3'>
                                                        <label>Thời gian</label>
                                                        <Col className='col-8'>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                value={number}
                                                                onChange={(e) => setNumber(parseInt(e.target.value))}
                                                            />
                                                        </Col>
                                                        <Col className='col'>
                                                            <Button variant='light' size="large" onClick={() => setNumber(parseInt(isNaN(number) ? 1 : number - 1) >= 1 ? parseInt(isNaN(number) ? 1 : number - 1) : 1)}><box-icon name='chevron-down'></box-icon></Button>
                                                            <Button variant='light' size="large" onClick={() => setNumber(parseInt(isNaN(number) ? 1 : number + 1))}><box-icon name='chevron-up'></box-icon></Button>
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col>
                                                            <Button variant='secondary' className='w-100' onClick={() => setAddTask(!addTask)}>Hủy</Button>
                                                        </Col>
                                                        <Col>
                                                            <Button
                                                                type="primary"
                                                                className="w-100"
                                                                disabled={isLoading || item.length === 0 ? true : false || type.length === 0 ? true : false || number === 0 ? true : false || isNaN(number) ? true : false}
                                                                onClick={() => (!isLoading ? handleClick() : null, addTodo())}
                                                                loading={isLoading}
                                                            >
                                                                {isLoading ? "Loading…" : "Thêm"}
                                                            </Button>
                                                        </Col>
                                                    </Row>
                                                </div>
                                            </div>
                                        </div>
                                    </Row>
                                    :
                                    <Row>
                                        <Button type='primary' size="large" className='w-100' onClick={() => setAddTask(!addTask)}>Thêm Task</Button>
                                    </Row>
                            }
                        </div>
                    </form >
                    <Row className="mt-3 mb-3" id={theme}>
                        {todo && <ListGroup style={{ paddingRight: 0 }}>
                            <ListGroup.Item id={theme}>
                                <Row>
                                    <Col className="col-1 mt-1">
                                        <b>#</b>
                                    </Col>
                                    <Col className="col-6 mt-1"><b>Tên task</b></Col>
                                    <Col className="col-3 mt-1"><b>Pomo</b></Col>
                                    <Col className="col-2">
                                    </Col>
                                </Row>
                            </ListGroup.Item >
                            {todoList}</ListGroup>}
                        <Row className="mt-3">
                            <Col></Col>
                            <Col align="end">
                                {todo.length === 0 ? (
                                    <Button
                                        disabled
                                        size="large"
                                        className="btn btn-danger w-100"
                                        onClick={deleteAll}
                                    >
                                        <span>Xóa tất cả</span>
                                    </Button>
                                ) : (
                                    <Button className="btn btn-danger w-100" onClick={deleteAll}
                                        size="large"
                                        disabled={isLoading2}
                                        loading={isLoading2}
                                    >
                                        {isLoading2 ? "Loading..." : "Xóa tất cả"}
                                    </Button>)}
                            </Col>
                        </Row>
                    </Row>
                    <Row className="row mb-3">
                        <Col className='col-8'>
                            <span>{calculateRemainingTasks()} {calculateRemainingTasks() <= 1 ? "task" : "tasks"} remaining</span>
                        </Col>
                        <Col className='col-4'>
                            MindX todolist
                        </Col>
                    </Row>
                </Row>
            </Container>
        </div >
    );
}

export default TodoWithoutAccount;
