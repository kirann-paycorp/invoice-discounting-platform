import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import wave1 from './../../../../assets/images/pattern/wave1.png';
import wave2 from './../../../../assets/images/pattern/wave2.png';
import wave3 from './../../../../assets/images/pattern/wave3.png';
import wave4 from './../../../../assets/images/pattern/wave4.png';
import circle from './../../../../assets/images/pattern/circle.png';


const CardSlider = () => {
	const settings = {
		dots: false,
		infinite: true,
		arrows: false,
		speed: 3000,
		slidesToShow: 4,
		slidesToScroll: 1,
		responsive: [
			{
				breakpoint: 1560,
				settings: {
					slidesToShow: 3,
					slidesToScroll: 1,
				},
			},
			{
				breakpoint: 1200,
				settings: {
					slidesToShow: 2,
					slidesToScroll: 1,
				},
			},
			{
				breakpoint: 640,
				settings: {
					slidesToShow: 1,
					slidesToScroll: 1,
				},
			},
		],
	};
	return (
		<>
			<Slider className="card-slider owl-carousel" {...settings}>
				<div className="items">
					<div className="card-bx bg-green mb-0">
						<img className="pattern-img" src={wave1} alt="" />
						<div className="card-info text-white">
							<div className="d-flex align-items-center">
								<div className="me-auto">
									<p className="mb-1 fs-18 font-w700">Main Balance</p>
									<h2 className="fs-32 font-w800  text-white mb-5">$673,412.66</h2>
								</div>
								<img src={circle} className="mb-4" alt="" />
							</div>
							<div className="d-flex">
								<div className="me-sm-5 me-3">
									<p className="fs-14 mb-1">VALID THRU</p>
									<span>08/21</span>
								</div>
								<div>
									<p className="fs-14 mb-1">CARD HOLDER</p>
									<span>Franklin Jr.</span>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="items ">
					<div className="card-bx bg-orange">
						<img className="pattern-img" src={wave2} alt="" />
						<div className="card-info text-white">
							<div className="d-flex align-items-center">
								<div className="me-auto">
									<p className="mb-1 fs-18 font-w700">Main Balance</p>
									<h2 className="fs-32 font-w800  text-white mb-5">$673,412.66</h2>
								</div>
								<img src={circle} className="mb-4" alt="" />
							</div>
							<div className="d-flex">
								<div className="me-sm-5 me-3">
									<p className="fs-14 mb-1">VALID THRU</p>
									<span>08/21</span>
								</div>
								<div>
									<p className="fs-14 mb-1">CARD HOLDER</p>
									<span>Franklin Jr.</span>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="items">
					<div className="card-bx bg-blue mb-0">
						<img className="pattern-img" src={wave3} alt="" />
						<div className="card-info text-white">
							<div className="d-flex align-items-center">
								<div className="me-auto">
									<p className="mb-1 fs-18 font-w700">Main Balance</p>
									<h2 className="fs-32 font-w800  text-white mb-5">$673,412.66</h2>
								</div>
								<img src={circle} className="mb-4" alt="" />
							</div>
							<div className="d-flex">
								<div className="me-5">
									<p className="fs-14 mb-1">VALID THRU</p>
									<span>08/21</span>
								</div>
								<div>
									<p className="fs-14 mb-1">CARD HOLDER</p>
									<span>Franklin Jr.</span>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="items">
					<div className="card-bx bg-purpel mb-0">
						<img className="pattern-img" src={wave4} alt="" />
						<div className="card-info text-white">
							<div className="d-flex align-items-center">
								<div className="me-auto">
									<p className="mb-1 fs-18 font-w700">Main Balance</p>
									<h2 className="fs-32 font-w800  text-white mb-5">$673,412.66</h2>
								</div>
								<img src={circle} className="mb-4" alt="" />
							</div>
							<div className="d-flex">
								<div className="me-5">
									<p className="fs-14 mb-1">VALID THRU</p>
									<span>08/21</span>
								</div>
								<div>
									<p className="fs-14 mb-1">CARD HOLDER</p>
									<span>Franklin Jr.</span>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="items">
					<div className="card-bx bg-orange">
						<img className="pattern-img" src={wave2} alt="" />
						<div className="card-info text-white">
							<div className="d-flex align-items-center">
								<div className="me-auto">
									<p className="mb-1 fs-18 font-w700">Main Balance</p>
									<h2 className="fs-32 font-w800  text-white mb-5">$673,412.66</h2>
								</div>
								<img src={circle} className="mb-4" alt="" />
							</div>
							<div className="d-flex">
								<div className="me-sm-5 me-3">
									<p className="fs-14 mb-1">VALID THRU</p>
									<span>08/21</span>
								</div>
								<div>
									<p className="fs-14 mb-1">CARD HOLDER</p>
									<span>Franklin Jr.</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</Slider>
		</>
	)
}
export default CardSlider;