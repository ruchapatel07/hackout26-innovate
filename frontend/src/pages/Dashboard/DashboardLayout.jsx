import React, { useState } from 'react';
import { useAuth, roleNames } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { OverviewSection } from './OverviewSection';
import { ProfileSection } from './ProfileSection';
import { NotificationsSection } from './NotificationsSection';
import { GenericSection } from './GenericSection';
import { BrandLogo } from '../../components/BrandLogo.jsx';
import {
  LayoutDashboard,
  Search,
  Layers,
  Gavel,
  Package,
  Truck,
  MessageSquare,
  PlusCircle,
  DollarSign,
  FileText,
  Navigation,
  Users,
  Recycle,
  CreditCard,
  BarChart3,
  ShieldCheck,
  Bell,
  User,
  LogOut,
  Menu
} from 'lucide-react';

const iconMap = {
  overview: <LayoutDashboard className="w-4 h-4 flex-shrink-0" />,
  search: <Search className="w-4 h-4 flex-shrink-0" />,
  listings: <Layers className="w-4 h-4 flex-shrink-0" />,
  bids: <Gavel className="w-4 h-4 flex-shrink-0" />,
  orders: <Package className="w-4 h-4 flex-shrink-0" />,
  transport: <Truck className="w-4 h-4 flex-shrink-0" />,
  messages: <MessageSquare className="w-4 h-4 flex-shrink-0" />,
  "add-carbon": <PlusCircle className="w-4 h-4 flex-shrink-0" />,
  earnings: <DollarSign className="w-4 h-4 flex-shrink-0" />,
  requests: <FileText className="w-4 h-4 flex-shrink-0" />,
  trips: <Navigation className="w-4 h-4 flex-shrink-0" />,
  delivery: <Truck className="w-4 h-4 flex-shrink-0" />,
  tracking: <Navigation className="w-4 h-4 flex-shrink-0" />,
  vehicle: <Truck className="w-4 h-4 flex-shrink-0" />,
  users: <Users className="w-4 h-4 flex-shrink-0" />,
  carbon: <Recycle className="w-4 h-4 flex-shrink-0" />,
  adminbids: <Gavel className="w-4 h-4 flex-shrink-0" />,
  payments: <CreditCard className="w-4 h-4 flex-shrink-0" />,
  reports: <BarChart3 className="w-4 h-4 flex-shrink-0" />,
  security: <ShieldCheck className="w-4 h-4 flex-shrink-0" />
};

