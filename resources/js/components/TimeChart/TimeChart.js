import React, { Component } from 'react';
import Chart from 'react-google-charts';
import './TimeChart.css';
import Moment from 'moment';

export default class TimeChart extends Component {

    render() {
        let chart = null;
        let projectLabel = 'All Projects';

        if (this.props.project && this.props.project.name != '-Select-') {
            projectLabel = this.props.project.name;
        }

        if (this.props.topUsersByTime.length > 0) {
            let chartData = [];
            chartData.push(['User', projectLabel, { role: 'style' }]);

            this.props.topUsersByTime.forEach(user => {
                chartData.push([user.name, user.sum_hours, '#3366cc']);
            });

            if (this.props.userToCompare) {
                chartData.push([this.props.userToCompare.name, this.props.userToCompare.sum_hours, '#f00']);
            }

            let title = 'Top 10 Users By Hours ';

            if (this.props.dateFrom) {
                title += ' from ' + Moment(this.props.dateFrom).format('YYYY-MM-DD');
            }
            if (this.props.dateTo) {
                title += ' to ' + Moment(this.props.dateTo).format('YYYY-MM-DD');
            }

            chart = <Chart
                width={'700px'}
                height={'500px'}
                chartType="BarChart"
                loader={<div>Loading...</div>}
                data={chartData}
                options={{
                    title: title,
                    chartArea: { width: '50%' },
                    hAxis: {
                        title: 'Hours',
                        minValue: 0,
                    },
                }}
                // For tests
                rootProps={{ 'data-testid': '1' }}
            />;
        }

        return (
            <div className='mt-5'>
                {chart}
                <div className='chart-options'>
                    <label className="d-block"><input name="chart_type" type="radio" checked={this.props.chartType == 'users' ? 'checked' : ''}
                        onChange={() => this.props.onSetChartType('users')}/> Users</label>
                    <label className="d-block"><input name="chart_type" type="radio"
                        onChange={() => this.props.onSetChartType('projects')}/> Projects</label>
                    <select name="projects" className={this.props.chartType == 'users' ? 'd-none' : ''}
                        onChange={(e) => this.props.onSetProject({ id: e.target.value, name: e.target.options[e.target.selectedIndex].text }) }>
                        <option value="">-Select-</option>
                        <option value="1">My Own</option>
                        <option value="2">Outcons</option>
                        <option value="3">Free Time</option>
                    </select>
                </div>
            </div>
        );
    }
}