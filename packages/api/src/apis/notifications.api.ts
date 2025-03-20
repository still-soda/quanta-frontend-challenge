import { RequestResult } from '../utils/request.types';
import { get } from '../utils/request.utils';

export enum NotificationApi {
   GET_ALL_PUBLISHED_NOTIFICATIONS = '/notifications/find-all-published',
   GET_NOTIFICATION_DETAIL = '/notifications/detail/',
}

/**
 * 获取所有已发布的公告
 */
export function getAllPublishedNotifications() {
   return get<RequestResult<Notification[]>>(
      NotificationApi.GET_ALL_PUBLISHED_NOTIFICATIONS
   );
}

/**
 * 获取公告详情
 * @param id 公告id
 */
export function getNotificationDetail(id: string) {
   return get<RequestResult<string>>(
      `${NotificationApi.GET_NOTIFICATION_DETAIL}${id}`
   );
}
