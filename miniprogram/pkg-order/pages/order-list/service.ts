import { authStore } from '../../../stores/auth.store';
import { ROUTES } from '../../../constants/routes';
import { openRoute } from '../../../utils/router';

export type OrderListScenario = 'normal' | 'empty' | 'error';

export interface OrderListItem {
  /** 订单编号，用于后续进入详情页或请求详情接口。 */
  id: string;
  /** 订单标题，页面主标题展示。 */
  title: string;
  /** 供应商名称，辅助采购人员快速识别来源。 */
  supplierName: string;
  /** 金额展示文案，已从后端金额分转换为元。 */
  amountText: string;
  /** 订单状态中文文案，避免页面直接理解后端枚举。 */
  statusText: string;
  /** 订单创建时间展示文案。 */
  createdAt: string;
}

export interface OrderListResult {
  /** 页面列表可直接渲染的订单项。 */
  items: OrderListItem[];
  /** 当前条件下的订单总数。 */
  total: number;
  /** 本次列表数据更新时间。 */
  updatedAt: string;
}

interface OrderListQuery {
  /** 本地模拟场景，用于验证正常态、空态和错误态。 */
  scenario: OrderListScenario;
}

interface OrderListDto {
  /** 后端订单编号。 */
  orderId: string;
  /** 后端订单标题。 */
  title: string;
  /** 后端供应商名称。 */
  supplierName: string;
  /** 后端金额字段，单位为分。 */
  amountCents: number;
  /** 后端状态枚举。 */
  status: 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED';
  /** 后端创建时间文案，真实接入后可替换为 ISO 时间。 */
  createdAt: string;
}

const MOCK_ORDER_DTOS: OrderListDto[] = [
  {
    orderId: 'PO-20260419-001',
    title: '办公设备采购订单',
    supplierName: '湖北政采供应商一号',
    amountCents: 1286000,
    status: 'PENDING_REVIEW',
    createdAt: '2026-04-19 09:30',
  },
  {
    orderId: 'PO-20260419-002',
    title: '网络安全服务采购订单',
    supplierName: '武汉数安科技有限公司',
    amountCents: 5600000,
    status: 'APPROVED',
    createdAt: '2026-04-18 16:42',
  },
  {
    orderId: 'PO-20260418-018',
    title: '会议室改造配套订单',
    supplierName: '襄阳云采工程服务中心',
    amountCents: 734500,
    status: 'REJECTED',
    createdAt: '2026-04-18 11:05',
  },
];

const ORDER_STATUS_TEXT: Record<OrderListDto['status'], string> = {
  PENDING_REVIEW: '待审查',
  APPROVED: '已通过',
  REJECTED: '已退回',
};

const formatAmount = (amountCents: number): string => {
  const yuan = Math.floor(amountCents / 100);
  const cents = `${amountCents % 100}`.padStart(2, '0');

  return `¥${yuan}.${cents}`;
};

const toOrderListItem = (dto: OrderListDto): OrderListItem => ({
  id: dto.orderId,
  title: dto.title,
  supplierName: dto.supplierName,
  amountText: formatAmount(dto.amountCents),
  statusText: ORDER_STATUS_TEXT[dto.status],
  createdAt: dto.createdAt,
});

export const canVisitOrderList = (): boolean => authStore.state.isAuthenticated;

export const redirectToLoginFromOrderList = (): void => {
  openRoute(ROUTES.LOGIN, authStore.state, 'reLaunch');
};

export const getScenarioLabel = (scenario: OrderListScenario): string => {
  if (scenario === 'empty') {
    return '空态模拟';
  }

  if (scenario === 'error') {
    return '错误态模拟';
  }

  return '正常态模拟';
};

export const fetchOrderList = async (query: OrderListQuery): Promise<OrderListResult> => {
  if (query.scenario === 'error') {
    throw new Error('订单列表加载失败，请稍后重试');
  }

  const source = query.scenario === 'empty' ? [] : MOCK_ORDER_DTOS;

  return {
    // 这里模拟后端 DTO 到页面 ViewModel 的转换，真实联调时仍保持页面不直接渲染 DTO。
    items: source.map(toOrderListItem),
    total: source.length,
    updatedAt: '2026-04-19 10:20',
  };
};

export const getOrderDetailPlaceholderMessage = (orderId: string): string =>
  `订单 ${orderId} 详情页暂未接入`;
