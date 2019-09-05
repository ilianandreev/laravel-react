import React, { Component } from 'react';
import './App.css';
import Users from './Users/Users';
import FilterByDate from './FilterByDate/FilterByDate';
import TimeChart from './TimeChart/TimeChart';
import axios from 'axios/index';
import QueryString from 'query-string';
import Moment from 'moment';
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
        userIdToCompare: '',
        userToCompare: '',
        topUsersByTime: [],
        chartType: 'users',
        project: '',
    };

    componentDidMount() {
        this.getUsers();
        this.getTopUsersByTime();
    }

    getUsers() {
        const url = '/api/users?' + QueryString.stringify({
            orderBy: this.state.orderBy,
            orderDir: this.state.orderDir,
            page: this.state.page
        });

        axios.get(url).then(res => {
            this.setState({
                users: res.data.data,
                page: res.data.current_page,
                lastPage: res.data.last_page
            });
        }).catch(err => {
            console.log(err);
        });
    }

    getTopUsersByTime() {
        // always fetch the chart for Top Users because of data consistency if a user is being compared
        let queryParams = {};

        queryParams.projectId = this.state.project ? this.state.project.id : '';
        queryParams.dateFrom = this.state.dateFrom ? Moment(this.state.dateFrom).format('YYYY-MM-DD') : '';
        queryParams.dateTo = this.state.dateTo ? Moment(this.state.dateTo).format('YYYY-MM-DD') : '';

        const url = '/api/users/top-by-time?' + QueryString.stringify(queryParams);
        axios.get(url).then(res => {
            if (res.data.length == 0) {
                Swal.fire({
                    title: 'No Data',
                    text: 'No data found to display on chart',
                    type: 'error',
                    confirmButtonText: 'Okay'
                });
                return;
            }

            this.setState({
                topUsersByTime: res.data
            });
        }).catch(err => {
            console.log(err);
        });

        if (this.state.userIdToCompare) {
            queryParams.userId = this.state.userIdToCompare;
            const url = '/api/users/top-by-time?' + QueryString.stringify(queryParams);

            axios.get(url).then(res => {
                if (res.data.length == 0) {
                    Swal.fire({
                        title: 'No Data',
                        text: 'No data found for compared user',
                        type: 'error',
                        confirmButtonText: 'Okay'
                    });
                    this.setState({
                        userToCompare: ''
                    });
                    return;
                }

                this.setState({
                    userToCompare: res.data[0]
                });

            }).catch(err => {
                console.log(err);
            });
        }
    }

    initDatabase() {
        // run init db procedure
        axios.post('/api/init-database').then(res => {
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
                userIdToCompare: '',
                userToCompare: '',
                topUsersByTime: [],
                chartType: 'users',
                project: '',
            }, () => {
                this.getUsers();
                this.getTopUsersByTime();
            });
        }).catch(err => {
            console.log(err);
        })
    }

    handleSetOrder(column) {
        this.setState((state) => {
            return {
                orderBy: column,
                orderDir: (state.orderDir == 'asc') ? 'desc' : 'asc'
            };
        }, () => {
            this.getUsers();
        });
    }

    handleSetPage(page, e) {
        e.preventDefault();

        // page depends on previous one
        this.setState((state) => {
            if (page == 'prev') {
                page = (state.page > 1) ? state.page-1 : 1;
            }
            else if (page == 'next') {
                page = (state.page != state.lastPage) ? state.page+1 : state.lastPage;
            }

            return {
                page: page
            };

        }, () => this.getUsers());
    }

    handleDateChange(date, type) {
        let newState = {};

        if (type == 'from') {
            newState.dateFrom = date;
        }
        else {
            newState.dateTo = date;
        }

        this.setState(newState, () => this.getTopUsersByTime());
    }

    handleCompareUser(userId) {
        this.setState({
            userIdToCompare: userId
        }, () => {
            this.getTopUsersByTime();
        });
    }

    handleSetChartType(chartType) {
        let newState = {
            chartType: chartType
        };

        if (chartType == 'users') {
            newState.project = '';
            this.setState(newState, () => this.getTopUsersByTime());
        }
        else {
            this.setState(newState);
        }
    }

    handleSetProject(project) {
        this.setState({
            project: project
        }, () => this.getTopUsersByTime());
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
