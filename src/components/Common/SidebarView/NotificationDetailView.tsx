/**
 * This files define notification detail view
 * @author Joomyoung Park <joommm516@gmail.com>
 */

import React from 'react';
import { Box, Typography } from '@mui/material';
import type { Announcement } from '../../../data/Miscellaneous/getAnnouncements';

interface NotificationDetailViewProps {
  data: Announcement;
}

/**
 * NotificationDetailView - Renders the detail view of a selected notification.
 * @param {NotificationDetailViewProps} props ㅇ
 * @returns {React.ReactElement} Rendered detail view with back button and full content
 */
export default function NotificationDetailView({
  data,
}: NotificationDetailViewProps): React.ReactElement {
  return (
    <Box px={3} py={3}>
      <Typography variant="body1" mb={2}>
        {data.title}
      </Typography>
      <Typography variant="body3">{data.content}</Typography>
    </Box>
  );
}
