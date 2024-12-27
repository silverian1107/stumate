'use client';

/* eslint-disable no-console */

import { format } from 'date-fns';
import { AlertTriangle, Bell, CheckCircle, Info, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import type { Notification } from '@/service/rootApi';
import {
  useDeleteAllNotificationsMutation,
  useGetUserNotificationsQuery,
  useMarkNotificationAsReadMutation
} from '@/service/rootApi';

export default function Notifications() {
  const { data, isLoading, refetch } = useGetUserNotificationsQuery({
    current: 1
  });
  const [deleteAllNoti] = useDeleteAllNotificationsMutation();
  const [markAsRead] = useMarkNotificationAsReadMutation();

  const [selectedNotification, setSelectedNotification] =
    useState<Notification | null>(null);

  const notifications: Notification[] = Array.isArray(data?.data)
    ? data.data
    : [];

  const handleMarkAsRead = async (notification: Notification) => {
    if (notification.isRead) return;
    try {
      await markAsRead(notification._id).unwrap();
      toast.success('Notification marked as read.');
      await refetch();
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast.error('Failed to mark notification as read. Please try again.');
    }
  };

  const handleDeleteAll = async () => {
    try {
      await deleteAllNoti().unwrap();
      toast.success('All notifications deleted successfully.');
      await refetch();
    } catch (error) {
      console.error('Error deleting all notifications:', error);
      toast.error('Failed to delete all notifications. Please try again.');
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'SUCCESS':
        return <CheckCircle className="size-6 text-green-500" />;
      case 'WARNING':
        return <AlertTriangle className="size-6 text-yellow-500" />;
      case 'INFO':
      default:
        return <Info className="size-6 text-blue-500" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="size-8 animate-spin" />
      </div>
    );
  }

  return (
    <Card className="w-full max-w-7xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex items-center">
          <Bell className="mr-2" /> Notifications
        </CardTitle>
        <CardDescription>
          Stay updated with your latest notifications
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-end mb-4">
          <Button onClick={handleDeleteAll} variant="destructive">
            Delete All
          </Button>
        </div>
        {notifications.length === 0 ? (
          <p>No notifications</p>
        ) : (
          <ul className="space-y-4">
            {notifications.map((notification) => (
              <li
                key={notification._id}
                className={`flex items-start p-4 rounded-lg shadow-md transition-all duration-300 ${
                  notification.isRead ? 'bg-gray-100' : 'bg-white'
                }`}
                onClick={() => setSelectedNotification(notification)}
                // eslint-disable-next-line jsx-a11y/no-noninteractive-element-to-interactive-role
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    setSelectedNotification(notification);
                  }
                }}
              >
                <div className="shrink-0 mr-4">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="grow">
                  <h3
                    className={`text-lg font-medium ${notification.isRead ? 'text-gray-600' : 'text-gray-900'}`}
                  >
                    {notification.title}
                  </h3>
                  <p
                    className={`text-sm ${notification.isRead ? 'text-gray-500' : 'text-gray-700'}`}
                  >
                    {notification.body}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {format(new Date(notification.createdAt), 'PPpp')}
                  </p>
                </div>
                {!notification.isRead && (
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMarkAsRead(notification);
                    }}
                    variant="outline"
                    size="sm"
                    className="ml-4"
                  >
                    Mark as Read
                  </Button>
                )}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
      {selectedNotification && (
        // eslint-disable-next-line tailwindcss/migration-from-tailwind-2
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-lg">
            <CardHeader>
              <CardTitle>{selectedNotification.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{selectedNotification.body}</p>
              <p className="text-sm text-gray-500 mt-2">
                {format(new Date(selectedNotification.createdAt), 'PPpp')}
              </p>
            </CardContent>
            <div className="flex justify-end p-4">
              <Button
                onClick={() => setSelectedNotification(null)}
                variant="outline"
              >
                Close
              </Button>
            </div>
          </Card>
        </div>
      )}
    </Card>
  );
}
