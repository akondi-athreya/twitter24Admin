import React from "react";

// Dashboard
import EventManagement from "../dashboard/EventManagement";
import SalesMonitoring from "../dashboard/SalesMonitoring";
import WebsiteAnalytics from "../dashboard/WebsiteAnalytics";
import FinanceMonitoring from "../dashboard/FinanceMonitoring";
import Cryptocurrency from "../dashboard/Cryptocurrency";
import HelpdeskService from "../dashboard/HelpdeskService";
import StorageManagement from "../dashboard/StorageManagement";
import ProductManagement from "../dashboard/ProductManagement";

// Apps
import GalleryMusic from "../apps/GalleryMusic";
import GalleryVideo from "../apps/GalleryVideo";
import Tasks from "../apps/Tasks";
import Contacts from "../apps/Contacts";
import Chat from "../apps/Chat";
import AppCalendar from "../apps/AppCalendar";
import Email from "../apps/Email";
import FileManager from "../apps/FileManager";

// Pages
import Pricing from "../pages/Pricing";
import Faq from "../pages/Faq";
// import Profile from "../pages/Profile";
import People from "../pages/People";
import Activity from "../pages/Activity";
import Events from "../pages/Events";
import Settings from "../pages/Settings";

// UI Elements
import LayoutColumns from "../docs/LayoutColumns";
import LayoutGrid from "../docs/LayoutGrid";
import LayoutGutters from "../docs/LayoutGutters";
import Accordions from "../docs/Accordions";
import Alerts from "../docs/Alerts";
import Avatars from "../docs/Avatars";
import Badges from "../docs/Badges";
import Breadcrumbs from "../docs/Breadcrumbs";
import Buttons from "../docs/Buttons";
import Cards from "../docs/Cards";
import Carousels from "../docs/Carousels";
import Dropdowns from "../docs/Dropdowns";
import Images from "../docs/Images";
import Listgroup from "../docs/Listgroup";
import Markers from "../docs/Markers";
import Modals from "../docs/Modals";
import NavTabs from "../docs/NavTabs";
import OffCanvas from "../docs/OffCanvas";
import Paginations from "../docs/Paginations";
import Placeholders from "../docs/Placeholders";
import Popovers from "../docs/Popovers";
import Progress from "../docs/Progress";
import Spinners from "../docs/Spinners";
import Toasts from "../docs/Toasts";
import Tooltips from "../docs/Tooltips";
import Tables from "../docs/Tables";
import FormElements from "../docs/FormElements";
import FormSelects from "../docs/FormSelects";
import FormChecksRadios from "../docs/FormChecksRadios";
import FormRange from "../docs/FormRange";
import FormPickers from "../docs/FormPickers";
import FormLayouts from "../docs/FormLayouts";
import UtilBackground from "../docs/UtilBackground";
import UtilBorder from "../docs/UtilBorder";
import UtilColors from "../docs/UtilColors";
import UtilDivider from "../docs/UtilDivider";
import UtilFlex from "../docs/UtilFlex";
import UtilSizing from "../docs/UtilSizing";
import UtilSpacing from "../docs/UtilSpacing";
import UtilOpacity from "../docs/UtilOpacity";
import UtilPosition from "../docs/UtilPosition";
import UtilTypography from "../docs/UtilTypography";
import UtilShadows from "../docs/UtilShadows";
import UtilExtras from "../docs/UtilExtras";
import ApexCharts from "../docs/ApexCharts";
import ChartJs from "../docs/ChartJs";
import MapLeaflet from "../docs/MapLeaflet";
import MapVector from "../docs/MapVector";
import IconRemix from "../docs/IconRemix";
import IconFeather from "../docs/IconFeather";


