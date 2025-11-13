import React from "react";
import ReactApexChart from "react-apexcharts";

class LineChart extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			series: [
				{
					name: "Income",
					data: [10, 30, 20, 40, 20, 45, 10]
				},
				{
					name: "Expense",
					data: [10, 15, 10, 30, 15, 35, 5]
				},
				{
					name: "Unknown",
					data: [5, 15, 5, 15, 10, 25, 5]
				}
			],
			options: {
				chart: {
					type: 'line',
					height: 170,					
					toolbar: {
						show: false,
					},
					zoom: {
						enabled: false
					},
				},
				colors:['#10B981','#FFB252','#969ba0'],
				dataLabels: {
				  enabled: false
				},
				stroke: {
				  curve: 'smooth',
				  width:3
				},
				legend:{
					show:false
				},
				
				grid: {
				  /* row: {
					colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
					opacity: 0.5
				  }, */
				   xaxis: {
						lines: {
							show: true
						}
					},  
				},
				xaxis: {
				  categories: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
				},
				yaxis:{
					show:false
				}
			},
		};
	}

	render() {
		return (
			<div id="chart" >
				<ReactApexChart
				  options={this.state.options}
				  series={this.state.series}
				  type="line"
				  height={170}
				/>
			</div>
		);
	}
}

export default LineChart;