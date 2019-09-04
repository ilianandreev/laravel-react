import React, { Component } from 'react';
import './Users.css';

class Users extends Component {

    render() {
        let pages = [];

        for (let i=1; i <= this.props.lastPage; i++) {
            let pageClasses = ['page-item'];
            if (i == this.props.page) {
                pageClasses.push('active');
            }

            pages.push(<li className={pageClasses.join(' ')} key={i}><a className="page-link" href="#" onClick={(e) =>  this.props.onSetPage(i, e)}>{i}</a></li>);
        }

        return (
            <React.Fragment>
                <table className="table table-striped users">
                    <thead className="thead-dark">
                    <tr>
                        <th scope="col-md-3">#</th>
                        <th scope="col-md-3" className="sortable-header" onClick={() => this.props.onSetOrder('firstname')}>Firstname</th>
                        <th scope="col-md-3" className="sortable-header" onClick={() => this.props.onSetOrder('lastname')}>Lastname</th>
                        <th scope="col-md-3" className="sortable-header" onClick={() => this.props.onSetOrder('email')}>Email</th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.props.users.map((user, index) =>
                        <tr key={index}>
                            <th scope="row">{user.id}</th>
                            <td>{user.firstname}</td>
                            <td>{user.lastname}</td>
                            <td>{user.email}</td>
                            <td><button type="button" className="btn btn-success" onClick={() => this.props.onCompareUser(user.id)}>Compare</button></td>
                        </tr>
                    )}
                    </tbody>
                </table>
                <ul className="pagination justify-content-center">
                    <li className="page-item"><a className="page-link" href="#" onClick={(e) => this.props.onSetPage('prev', e)}>Previous</a></li>
                    {pages}
                    <li className="page-item"><a className="page-link" href="#" onClick={(e) => this.props.onSetPage('next', e)}>Next</a></li>
                </ul>
            </React.Fragment>
        );
    }
}

export default Users;