// Owner Routes
import StoreRegister from "../docs/storeRegister";
import MyStores from "../docs/myStores";
import Reviews from "../docs/Reviews";
import Promotions from "../docs/Promotions";
import ViewPromotions from "../docs/ViewPromotions";
import AddProduct from "../docs/AddProduct";
import MyProducts from "../docs/myProducts";
import ActiveHotDeals from "../docs/HotDeals";
import MakeHotDeal from "../docs/MakeHotDeal";
import NewHome from "../docs/NewHome";
import Upgrade from "../docs/Upgrade";
import Manage from "../docs/Manage";
import Temples from "../docs/Temples";
import ViewTemples from "../docs/ViewTemples";
import TermsCondiotions from "../docs/TermsCondiotions";


// Company Routes
import BroadCast from "../docs/BroadCast";
import ApproveStore from "../docs/ApproveStore";
import PromotionPlus from "../docs/PromotionPlus";
import MakeEmployee from "../docs/MakeEmployee";


// profile
import Profile from "../pages/NewProfile";
import PreOrders from "../docs/PreOrders";
import ViewEmployee from "../docs/ViewEmployee";
import Followers from "../docs/Followers";

const protectedRoutes = [

  { path: "admin/profile", element: <Profile /> },


  {path: "admin/Home", element: <NewHome />},
  {path: "admin/storeRegister", element: <StoreRegister />},
  {path: "admin/MyStores", element: <MyStores />},
  {path: "admin/Reviews", element: <Reviews />},
  {path: "admin/Promotions", element: <Promotions />},
  {path: "admin/ViewPromotions", element: <ViewPromotions />},


  {path: "admin/AddProduct", element: <AddProduct />},
  {path: "admin/MyProducts", element: <MyProducts />},
  {path: "admin/ActiveHotDeals", element: <ActiveHotDeals />},//
  {path: "admin/MakeHotDeal", element: <MakeHotDeal />},//
  {path: "admin/Upgrade", element: <Upgrade />},
  {path: "admin/StoreAnalysis", element: <Manage />},//
  {path: "admin/Temples", element: <Temples />},
  {path: "admin/ViewTemples", element: <ViewTemples />},
  {path: "admin/TermsCondiotions", element: <TermsCondiotions />},
  {path: "admin/PreOrders", element: <PreOrders />},//
  {path: "admin/MakeEmployee", element: <MakeEmployee />}, // remove this
  {path: "admin/ViewEmployees", element: <ViewEmployee />}, // remove this
  {path: "admin/Followers", element: <Followers />},
  

  {path: "admin/BroadCast", element: <BroadCast />},
  {path: "admin/ApproveStore", element: <ApproveStore />},
  {path: "admin/PromotionPlus", element: <PromotionPlus />},
  {path: "admin/MakeEmployee", element: <MakeEmployee />},
  {path: "admin/ViewEmployees", element: <ViewEmployee />}
]



export const normalProtectedRoutes = [
  {path: "admin/Home", element: <NewHome />},
  {path: "admin/storeRegister", element: <StoreRegister />},
  {path: "admin/MyStores", element: <MyStores />},
  {path: "admin/Reviews", element: <Reviews />},
  {path: "admin/Promotions", element: <Promotions />},
  {path: "admin/ViewPromotions", element: <ViewPromotions />},
  {path: "admin/Profile", element: <Profile />},

  {path: "admin/AddProduct", element: <AddProduct />},
  {path: "admin/MyProducts", element: <MyProducts />},
  {path: "admin/Upgrade", element: <Upgrade />},
  {path: "admin/Temples", element: <Temples />},
  {path: "admin/ViewTemples", element: <ViewTemples />},
  {path: "admin/TermsCondiotions", element: <TermsCondiotions />},
]

export const baseProtectedRoutes = [
  ...normalProtectedRoutes,
  {path: "admin/ActiveHotDeals", element: <ActiveHotDeals />},
  {path: "admin/MakeHotDeal", element: <MakeHotDeal />},
]

export const premiumProtectedRoutes = [
  ...baseProtectedRoutes,
  {path: "admin/StoreAnalysis", element: <Manage />},
  {path: "admin/PreOrders", element: <PreOrders />},
  {path: "admin/Followers", element: <Followers />},
]




export default protectedRoutes;