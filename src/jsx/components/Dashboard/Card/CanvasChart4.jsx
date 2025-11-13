import React, { Component } from "react";
import { Line } from "react-chartjs-2";

class CanvasChart4 extends Component {
  render() {
	 
      const data = {
		labels: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "January", "February", "March", "April"],
       datasets: [
        {
			label: "Sales Stats",
			borderColor: 'transparent',
			pointBackgroundColor: '#44814E',
			pointBorderColor: '#44814E',
			borderWidth:4,
			borderRadius:10,
			pointHoverBackgroundColor: '#44814E',
			pointHoverBorderColor: '#44814E',
			backgroundColor: "rgba(68, 129, 78, 1)",
			data: [12, 20, 18, 16, 20, 22, 18, 20, 22, 24, 17, 14, 24, 21, 13, 15, 27, 29, 21, 11, 14, 19, 21, 17],
			fill: true,
			tension: 0.4,
        },
      ],
    };

    const options = {
		plugins:{
			title: {
				display: !1
			},
			tooltip: {
				intersect: !1,
				mode: "nearest",
				xPadding: 10,
				yPadding: 10,
				caretPadding: 10
			},
			
			legend: {
				display: !1
			},	
		},
		responsive: !0,
		maintainAspectRatio: !1,
		hover: {
			mode: "index"
		},
		scales: {
			x: {
				display: !1,
				grid: !1,
				scaleLabel: {
					display: !0,
					labelString: "Month"
				}
			},
			y: {
				display: !1,
				grid: !1,
				scaleLabel: {
					display: !0,
					labelString: "Value"
				},
				ticks: {
					beginAtZero: !0
				}
			}
		},
		elements: {
			point: {
				radius: 0,
				borderWidth: 0
			}
		},
		layout: {
			padding: {
				left: 0,
				right: 0,
				top: 5,
				bottom: 0
			}
		}
      
    };

    return (
      <div >
        <Line
          data={data}
         // width={this.props.width ? this.props.width : 433}
          height={this.props.height ? this.props.height : 80}
          options={options}
        />
      </div>
    );
  }
}

export default CanvasChart4;
