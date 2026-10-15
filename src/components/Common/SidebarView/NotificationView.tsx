/**
 * NotificationView is a component that handles notification list and detail view.
 * It internally uses the selected state to control the transition between the two views.
 * @author Joomyoung Park <joommm516@gmail.com>
 */

import React from 'react';
import { SidebarList } from '../SidebarMenu/SidebarMenu.styles';
import { useGlobalContext } from '../../../GlobalContext';
import { SidebarMenuItem } from '../SidebarMenu';
import { Announcement } from '../../../data/Miscellaneous/getAnnouncements';
import NotificationDetailView from './NotificationDetailView';

interface NotificationsViewProps {
  selected: Announcement | null;
  onSelect: (item: Announcement) => void;
}

/**
 * NotificationsView - Displays a list of announcements in sidebar view format.
 * @param {NotificationsViewProps} for stacks
 * @returns {React.ReactElement} Notifications sidebar content
 */
export default function NotificationView({
  selected,
  onSelect,
}: NotificationsViewProps): React.ReactElement {
  const { announcements } = useGlobalContext();

  return (
    <>
      {selected ? (
        <NotificationDetailView data={selected} />
      ) : (
        <SidebarList>
          {announcements.map((item, idx) => (
            <SidebarMenuItem
              key={item.title}
              item={{
                ...item,
                label: item.title,
                content: item.content,
                onClick: () => {
                  onSelect(item);
                },
              }}
              spacing={0}
              showDivider={true}
              isLast={idx === announcements.length - 1}
            />
          ))}
        </SidebarList>
      )}
    </>
  );
}
