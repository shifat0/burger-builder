import React, { Component } from "react";
import { Formik } from "formik";
import { auth } from "../../redux/authActions";
import { connect } from "react-redux";
import Spinner from "../Spinner/Spinner";
import { Alert } from "reactstrap";

const mapDispatchToProps = (dispatch) => {
  return {
    auth: (email, password, mode) => dispatch(auth(email, password, mode)),
  };
};

const mapStateToProps = (state) => {
  return {
    authLoading: state.authLoading,
    authErrorMessage: state.authErrorMessage,
  };
};

class Auth extends Component {
  state = {
    mode: "signup",
  };

  switchMode = () => {
    this.setState({ mode: this.state.mode === "signup" ? "login" : "signup" });
  };

  render() {
    return (
      <>
        {this.props.authLoading ? (
          <Spinner />
        ) : (
          <div
            style={{
              borderRadius: "15px",
              padding: "50px",
              textAlign: "center",
              width: "50vw",
              margin: "50px auto",
              boxShadow: "5px 5px 10px 2px lightgray",
            }}
          >
            {this.props.authErrorMessage && (
              <Alert color="danger">{this.props.authErrorMessage}</Alert>
            )}
            <button
              className="btn w-100 mb-4"
              style={{ backgroundColor: "#D70F64", color: "white" }}
              onClick={this.switchMode}
            >
              Switch to {this.state.mode === "signup" ? "Login" : "Sign Up"}
            </button>
            <Formik
              initialValues={{ email: "", password: "", confirmPassword: "" }}
              onSubmit={(values) => {
                this.props.auth(values.email, values.password, this.state.mode);
                localStorage.getItem("token") && this.props.navigate("/");
              }}
              validate={(values) => {
                const errors = {};

                if (!values.email) errors.email = "Required";
                else if (
                  !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
                )
                  errors.email = "Invalid email address";

                if (!values.password) errors.password = "Required";
                else if (values.password.length < 5)
                  errors.password =
                    "Password length must be greater than 5 characters";

                if (this.state.mode === "signup") {
                  if (!values.confirmPassword)
                    errors.confirmPassword = "Required";
                  else if (values.password !== values.confirmPassword)
                    errors.confirmPassword = "Password doesn't match";
                }

                return errors;
              }}
            >
              {({ values, handleChange, handleSubmit, errors }) => (
                <form onSubmit={handleSubmit}>
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    onChange={handleChange}
                    value={values.email}
                    placeholder="Enter Your Email"
                  />
                  <span style={{ color: "red" }}>{errors.email}</span>
                  <br />
                  <input
                    type="password"
                    name="password"
                    className="form-control"
                    onChange={handleChange}
                    value={values.password}
                    placeholder="Password"
                  />
                  <span style={{ color: "red" }}>{errors.password}</span>
                  <br />
                  {this.state.mode === "signup" && (
                    <input
                      type="password"
                      name="confirmPassword"
                      className="form-control"
                      onChange={handleChange}
                      value={values.confirmPassword}
                      placeholder="Confirm Password"
                    />
                  )}
                  <span style={{ color: "red" }}>{errors.confirmPassword}</span>

                  <br />
                  <button type="submit" className="btn btn-success w-25 m-auto">
                    {this.state.mode === "signup" ? "Sign Up" : "Login"}
                  </button>
                </form>
              )}
            </Formik>
          </div>
        )}
      </>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Auth);
