import React from "react";
import ReactApexChart from "react-apexcharts";

class ApexPieChart2 extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			series: [30, 40, 20, 30],
			options: {
				chart: {
					type: 'donut',
					height: 260,
				},
				dataLabels:{
					enabled: false
				},
				stroke: {
				  width: 0,
				},
				colors:['#2251F8', '#50D37D', '#AB31E4','#F87C22'],
				legend: {
					position: 'bottom',
					show:false
				},
				responsive: [{
					breakpoint: 768,
					options: {
						chart: {
							height:200
						},
					}
				}]
			},
		};
	}

	render() {
		return (
			<div id="chart" >
				<ReactApexChart
				  options={this.state.options}
				  series={this.state.series}
				  type="donut"
				  height={260} 
				/>
			</div>
		);
	}
}

export default ApexPieChart2;