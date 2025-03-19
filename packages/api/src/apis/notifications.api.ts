import { RequestResult } from '../utils/request.types';
import { get } from '../utils/request.utils';

/**
 * 获取所有已发布的公告
 */
export function getAllPublishedNotifications() {
   return get<RequestResult<Notification[]>>(
      '/notifications/find-all-published'
   );
}

/**
 * 获取公告详情
 * @param id 公告id
 */
export function getNotificationDetail(id: string) {
   return get<RequestResult<string>>(`/notifications/detail/${id}`);
}
