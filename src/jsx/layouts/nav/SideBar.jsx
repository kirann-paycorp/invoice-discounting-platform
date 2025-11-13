import React, { useReducer, useContext, useState, useEffect, Fragment } from "react";
/// Scroll
import PerfectScrollbar from "react-perfect-scrollbar";
import { Collapse, Dropdown } from 'react-bootstrap';
/// Link
import { Link } from "react-router-dom";
import { MenuList } from './Menu';
import { getRoleBasedMenu, getCurrentUserRole, getCurrentUserProfile } from './RoleBasedMenu';
import { useScrollPosition } from "@n8tb1t/use-scroll-position";
import { ThemeContext } from "../../../context/ThemeContext";
import LogoutPage from './Logout';

/// Image
import profile from "../../../assets/images/user.jpg";

const reducer = (previousState, updatedState) => ({
  ...previousState,
  ...updatedState,
});

const initialState = {
  active: "",
  activeSubmenu: "",
}

const SideBar = () => {
  let year = new Date().getFullYear();
  const {
    iconHover,
    sidebarposition,
    headerposition,
    sidebarLayout,
    ChangeIconSidebar,
  } = useContext(ThemeContext);

  const [menuState, setMenuState] = useReducer(reducer, initialState);
  const [userRole, setUserRole] = useState('seller');
  const [userProfile, setUserProfile] = useState(null);
  const [currentMenu, setCurrentMenu] = useState(MenuList);

  // Get user role and profile on component mount and when localStorage changes
  useEffect(() => {
    const role = getCurrentUserRole();
    const profile = getCurrentUserProfile();
    setUserRole(role);
    setUserProfile(profile);
    setCurrentMenu(getRoleBasedMenu(role));
  }, []);

  // Listen for localStorage changes to update menu when user logs in/out
  useEffect(() => {
    const handleStorageChange = () => {
      const role = getCurrentUserRole();
      const profile = getCurrentUserProfile();
      setUserRole(role);
      setUserProfile(profile);
      setCurrentMenu(getRoleBasedMenu(role));
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  let handleheartBlast = document.querySelector('.heart');
  function heartBlast() {
    return handleheartBlast.classList.toggle("heart-blast");
  }

  const [hideOnScroll, setHideOnScroll] = useState(true)
  useScrollPosition(
    ({ prevPos, currPos }) => {
      const isShow = currPos.y > prevPos.y
      if (isShow !== hideOnScroll) setHideOnScroll(isShow)
    },
    [hideOnScroll]
  )


  const handleMenuActive = status => {
    setMenuState({ active: status });
    if (menuState.active === status) {
      setMenuState({ active: "" });
    }
  }
  const handleSubmenuActive = (status) => {
    setMenuState({ activeSubmenu: status })
    if (menuState.activeSubmenu === status) {
      setMenuState({ activeSubmenu: "" })
    }
  }

  /// Path
  let path = window.location.pathname;
  path = path.split("/");
  path = path[path.length - 1];

  useEffect(() => {
    currentMenu.forEach((data) => {
      data.content?.forEach((item) => {
        if (path === item.to) {
          setMenuState({ active: data.title })
        }
        item.content?.forEach(ele => {
          if (path === ele.to) {
            setMenuState({ activeSubmenu: item.title, active: data.title })
          }
        })
      })
    })
  }, [path, currentMenu]);
  return (
    <div
      onMouseEnter={() => ChangeIconSidebar(true)}
      onMouseLeave={() => ChangeIconSidebar(false)}
      className={`dlabnav ${iconHover} ${sidebarposition.value === "fixed" &&
        sidebarLayout.value === "horizontal" &&
        headerposition.value === "static"
        ? hideOnScroll > 120
          ? "fixed"
          : ""
        : ""
        }`}
    >
      <PerfectScrollbar className="dlabnav-scroll">
        <Dropdown className="header-profile2">
          <Dropdown.Toggle variant="" as="a" className="nav-link i-false c-pointer">
            <div className="header-info2 d-flex align-items-center border">
              <img src={profile} width={20} alt="" />
              <div className="d-flex align-items-center sidebar-info">
                <div>
                  <span className="font-w700 d-block mb-2">{userProfile?.name || 'User'}</span>
                  <small className="text-end font-w400">
                    {userRole?.charAt(0).toUpperCase() + userRole?.slice(1)} - {userProfile?.company || 'Company'}
                  </small>
                </div>
                <i className="fas fa-sort-down ms-4"></i>
              </div>
            </div>
          </Dropdown.Toggle>
          <Dropdown.Menu align="start" className="dropdown-menu-end">
            <Link to="/app-profile" className="dropdown-item ai-icon">
              <svg id="icon-user1" xmlns="http://www.w3.org/2000/svg" className="text-primary me-1"
                width={18} height={18} viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx={12} cy={7} r={4} />
              </svg>
              <span className="ms-2">Profile </span>
            </Link>
            <Link to="/email-inbox" className="dropdown-item ai-icon">
              <svg id="icon-inbox" xmlns="http://www.w3.org/2000/svg" className="text-success me-1" width={18}
                height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
                strokeLinecap="round" strokeLinejoin="round"
              >
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              <span className="ms-2">Inbox</span>
            </Link>
            <LogoutPage />
          </Dropdown.Menu>
        </Dropdown>
        <ul className="metismenu" id="menu">
          {currentMenu.map((data, index) => {
            let menuClass = data.classsChange;
            if (menuClass === "menu-title") {
              return (
                <li className={menuClass} key={index} >{data.title}</li>
              )
            } else {
              return (
                <li className={` ${menuState.active === data.title ? 'mm-active' : ''} ${data.to === path ? 'mm-active' : ''}`}
                  key={index}
                >

                  {data.content && data.content.length > 0 ?
                    <>
                      <Link to={"#"}
                        className="has-arrow"
                        onClick={() => { handleMenuActive(data.title) }}
                      >
                        {data.iconStyle}
                        <span className="nav-text">{data.title}</span>
                        <span className="badge badge-xs style-1 badge-danger">{data.update}</span>
                      </Link>
                      <Collapse in={menuState.active === data.title ? true : false}>
                        <ul className={`${menuClass === "mm-collapse" ? "mm-show" : ""}`}>
                          {data.content && data.content.map((data, index) => {
                            return (
                              <li key={index}
                                className={`${menuState.activeSubmenu === data.title ? "mm-active" : ""}`}
                              >
                                {data.content && data.content.length > 0 ?
                                  <>
                                    <Link to={data.to} className={`${data.hasMenu ? 'has-arrow' : ''} ${data.to === path ? 'mm-active' : ''} `}
                                      onClick={() => { handleSubmenuActive(data.title) }}
                                    >
                                      {data.title}
                                    </Link>
                                    <Collapse in={menuState.activeSubmenu === data.title ? true : false}>
                                      <ul className={`${menuClass === "mm-collapse" ? "mm-show" : ""}`}>
                                        {data.content && data.content.map((data, index) => {
                                          return (
                                            <Fragment key={index}>
                                              <li >
                                                <Link className={`${path === data.to ? "mm-active" : ""}`} to={data.to}>{data.title}</Link>
                                              </li>
                                            </Fragment>
                                          )
                                        })}
                                      </ul>
                                    </Collapse>
                                  </>
                                  :
                                  <Link to={data.to} className={`${data.to === path ? 'mm-active' : ''}`}>
                                    {data.title}
                                  </Link>
                                }

                              </li>

                            )
                          })}
                        </ul>
                      </Collapse>
                    </>
                    :
                    <Link to={data.to} className={`${data.to === path ? 'mm-active' : ''}`}>
                      {data.iconStyle}
                      <span className="nav-text">{data.title}</span>
                    </Link>
                  }

                </li>
              )
            }
          })}
        </ul>
        <div className="copyright">
          <p><strong>Invome Admin Dashboard</strong> © {year} All Rights Reserved</p>
          <p className="fs-12">Made with
            <span className="heart" onClick={heartBlast}></span>
            by DexignLabs
          </p>
        </div>
      </PerfectScrollbar>
    </div>
  );
};

export default SideBar;
