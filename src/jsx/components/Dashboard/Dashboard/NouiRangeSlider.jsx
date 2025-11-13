import React, { Fragment } from "react";
import Nouislider from "nouislider-react";
import "nouislider/distribute/nouislider.css";


class NouiRangeSlider extends React.Component {
   state = {
      color: "rgb(127, 127, 127)",
      textValue: null,
      percent: null,
      value: 0,
      disabled: false,
      range: {
         min: 0,
         max: 100,
      },
      ref: null,
   };
   onSkipSlide = (render, handle, value, un, percent) => {
      this.setState({
         skippingValue: value[0],
      });
   };

   render() {
      return (
         <Fragment >
				<div className="amount-input">
					{this.state.skippingValue ? (
					   <div className="text-black"> {Math.floor(this.state.skippingValue)}.000</div>
					) : (
					   <div className="text-black"> 20.000</div>
					)}
				</div>
			
            <Nouislider
               start={20.000}
               snap
               range={{
                  min: [20],
                  "1%": 21,
                  "2%": 22,
                  "3%": 23,
                  "5%": 24,
                  "6%": 25,
                  "7%": 26,
                  "9%": 27,
                  "10%": 28,
                  "11%": 29,
                  "12%": 30,
                  "13%": 31,
                  "14%": 32,
                  "15%": 33,
                  "16%": 34,
                  "17%": 35,
                  "18%": 36,
                  max: [80],
               }}
               onSlide={this.onSkipSlide}
            />
            
         </Fragment>
      );
   }
}

export default NouiRangeSlider;
