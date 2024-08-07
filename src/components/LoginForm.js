import React, { useState } from "react";
import login from "../login";

class LoginForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
            response: "",
            isLoading: false,
            showModal: false
        };
    }

    login = async e => {
        e.preventDefault();
        this.setState({ isLoading: true })
        const response = await login(this.state.email, this.state.password);
        this.setState({ response });
        this.setState({ isLoading: false });
        return false;
    };

    handleChange = e => {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    };

    openModal(data) {

        if (data) {
            var myModal = new bootstrap.Modal('#exampleModal');
            myModal.toggle();
        }

    }

    render() {
        return (
            <div>
                <form onSubmit={this.login}>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            className="form-control"
                            id="email"
                            name="email"
                            value={this.state.email}
                            onChange={this.handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            className="form-control"
                            id="password"
                            name="password"
                            value={this.state.password}
                            onChange={this.handleChange}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary">
                        Sign In
                    </button>
                </form>
                {this.state.isLoading ? (
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                ) : null}

                {this.state.response && (
                    this.openModal(this.state.response)
                )}

                <div className="modal fade" id="exampleModal">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h4>Breached accounts</h4>
                            </div>
                            <div className="card">
                                <div className="card-body">
                                    <ul>
                                        {this.state.response && this.state.response.breachedAccounts.map((breach, index) => {
                                            return (
                                                <li key={index}>
                                                    <p>{breach.name}</p>
                                                </li>
                                            )
                                        })}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default LoginForm;
