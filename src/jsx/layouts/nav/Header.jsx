import React, { useState } from "react";

import { Link } from "react-router-dom";
/// Scroll
import PerfectScrollbar from "react-perfect-scrollbar";
import { Dropdown } from "react-bootstrap";

/// Image
import avatar from "../../../assets/images/avatar/1.jpg";


const Header = ({ onNote }) => {
  const [searchBut, setSearchBut] = useState(false);
  var path = window.location.pathname.split("/");
  var name = path[path.length - 1].split("-");
  var filterName = name.length >= 3 ? name.filter((n, i) => i > 0) : name;
  var finalName = filterName.includes("app")
    ? filterName.filter((f) => f !== "app")
    : filterName.includes("ui")
      ? filterName.filter((f) => f !== "ui")
      : filterName.includes("uc")
        ? filterName.filter((f) => f !== "uc")
        : filterName.includes("basic")
          ? filterName.filter((f) => f !== "basic")
          : filterName.includes("jquery")
            ? filterName.filter((f) => f !== "jquery")
            : filterName.includes("table")
              ? filterName.filter((f) => f !== "table")
              : filterName.includes("page")
                ? filterName.filter((f) => f !== "page")
                : filterName.includes("email")
                  ? filterName.filter((f) => f !== "email")
                  : filterName.includes("ecom")
                    ? filterName.filter((f) => f !== "ecom")
                    : filterName.includes("chart")
                      ? filterName.filter((f) => f !== "chart")
                      : filterName.includes("editor")
                        ? filterName.filter((f) => f !== "editor")
                        : filterName;
  return (
    <div className="header border-bottom">
      <div className="header-content">
        <nav className="navbar navbar-expand">
          <div className="collapse navbar-collapse justify-content-between">
            <div className="header-left">
              <div
                className="dashboard_bar"
                style={{ textTransform: "capitalize" }}
              >
                {finalName.join(" ").length === 0
                  ? "Dashboard"
                  : finalName.join(" ") === "dashboard dark"
                    ? "Dashboard"
                    : finalName.join(" ")}
              </div>
            </div>
            <ul className="navbar-nav header-right">
              <li className="nav-item d-flex align-items-center">
                <div className="input-group search-area">
                  <input type="text"
                    className={`form-control ${searchBut ? "active" : ""}`}
                    placeholder="Search here..."
                  />
                  <span className="input-group-text" onClick={() => setSearchBut(!searchBut)}>
                    <Link to={"#"}><i className="flaticon-381-search-2"></i></Link>
                  </span>
                </div>
              </li>

              <Dropdown
                as="li"
                className="nav-item dropdown notification_dropdown "
              >
                <Dropdown.Toggle className="nav-link i-false c-pointer" variant="" as="a"
                  
                >
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clipPath="">
                      <path d="M28.0948 25.0879H26.6026V11.3407C26.6026 10.7074 26.5333 10.0741 26.3965 9.45825C26.2318 8.717 25.4985 8.24975 24.7572 8.41431C24.0164 8.57912 23.5494 9.31363 23.7141 10.0549C23.8058 10.4676 23.8547 10.9115 23.8547 11.3407V25.0879L8.08365 25.088V11.4309C8.08365 8.38875 10.6582 5.62356 13.8228 5.26694C13.8273 5.26644 13.8317 5.26562 13.8362 5.26506C14.5092 5.18325 15.0368 4.59319 15.0427 3.914C15.0427 3.9095 15.043 3.90506 15.043 3.90056C15.043 3.26619 15.5576 2.75 16.1902 2.75C16.8228 2.75 17.3375 3.26612 17.3375 3.90069C17.3375 4.55975 17.8577 5.16475 18.5103 5.26069C19.2389 5.36862 19.94 5.60462 20.594 5.96219C20.8032 6.07656 21.0289 6.13081 21.2515 6.13081C21.7377 6.13081 22.2089 5.87188 22.4585 5.41475C22.8223 4.74831 22.5773 3.91294 21.9115 3.54888C21.2738 3.20025 20.6042 2.93225 19.9114 2.74719C19.4192 1.15775 17.9372 0 16.1902 0C14.4558 0 12.9832 1.14125 12.4803 2.71294C10.7098 3.1255 9.07122 4.06819 7.78547 5.42975C6.20572 7.10281 5.33572 9.23406 5.33572 11.4309V25.0881H3.90528C3.14647 25.0881 2.53134 25.7037 2.53134 26.4631C2.53134 27.2224 3.14647 27.8381 3.90528 27.8381H11.5226C11.6948 30.1617 13.6364 32 16 32C18.3637 32 20.3053 30.1616 20.4775 27.838H28.0948C28.8537 27.838 29.4688 27.2224 29.4688 26.463C29.4688 25.7036 28.8537 25.0879 28.0948 25.0879ZM16 29.25C15.1533 29.25 14.4458 28.6416 14.2892 27.838H17.7108C17.5542 28.6416 16.8468 29.25 16 29.25Z" fill="#717579" />
                      <path d="M23.8691 8.18592C24.6279 8.18592 25.2431 7.57031 25.2431 6.81092C25.2431 6.05152 24.6279 5.43591 23.8691 5.43591C23.1103 5.43591 22.4952 6.05152 22.4952 6.81092C22.4952 7.57031 23.1103 8.18592 23.8691 8.18592Z" fill="#717579" />
                    </g>
                    <defs>
                      <clipPath>
                        <rect width="32" height="32" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                  <span className="badge light text-white bg-warning rounded-circle">12</span>
                </Dropdown.Toggle>
                <Dropdown.Menu align="end" className="mt-2 dropdown-menu dropdown-menu-end">
                  <PerfectScrollbar className="widget-media dlab-scroll p-3 height380">
                    <ul className="timeline">
                      <li>
                        <div className="timeline-panel">
                          <div className="media me-2">
                            <img alt="images" width={50} src={avatar} />
                          </div>
                          <div className="media-body">
                            <h6 className="mb-1">Dr sultads Send you Photo</h6>
                            <small className="d-block">
                              29 July 2020 - 02:26 PM
                            </small>
                          </div>
                        </div>
                      </li>
                      <li>
                        <div className="timeline-panel">
                          <div className="media me-2 media-info">KG</div>
                          <div className="media-body">
                            <h6 className="mb-1">
                              Resport created successfully
                            </h6>
                            <small className="d-block">
                              29 July 2020 - 02:26 PM
                            </small>
                          </div>
                        </div>
                      </li>
                      <li>
                        <div className="timeline-panel">
                          <div className="media me-2 media-success">
                            <i className="fa fa-home" />
                          </div>
                          <div className="media-body">
                            <h6 className="mb-1">Reminder : Treatment Time!</h6>
                            <small className="d-block">
                              29 July 2020 - 02:26 PM
                            </small>
                          </div>
                        </div>
                      </li>
                      <li>
                        <div className="timeline-panel">
                          <div className="media me-2">
                            <img alt="" width={50} src={avatar} />
                          </div>
                          <div className="media-body">
                            <h6 className="mb-1">Dr sultads Send you Photo</h6>
                            <small className="d-block">
                              29 July 2020 - 02:26 PM
                            </small>
                          </div>
                        </div>
                      </li>
                      <li>
                        <div className="timeline-panel">
                          <div className="media me-2 media-danger">KG</div>
                          <div className="media-body">
                            <h6 className="mb-1">
                              Resport created successfully
                            </h6>
                            <small className="d-block">
                              29 July 2020 - 02:26 PM
                            </small>
                          </div>
                        </div>
                      </li>
                      <li>
                        <div className="timeline-panel">
                          <div className="media me-2 media-primary">
                            <i className="fa fa-home" />
                          </div>
                          <div className="media-body">
                            <h6 className="mb-1">Reminder : Treatment Time!</h6>
                            <small className="d-block">
                              29 July 2020 - 02:26 PM
                            </small>
                          </div>
                        </div>
                      </li>
                    </ul>
                    <div className="ps__rail-x" style={{ left: 0, bottom: 0 }}>
                      <div
                        className="ps__thumb-x"
                        tabIndex={0}
                        style={{ left: 0, width: 0 }}
                      />
                    </div>
                    <div className="ps__rail-y" style={{ top: 0, right: 0 }}>
                      <div
                        className="ps__thumb-y"
                        tabIndex={0}
                        style={{ top: 0, height: 0 }}
                      />
                    </div>
                  </PerfectScrollbar>
                  <Link className="all-notification" to="#">
                    See all notifications <i className="ti-arrow-right" />
                  </Link>
                </Dropdown.Menu>
              </Dropdown>

              <Dropdown
                as="li"
                className="nav-item dropdown notification_dropdown "
              >
                <Dropdown.Toggle
                  variant=""
                  as="a"
                  className="nav-link bell bell-link i-false c-pointer"
                  onClick={() => onNote()}
                >
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clipPath="">
                      <path d="M20.4632 3.4715H11.5369C5.17544 3.4715 0 8.63718 0 14.9867V20.4849C0 26.8344 5.17544 32.0001 11.5369 32.0001H20.5686C21.328 32.0001 21.9436 31.3844 21.9436 30.6251C21.9436 29.8657 21.328 29.2501 20.5686 29.2501H11.5369C6.69181 29.2501 2.75 25.318 2.75 20.4849V14.9867C2.75 13.2669 3.2495 11.6614 4.11081 10.3064L12.4198 17.0756L12.4315 17.085C13.4248 17.8762 14.7284 18.3115 16.1044 18.3115H16.1214C17.4992 18.3079 18.8024 17.8682 19.7926 17.0732L28.0844 10.6274C28.8258 11.9121 29.2501 13.4007 29.2501 14.9865V20.958C29.2501 22.1491 29.0027 23.2979 28.515 24.3729C28.0432 25.4126 27.3724 26.3305 26.5209 27.1011C25.9579 27.6106 25.9146 28.4801 26.4241 29.0432C26.9337 29.6063 27.8032 29.6496 28.3662 29.14C29.4984 28.1153 30.391 26.8937 31.0193 25.5091C31.6701 24.0749 32 22.5437 32 20.9581V14.9866C32 8.63712 26.8246 3.4715 20.4632 3.4715ZM18.0956 14.9092L18.0758 14.9249C17.0344 15.7656 15.2018 15.7711 14.1501 14.9381L5.93113 8.24218C7.4535 6.98087 9.40794 6.2215 11.5369 6.2215H20.4632C22.7278 6.2215 24.7949 7.08062 26.3545 8.48912L18.0956 14.9092Z" fill="#717579" />
                      <path d="M24.5181 31.8096C25.2775 31.8096 25.8931 31.194 25.8931 30.4346C25.8931 29.6752 25.2775 29.0596 24.5181 29.0596C23.7587 29.0596 23.1431 29.6752 23.1431 30.4346C23.1431 31.194 23.7587 31.8096 24.5181 31.8096Z" fill="#717579" />
                    </g>
                    <defs>
                      <clipPath>
                        <rect width="32" height="32" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                  <span className="badge light text-white bg-warning rounded-circle">76</span>
                </Dropdown.Toggle>
              </Dropdown>

              <Dropdown
                as="li"
                className="nav-item  notification_dropdown "
              >
                <Dropdown.Toggle
                  variant=""
                  as="a"
                  className="nav-link  ai-icon i-false c-pointer"
                  
                >
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M32 12.7087C32 12.6285 31.9928 12.5501 31.9796 12.4736C31.6646 7.57756 27.6102 3.67738 22.6341 3.57681V1.375C22.6341 0.615625 22.0184 0 21.2591 0C20.4997 0 19.8841 0.615625 19.8841 1.375V3.57431H11.6726V1.375C11.6726 0.615625 11.0569 0 10.2976 0C9.53819 0 8.92256 0.615625 8.92256 1.375V3.59612C3.94706 3.92506 0 8.05588 0 13.0872V21.4244C0 27.2558 4.76956 32 10.6322 32H20.9373C21.6967 32 22.3123 31.3844 22.3123 30.625C22.3123 29.8656 21.6967 29.25 20.9373 29.25H10.6322C6.28594 29.25 2.75 25.7394 2.75 21.4244V14.0837H29.25V20.9966C29.25 22.1813 29.003 23.3243 28.5158 24.3937C28.0444 25.4284 27.3739 26.342 26.5229 27.1092C25.9589 27.6177 25.9138 28.4871 26.4223 29.0511C26.9309 29.6151 27.8002 29.6601 28.3642 29.1518C29.4969 28.1306 30.3898 26.9134 31.0184 25.5336C31.6698 24.1039 32 22.5774 32 20.9966V13.0872C32 12.9952 31.9984 12.9036 31.9958 12.8122C31.9983 12.778 32 12.7436 32 12.7087ZM8.92988 6.35375C9.001 7.04638 9.58619 7.58663 10.2976 7.58663C11.019 7.58663 11.6102 7.03094 11.6676 6.32431H19.889C19.9464 7.03094 20.5376 7.58663 21.259 7.58663C21.9794 7.58663 22.5701 7.03244 22.6288 6.32713C25.6904 6.41156 28.2531 8.51081 29.0173 11.3337H2.98269C3.70981 8.64756 6.0655 6.61706 8.92988 6.35375Z" fill="#717579" />
                    <path d="M24.7114 31.81C25.4708 31.81 26.0864 31.1944 26.0864 30.435C26.0864 29.6756 25.4708 29.06 24.7114 29.06C23.952 29.06 23.3364 29.6756 23.3364 30.435C23.3364 31.1944 23.952 31.81 24.7114 31.81Z" fill="#717579" />
                  </svg>
                  <span className="badge light text-white bg-primary rounded-circle">!</span>
                </Dropdown.Toggle>
                <Dropdown.Menu align="end" className="mt-4 dropdown-menu dropdown-menu-end">
                  <PerfectScrollbar className="widget-timeline dlab-scroll style-1 ps p-3 height370">
                    <ul className="timeline">
                      <li>
                        <div className="timeline-badge primary" />
                        <Link
                          className="timeline-panel c-pointer text-muted"
                          to="#"
                        >
                          <span>10 minutes ago</span>
                          <h6 className="mb-0">
                            Youtube, a video-sharing website, goes live{" "}
                            <strong className="text-primary">$500</strong>.
                          </h6>
                        </Link>
                      </li>
                      <li>
                        <div className="timeline-badge info"></div>
                        <Link
                          className="timeline-panel c-pointer text-muted"
                          to="#"
                        >
                          <span>20 minutes ago</span>
                          <h6 className="mb-0">
                            New order placed{" "}
                            <strong className="text-info">#XF-2356.</strong>
                          </h6>
                          <p className="mb-0">
                            Quisque a consequat ante Sit amet magna at
                            volutapt...
                          </p>
                        </Link>
                      </li>
                      <li>
                        <div className="timeline-badge danger"></div>
                        <Link
                          className="timeline-panel c-pointer text-muted"
                          to="#"
                        >
                          <span>30 minutes ago</span>
                          <h6 className="mb-0">
                            john just buy your product{" "}
                            <strong className="text-warning">Sell $250</strong>
                          </h6>
                        </Link>
                      </li>
                      <li>
                        <div className="timeline-badge success"></div>
                        <Link
                          className="timeline-panel c-pointer text-muted"
                          to="#"
                        >
                          <span>15 minutes ago</span>
                          <h6 className="mb-0">
                            StumbleUpon is acquired by eBay.{" "}
                          </h6>
                        </Link>
                      </li>
                      <li>
                        <div className="timeline-badge warning"></div>
                        <Link
                          className="timeline-panel c-pointer text-muted"
                          to="#"
                        >
                          <span>20 minutes ago</span>
                          <h6 className="mb-0">
                            Mashable, a news website and blog, goes live.
                          </h6>
                        </Link>
                      </li>
                      <li>
                        <div className="timeline-badge dark"></div>
                        <Link
                          className="timeline-panel c-pointer text-muted"
                          to="#"
                        >
                          <span>20 minutes ago</span>
                          <h6 className="mb-0">
                            Mashable, a news website and blog, goes live.
                          </h6>
                        </Link>
                      </li>
                    </ul>
                    <div className="ps__rail-x" style={{ left: 0, bottom: 0 }}>
                      <div
                        className="ps__thumb-x"
                        tabIndex={0}
                        style={{ left: 0, width: 0 }}
                      />
                    </div>
                    <div className="ps__rail-y" style={{ top: 0, right: 0 }}>
                      <div
                        className="ps__thumb-y"
                        tabIndex={0}
                        style={{ top: 0, height: 0 }}
                      />
                    </div>
                  </PerfectScrollbar>
                </Dropdown.Menu>
              </Dropdown>             
              {/* <li className="nav-item invoices-btn">
                <Link to={"/create-invoices"} className="btn btn-primary ms-5"><i className="far fa-file-alt fs-20 me-2"></i>New Invoices</Link>
              </li> */}

            </ul>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Header;
