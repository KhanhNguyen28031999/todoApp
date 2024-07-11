import React, { useState } from "react";
import { Button, Checkbox, Form, Input } from "antd";

import "../css/Login_Register.css";
import Swal from "sweetalert2";

const onFinish = (values) => {
  console.log("Success:", values);
};

const onFinishFailed = (errorInfo) => {
  console.log("Failed:", errorInfo);
};

const Login = () => {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [loadings, setLoadings] = useState([]);

  const enterLoading = (index) => {
    setLoadings((prevLoadings) => {
      const newLoadings = [...prevLoadings];
      newLoadings[index] = true;
      return newLoadings;
    });
    setTimeout(() => {
      setLoadings((prevLoadings) => {
        const newLoadings = [...prevLoadings];
        newLoadings[index] = false;
        return newLoadings;
      });
    }, 1500);
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
  const login = () => {
    var data = new URLSearchParams();
    data.append("username", username);
    data.append("userpassword", password);
    fetch("http://localhost:3001/user/login?" + data, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.check === true) {
          Toast.fire({
            icon: "success",
            title: "Đăng nhập thành công",
          }).then(() => {
            localStorage.setItem("username", username);
            localStorage.setItem("apitoken", res.apitoken);
            localStorage.setItem("idRole", res.idRole);
            window.location.replace("/todo_1_account");
          });
        } else {
          Toast.fire({
            icon: "error",
            title: res.error,
          });
        }
      });
  };
  return (
    <div>
      <Form
        className="form-login"
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        layout="vertical"
      >
        <Form.Item
          label="Tài khoản"
          name="username"
          rules={[{ required: true, message: "Hãy nhập tài khoản!" }]}
          onChange={(e) => setUserName(e.target.value)}
        >
          <Input className="form-item-input" />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Hãy nhập mật khẩu!" }]}
          onChange={(e) => setPassword(e.target.value)}
        >
          <Input.Password className="form-item-input" />
        </Form.Item>

        <Form.Item
          name="remember"
          valuePropName="checked"
          wrapperCol={{ offset: 8, span: 16 }}
        >
          <Checkbox>Lưu mật khẩu</Checkbox>
        </Form.Item>
      </Form>
      ;
      <Button type="primary" htmlType="submit" loading={loadings[1]} onClick={() => { login(); enterLoading(1) }}>
        <span>Đăng nhập</span>
      </Button>
    </div>
  );
};

export default Login;
