import React, { Component } from "react";
import { Doughnut } from "react-chartjs-2";

class CanvasPieChart extends Component {
  render() {
	 
    const data = {
		weight: 5,	
		defaultFontFamily: 'Poppins',
		datasets: [{
			data: [50, 30, 20],
			borderWidth: 0, 
			borderColor: "rgba(255,255,255,1)",
			backgroundColor: ["#8df05f","#ff4b4b","#e3e3e3"],
			hoverBackgroundColor: ["#8df05f","#ff4b4b","#e3e3e3"]
		}],
    };

    const options = {
		weight: 1,	
		//cutoutPercentage: 70,
		cutout: '70%',
		responsive: true,
		maintainAspectRatio: false
      
    };

    return (
      <div >
        <Doughnut
          data={data}
         // width={this.props.width ? this.props.width : 433}
          height={this.props.height ? this.props.height : 150}
          options={options}
        />
      </div>
    );
  }
}

export default CanvasPieChart;
