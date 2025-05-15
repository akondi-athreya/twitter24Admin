import React, { Component } from "react";
import { Link, NavLink } from "react-router-dom";
import PerfectScrollbar from "react-perfect-scrollbar";
import userAvatar from "../assets/img/img1.jpg";
import {
    dashboardMenu,
    mediaRoutes,
    companyRoutes,
    ProfileMenu,
    normalMenu, baseMenu, premiumMenu
} from "../data/Menu";

export default class Sidebar extends Component {
    toggleFooterMenu = (e) => {
        e.preventDefault();

        let parent = e.target.closest(".sidebar");
        parent.classList.toggle("footer-menu-show");
    }
    
    // Move menu determination to a method
    getUserSidebarMenu = () => {
        const isEmployee = JSON.parse(localStorage.getItem("userIsEmployee"));
        if (isEmployee?.success) {
            return dashboardMenu;
        }
        const userdata = JSON.parse(localStorage.getItem("twitter24userPlan"));
        let main_user_plan = userdata ? userdata[0]?.plan : '';

        if (main_user_plan === 'none') {
            return normalMenu;
        }
        else if (main_user_plan === 'Base') {
            return baseMenu;
        }
        else if (main_user_plan === 'Premium' || main_user_plan === "Premium Pro") {
            return premiumMenu;
        }
        else {
            return dashboardMenu;
        }
    }

    getCompanyRoute = () => {
        const userdata = JSON.parse(localStorage.getItem("twitter24userPlan"));
        const isEmployee = JSON.parse(localStorage.getItem("userIsEmployee"));
        console.log(isEmployee);
        if (isEmployee.success) {
            return companyRoutes;
        }
        else {
            return [];
        }
    }

    render() {
        // Get menu data at render time
        const userSideBarMenu = this.getUserSidebarMenu();
        const compayRouteThere = this.getCompanyRoute();

        return (
            <div className="sidebar">
                <div className="sidebar-header">
                    <Link to="/admin" className="sidebar-logo">Twitter24</Link>
                </div>
                <PerfectScrollbar className="sidebar-body" ref={ref => this._scrollBarRef = ref}>

                    <SidebarMenu
                        menuData={userSideBarMenu}
                        mediaRoutes={mediaRoutes}
                        companyRoutes={compayRouteThere}
                        profileMenu={ProfileMenu}
                        onUpdateSize={() => this._scrollBarRef.updateScroll()}
                    />
                </PerfectScrollbar>
            </div>
        )
    }
}

class SidebarMenu extends Component {
    populateMenu = (m) => {
        const menu = m.map((m, key) => {
            let sm;
            if (m.submenu) {
                sm = m.submenu.map((sm, key) => {
                    return (
                        <NavLink to={sm.link} className="nav-sub-link" key={key}>{sm.label}</NavLink>
                    )
                })
            }

            return (
                <li key={key} className="nav-item">
                    {(!sm) ? (
                        <NavLink to={m.link} className="nav-link"><i className={m.icon}></i> <span>{m.label}</span></NavLink>
                    ) : (
                        <div onClick={this.toggleSubMenu} className="nav-link has-sub"><i className={m.icon}></i> <span>{m.label}</span></div>
                    )}
                    {m.submenu && <nav className="nav nav-sub">{sm}</nav>}
                </li>
            )
        });

        return (
            <ul className="nav nav-sidebar">
                {menu}
            </ul>
        );
    }

    // Toggle menu group
    toggleMenu = (e) => {
        e.preventDefault();

        let parent = e.target.closest('.nav-group');
        parent.classList.toggle('show');

        this.props.onUpdateSize();
    }

    // Toggle submenu while closing siblings' submenu
    toggleSubMenu = (e) => {
        e.preventDefault();

        let parent = e.target.closest('.nav-item');
        let node = parent.parentNode.firstChild;

        while (node) {
            if (node !== parent && node.nodeType === Node.ELEMENT_NODE)
                node.classList.remove('show');
            node = node.nextElementSibling || node.nextSibling;
        }

        parent.classList.toggle('show');

        this.props.onUpdateSize();
    }

    render() {
        const { menuData, mediaRoutes, companyRoutes, profileMenu } = this.props;

        return (
            <React.Fragment>
                <div className="nav-group show">
                    <div className="nav-label" onClick={this.toggleMenu}>Dashboard</div>
                    {this.populateMenu(menuData)}
                </div>
                <div className="nav-group show">
                    <div className="nav-label" onClick={this.toggleMenu}>Public</div>
                    {this.populateMenu(mediaRoutes)}
                </div>
                {companyRoutes.length > 0 && <div className="nav-group show">
                    <div className="nav-label" onClick={this.toggleMenu}>Company Routes</div>
                    {this.populateMenu(companyRoutes)}
                </div>}
                <div className="nav-group show">
                    <div className="nav-label" onClick={this.toggleMenu}>Profile</div>
                    {this.populateMenu(profileMenu)}
                    <div>
                        {/* button for logout */}
                        <button className="btn btn-primary btn-block" style={{width: "90%", margin: "10px 10px", 
                        textAlign: "center", gap: "10px", display: "flex", justifyContent: 'center'}}
                        onClick={() => {
                            localStorage.clear();
                            window.location.href = "/admin/";
                        }}><i className="ri-logout-box-r-line"></i>Logout</button>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

window.addEventListener("click", function (e) {
    // Close sidebar footer menu when clicked outside of it
    let tar = e.target;
    let sidebar = document.querySelector(".sidebar");
    if (!tar.closest(".sidebar-footer") && sidebar) {
        sidebar.classList.remove("footer-menu-show");
    }

    // Hide sidebar offset when clicked outside of sidebar
    if (!tar.closest(".sidebar") && !tar.closest(".menu-link")) {
        document.querySelector("body").classList.remove("sidebar-show");
    }
});

window.addEventListener("load", function () {
    let skinMode = localStorage.getItem("sidebar-skin");
    let HTMLTag = document.querySelector("html");

    if (skinMode) {
        HTMLTag.setAttribute("data-sidebar", skinMode);
    }
});