import React, { useState } from 'react'
import { Button, Form, InputGroup, Modal, NavDropdown } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Swal from 'sweetalert2';
const Header = ({ theme, toggleTheme }) => {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
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
    const logout = () => {
        Swal.fire({
            icon: "question",
            title: "Bạn muốn đăng xuất ?",
            showDenyButton: true,
            showCancelButton: false,
            confirmButtonText: "Đăng xuất",
            denyButtonText: `Hủy`,
        }).then((result) => {
            if (result.isConfirmed) {
                Toast.fire({
                    icon: "success",
                    title: "Đăng xuất thành công",
                }).then(() => {
                    localStorage.removeItem('apitoken');
                    localStorage.removeItem('username');
                    window.location.reload();
                });
            } else if (result.isDenied) {
            }
        });

    }
    return (
        <Container>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Thông tin tài khoản</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <InputGroup className="mb-3">
                        <InputGroup.Text id="inputGroup-sizing-default">
                            Username
                        </InputGroup.Text>
                        <Form.Control
                            aria-label="Default"
                            aria-describedby="inputGroup-sizing-default"
                            value={localStorage.getItem('username')}
                            readOnly
                        />
                    </InputGroup>
                    <InputGroup className="mb-3">
                        <InputGroup.Text id="inputGroup-sizing-default" >
                            API
                        </InputGroup.Text>
                        <Form.Control
                            aria-label="Default"
                            aria-describedby="inputGroup-sizing-default"
                            value={localStorage.getItem('apitoken')}
                            readOnly
                        />
                    </InputGroup>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
            <Navbar expand="lg" data-bs-theme="dark" id={theme} >
                <Container>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" id={theme} />
                    <Navbar.Collapse>
                        <Nav className="me-auto" >
                            <Nav.Link href="/"><span id={theme}><b>Nhóm 2</b></span></Nav.Link>
                            <Nav.Link href={localStorage.getItem('apitoken') ? "/todo_1_account" : "/todo_0_account"}><span id={theme}><b>Task</b></span></Nav.Link>
                            {/* <Nav.Link href={localStorage.getItem('apitoken') ? "/report" : "/login"}><span id={theme}><b>Report</b></span></Nav.Link>
                            <NavDropdown title={<box-icon name='user' type='solid' color="#ffffff" ></box-icon>} id="basic-nav-dropdown">
                                <NavDropdown.Item onClick={() => (
                                    localStorage.getItem('apitoken') ? handleShow() : window.location.replace("/login")
                                )}>Tài khoản</NavDropdown.Item >
                                <NavDropdown.Divider />
                                <NavDropdown.Item onClick={logout}>Đăng xuất</NavDropdown.Item>
                            </NavDropdown> */}
                        </Nav>

                        <div className="form-check form-switch">
                            <label className="form-check-label"><b>Dark mode</b></label>
                            <input className="form-check-input" type="checkbox" role="switch" onChange={() => toggleTheme()} id="flexSwitchCheckDefault" />
                        </div>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </Container>
    )
}

export default Header