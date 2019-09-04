import React, { Component } from 'react';
import Users from './Users/Users';
import FilterByDate from './FilterByDate/FilterByDate';
import TimeChart from './TimeChart/TimeChart';
import axios from 'axios/index';
import * as helpers from '../helpers.js';
import './App.css';
import Swal from 'sweetalert2'

class App extends Component {
    state = {
        // users
        users: [],
        orderBy: '',
        orderDir: '',
        page: '',
        lastPage: '',
        // filter chart
        dateFrom: '',
        dateTo: '',
        userToCompare: null,
        topUsersByTime: [],
        chartType: 'users',
        project: null,
    };

    componentDidMount() {
        this.getUsers();
        this.getTopUsersByTime();
    }

    getUsers(queryParams = {}) {
        const queryString = this.buildUsersQuery(queryParams);
        let url = '/api/users';
        url += queryString ? '?' + queryString : '';

        axios.get(url).then(res => {
            this.setState({
                users: res.data.data,
                page: res.data.current_page,
                lastPage: res.data.last_page
            });
        }).catch(err => {
            console.log(err);
        })
    }

    getTopUsersByTime(queryParams = {}) {
        const queryString = this.buildTopUsersByTimeQuery(queryParams);
        let url = '/api/users/top-by-time';
        url += queryString ? '?' + queryString : '';

        axios.get(url).then(res => {

            if (res.data.length == 0) {
                let message = 'No data found to display on chart';

                if (queryParams.userId) {
                    message = 'No data found for compared user';
                }

                Swal.fire({
                    title: 'No Data',
                    text: message,
                    type: 'error',
                    confirmButtonText: 'Okay'
                });
                return;
            }

            if (queryParams.userId) {
                this.setState({
                    userToCompare: res.data[0]
                });
            }
            else {
                this.setState({
                    topUsersByTime: res.data
                });
            }
        }).catch(err => {
            console.log(err);
        })
    }

    buildUsersQuery(params) {
        const queryParams = {
            orderBy: (params.orderBy !== undefined) ? params.orderBy : this.state.orderBy,
            orderDir: (params.orderDir !== undefined) ? params.orderDir : this.state.orderDir,
            page: params.page ? params.page : this.state.page
        };

        return helpers.buildQueryString(queryParams);
    }

    buildTopUsersByTimeQuery(params) {
        const queryParams = {};

        if (params.userId) {
            queryParams.userId = params.userId;
        }

        if (params.projectId !== undefined) {
            queryParams.projectId = params.projectId;
        }
        else if (this.state.project !== null) {
            queryParams.projectId = this.state.project.id;
        }

        queryParams.dateFrom = params.dateFrom ? helpers.formatDate(params.dateFrom) : helpers.formatDate(this.state.dateFrom);
        queryParams.dateTo = params.dateTo ? helpers.formatDate(params.dateTo) : helpers.formatDate(this.state.dateTo);

        return helpers.buildQueryString(queryParams);
    }

    initDatabase() {
        // run init db procedure
        axios.post('/api/init-database').then(res => {
            // fetch the users again
            let queryParams = {
                orderBy: '',
                orderDir: '',
                page: 1
            };

            this.getUsers(queryParams);

            // fetch top users again
            queryParams = {
                userId: '',
                dateFrom: '',
                dateTo: '',
            };
            this.getTopUsersByTime(queryParams);

            // reset state
            this.setState({
                // users
                users: [],
                orderBy: '',
                orderDir: '',
                page: '',
                lastPage: '',
                // filter chart
                dateFrom: '',
                dateTo: '',
                userToCompare: null,
                topUsersByTime: [],
                chartType: 'users',
                project: null,
            });
        }).catch(err => {
            console.log(err);
        })
    }

    handleSetOrder(column) {
        const queryParams = {
            orderDir: 'asc' // default
        };

        queryParams.orderDir = (this.state.orderDir == 'asc') ? 'desc' : 'asc';
        queryParams.orderBy = column;

        this.setState({
            orderBy: queryParams.orderBy,
            orderDir: queryParams.orderDir
        });

        this.getUsers(queryParams);
    }

    handleSetPage(page, e) {
        e.preventDefault();

        const queryParams = {};

        if (page == 'prev') {
            queryParams.page = (this.state.page > 1) ? this.state.page-1 : 1;
        }
        else if (page == 'next') {
            queryParams.page = (this.state.page != this.state.lastPage) ? this.state.page+1 : this.state.lastPage;
        }
        else {
            queryParams.page = page;
        }

        this.setState({
            page: queryParams.page
        });

        this.getUsers(queryParams);
    }

    handleDateChange(date, type) {
        if (type == 'from') {
            this.setState({ dateFrom: date });

            this.getTopUsersByTime({ dateFrom: date });

            if (this.state.userToCompare) {
                this.getTopUsersByTime({
                    userId: this.state.userToCompare.id,
                    dateFrom: date
                });
            }
        }
        else if (type == 'to') {
            this.setState({ dateTo: date });

            this.getTopUsersByTime({ dateTo: date });

            if (this.state.userToCompare) {
                this.getTopUsersByTime({
                    userId: this.state.userToCompare.id,
                    dateTo: date
                });
            }
        }
    }

    handleCompareUser(userId) {
        this.getTopUsersByTime({ userId: userId });
    }

    handleSetChartType(chartType) {
        let newState = {
            chartType: chartType
        };

        if (chartType == 'users') {
            newState.project = null;

            this.getTopUsersByTime({
                projectId: ''
            });
        }

        this.setState(newState);
    }

    handleSetProject(project) {
        this.setState({
            project: project
        });

        this.getTopUsersByTime({
            projectId: project.id
        });

        if (this.state.userToCompare) {
            this.getTopUsersByTime({
                userId: this.state.userToCompare.id,
                projectId: project.id
            });
        }
    }

    render() {
        return (
            <div className="container-fluid mt-5">
                <div className="row dashboard">
                    <div className="col-12 col-md-6">
                        <FilterByDate dateFrom={this.state.dateFrom} dateTo={this.state.dateTo}
                                      onDateChange={(date, type) => this.handleDateChange(date, type)} />
                        <Users users={this.state.users} page={this.state.page} lastPage={this.state.lastPage}
                               orderBy={this.state.orderBy} orderDir={this.state.orderDir} onSetPage={(page, e) => this.handleSetPage(page, e)}
                               onSetOrder={(column) => this.handleSetOrder(column)} onCompareUser={(userId) => this.handleCompareUser(userId)} />
                    </div>
                    <div className="col-12 col-md-6">
                        <TimeChart topUsersByTime={this.state.topUsersByTime} userToCompare={this.state.userToCompare}
                                   dateFrom={this.state.dateFrom} dateTo={this.state.dateTo} chartType={this.state.chartType} project={this.state.project}
                                   onSetChartType={(chartType) => this.handleSetChartType(chartType)}
                                   onSetProject={(project) => this.handleSetProject(project)}/>
                    </div>
                </div>
                <div className="row">
                    <div className="col"><button className="btn btn-primary d-block m-auto" onClick={() => this.initDatabase()}>Init Database</button></div>
                </div>
            </div>
        );
    }
}

export default App;
