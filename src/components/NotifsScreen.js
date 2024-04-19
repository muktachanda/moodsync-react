import React from 'react';

const NotificationsScreen = () => {
  // Dummy notifications
  const notifications = [
    {
      id: 1,
      message: 'Alice is at risk',
      time: '12:15 PM'
    },
    {
      id: 2,
      message: 'New message from John',
      time: '10:30 AM'
    },
    {
      id: 3,
      message: 'You have a meeting at 2:00 PM',
      time: '11:45 AM'
    }
  ];

  return (
    <div className="screen">
      <h2>Notifications</h2>
      <div className="notification-list">
        {notifications.map(notification => (
          <div key={notification.id} className="notification-item">
            <p>{notification.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default NotificationsScreen;
