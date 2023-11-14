import React, { Component } from "react";
import { Button, Modal, ModalBody } from "reactstrap";
import Spinner from "../../Spinner/Spinner";

import axios from "axios";

import { connect } from "react-redux";
import { resetIngredients } from "../../../redux/actionCreators";
import { Link } from "react-router-dom";

const mapStateToProps = (state) => {
  return {
    ingredients: state.ingredients,
    totalPrice: state.totalPrice,
    purchasable: state.purchasable,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    resetIngredients: () => dispatch(resetIngredients()),
  };
};

class Checkout extends Component {
  state = {
    values: {
      deliveryAddress: "",
      phone: "",
      paymentType: "Cash On Delivery",
    },
    isLoading: false,
    isModalOpen: false,
    modalMsg: "",
  };

  inputChangerHandler = (e) => {
    this.setState({
      values: {
        ...this.state.values,
        [e.target.name]: e.target.value,
      },
    });
  };

  submitHandler = () => {
    this.setState({ isLoading: true });
    const order = {
      ingredients: this.props.ingredients,
      customer: this.state.values,
      price: this.props.totalPrice,
      orderTime: new Date(),
    };
    axios
      .post(
        "https://burger-builder-5486f-default-rtdb.asia-southeast1.firebasedatabase.app/orders.json",
        order
      )
      .then((response) => {
        if (response.status === 200) {
          this.setState({
            isLoading: false,
            isModalOpen: true,
            modalMsg: "Order Placed Successfully!",
          });
          this.props.resetIngredients();
        } else {
          this.setState({
            isLoading: false,
            isModalOpen: true,
            modalMsg: "Something Went Wrong! Order Again!",
          });
        }
      })
      .catch((err) => {
        this.setState({
          isLoading: false,
          isModalOpen: true,
          modalMsg: "Something Went Wrong! Order Again!",
        });
      });
  };

  render() {
    let form = (
      <div>
        <h4
          style={{
            border: "1px solid grey",
            boxShadow: "1px 1px #888888",
            borderRadius: "5px",
            padding: "20px",
          }}
        >
          Payment: {this.props.totalPrice} BDT
        </h4>
        <form
          style={{
            border: "1px solid grey",
            boxShadow: "1px 1px #888888",
            borderRadius: "5px",
            padding: "20px",
          }}
        >
          <textarea
            name="deliveryAddress"
            value={this.state.values.deliveryAddress}
            className="form-control"
            placeholder="Your Address"
            onChange={(e) => this.inputChangerHandler(e)}
          ></textarea>
          <br />
          <input
            name="phone"
            className="form-control"
            value={this.state.values.phone}
            placeholder="Your Phone Number"
            onChange={(e) => this.inputChangerHandler(e)}
          />
          <br />
          <select
            name="paymentType"
            className="form-control"
            value={this.state.values.paymentType}
            onChange={(e) => this.inputChangerHandler(e)}
          >
            <option value="Cash On Delivery">Cash On Delivery</option>
            <option value="Bkash">Bkash</option>
          </select>
          <br />
          <Button
            style={{ backgroundColor: "#D70F64", marginRight: "5px" }}
            className="mr-auto"
            onClick={this.submitHandler}
            disabled={!this.props.purchasable}
          >
            Place Order
          </Button>
          <Link to="/">
            <Button color="secondary" className="ml-3">
              Cancel
            </Button>
          </Link>
        </form>
      </div>
    );
    return (
      <div>
        {this.state.isLoading ? <Spinner /> : form}
        <Link to="/">
          <Modal isOpen={this.state.isModalOpen}>
            <ModalBody>
              <p>{this.state.modalMsg}</p>
            </ModalBody>
          </Modal>
        </Link>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Checkout);