export const DashboardLayout = () => {
  const { currentUser, dashboardSection, setDashboardSection, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (!currentUser) return null;

  const letter = currentUser.name.charAt(0).toUpperCase();

  const menus = {
    buyer: [
      ['overview', 'Dashboard'],
      ['search', 'Find CO₂'],
      ['listings', 'Available Listings'],
      ['bids', 'My Bids'],
      ['orders', 'My Orders'],
      ['transport', 'Transportation'],
      ['messages', 'Messages']
    ],
    seller: [
      ['overview', 'Dashboard'],
      ['add-carbon', 'Add Carbon'],
      ['listings', 'My Listings'],
      ['bids', 'Buyer Bids'],
      ['orders', 'Orders'],
      ['transport', 'Transportation'],
      ['earnings', 'Earnings'],
      ['messages', 'Messages']
    ],
    transporter: [
      ['overview', 'Dashboard'],
      ['requests', 'Available Requests'],
      ['trips', 'My Trips'],
      ['delivery', 'Active Delivery'],
      ['tracking', 'Route Tracking'],
      ['earnings', 'Earnings'],
      ['vehicle', 'My Vehicle'],
      ['messages', 'Messages']
    ],
    admin: [
      ['overview', 'Dashboard'],
      ['users', 'Manage Users'],
      ['carbon', 'CO₂ Listings'],
      ['adminbids', 'Bidding Management'],
      ['orders', 'Orders'],
      ['transport', 'Transportation'],
      ['payments', 'Payments'],
      ['reports', 'Reports & Analytics'],
      ['security', 'Security']
    ]
  };

  const titles = {
    overview: "Dashboard", search: "Find CO₂", listings: "CO₂ Listings",
    bids: "Bids", orders: "Orders", transport: "Transportation",
    messages: "Messages", profile: "Profile", notifications: "Notifications",
    "add-carbon": "Add Carbon", earnings: "Earnings", requests: "Available Requests",
    trips: "My Trips", delivery: "Active Delivery", tracking: "Route Tracking",
    vehicle: "My Vehicle", users: "Manage Users", carbon: "CO₂ Listings",
    adminbids: "Bidding Management", payments: "Payments",
    reports: "Reports & Analytics", security: "Security"
  };

  const roleMenu = menus[currentUser.role] || menus.buyer;

  const handleSectionSelect = (sec) => {
    setDashboardSection(sec);
    setIsSidebarOpen(false);
  };

  const renderContent = () => {
    if (dashboardSection === 'overview') {
      return <OverviewSection />;
    } else if (dashboardSection === 'profile') {
      return <ProfileSection />;
    } else if (dashboardSection === 'notifications') {
      return <NotificationsSection />;
    } else {
      return <GenericSection section={dashboardSection} title={titles[dashboardSection]} />;
    }
  };

  return (
    <div className="dashboard-layout">
      <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-brand px-4 py-3">
          <BrandLogo onClick={() => navigatePage('home')} />
        </div>

        <div className="sidebar-user">
          <div className="user-avatar">{letter}</div>
          <div>
            <b>{currentUser.name}</b>
            <small>{roleNames[currentUser.role]}</small>
          </div>
        </div>

        <div className="menu-heading">MAIN MENU</div>
        <div id="sidebarMainMenu">
          {roleMenu.map((item) => (
            <button
              key={item[0]}
              className={`side-item ${dashboardSection === item[0] ? 'active' : ''}`}
              onClick={() => handleSectionSelect(item[0])}
            >
              <span>{iconMap[item[0]] || <LayoutDashboard className="w-4 h-4 flex-shrink-0" />}</span>
              <b>{item[1]}</b>
            </button>
          ))}
        </div>

        <div className="menu-heading account-heading">ACCOUNT</div>

        <button
          className={`side-item ${dashboardSection === 'notifications' ? 'active' : ''}`}
          onClick={() => handleSectionSelect('notifications')}
        >
          <span><Bell className="w-4 h-4 flex-shrink-0" /></span>
          <b>Notifications</b>
          {unreadCount > 0 && <i className="bg-red-500 text-white font-bold px-1.5 py-0.5 rounded-full text-[10px]">{unreadCount}</i>}
        </button>

        <button
          className={`side-item ${dashboardSection === 'profile' ? 'active' : ''}`}
          onClick={() => handleSectionSelect('profile')}
        >
          <span><User className="w-4 h-4 flex-shrink-0" /></span>
          <b>Profile</b>
        </button>

        <button className="logout" onClick={logout}>
          <LogOut className="w-4 h-4 text-red-400 flex-shrink-0" />
          <span>Logout</span>
        </button>
      </aside>

      <section className="dashboard-area">
        <header className="dashboard-topbar">
          <div className="dashboard-title-area">
            <button
              className="sidebar-mobile-button"
              onClick={() => setIsSidebarOpen((prev) => !prev)}
            >
              <Menu className="w-5 h-5" />
            </button>

            <div>
              <small>CARBON CONNECT</small>
              <h1>{titles[dashboardSection] || 'Dashboard'}</h1>
            </div>
          </div>

          <div className="top-user">
            <button
              className="top-notification relative"
              onClick={() => handleSectionSelect('notifications')}
            >
              <Bell className="w-4 h-4 inline" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-extrabold flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            <div className="user-avatar">{letter}</div>
            <b>{currentUser.name}</b>
          </div>
        </header>

        <div className="dashboard-content">{renderContent()}</div>
      </section>

      <div
        id="mobileOverlay"
        className={isSidebarOpen ? 'show' : ''}
        onClick={() => setIsSidebarOpen(false)}
      ></div>
    </div>
  );
};
