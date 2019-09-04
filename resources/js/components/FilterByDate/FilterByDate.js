import React, { Component } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default class FilterByDate extends Component {

    render() {
        return (
            <React.Fragment>
                <label className='mr-3'>From: <DatePicker selected={this.props.dateFrom} onChange={date => this.props.onDateChange(date, 'from')} dateFormat="yyyy-MM-dd" /></label>
                <label>To: <DatePicker selected={this.props.dateTo} onChange={date => this.props.onDateChange(date, 'to')} dateFormat="yyyy-MM-dd" /></label>
            </React.Fragment>
        );
    }
}