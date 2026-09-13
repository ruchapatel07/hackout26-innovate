import React from 'react';
import { useAuth, roleNames } from '../../context/AuthContext';

export const ProfileSection = () => {
  const { currentUser } = useAuth();

  if (!currentUser) return null;

  const letter = currentUser.name.charAt(0).toUpperCase();

  return (
    <div className="content-enter">
      <div className="section-heading">
        <h2>My Profile</h2>
<<<<<<< HEAD
        <p>View your Carbon Connect account information.</p>
=======
        <p>View your CarbonTrace account information.</p>
>>>>>>> 90445d9 (Update Carbon Connect full stack application)
      </div>

      <div className="profile-box">
        <div className="profile-header">
          <div className="user-avatar">{letter}</div>
          <div>
            <h2>{currentUser.name}</h2>
            <p>{roleNames[currentUser.role]} Account</p>
          </div>
        </div>

        <div className="profile-details">
          <div className="profile-detail">
            <small>Full Name</small>
            <b>{currentUser.name}</b>
          </div>
          <div className="profile-detail">
            <small>Email Address</small>
            <b>{currentUser.email}</b>
          </div>
          <div className="profile-detail">
            <small>Phone Number</small>
            <b>{currentUser.phone}</b>
          </div>
          <div className="profile-detail">
            <small>Account Type</small>
            <b>{roleNames[currentUser.role]}</b>
          </div>
          <div className="profile-detail">
            <small>Account Status</small>
            <b>Verified</b>
          </div>
          <div className="profile-detail">
            <small>Platform</small>
<<<<<<< HEAD
            <b>Carbon Connect</b>
=======
            <b>CarbonTrace</b>
>>>>>>> 90445d9 (Update Carbon Connect full stack application)
          </div>
        </div>
      </div>
    </div>
  );
};
