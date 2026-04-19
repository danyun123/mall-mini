import {
  canVisitOrderList,
  fetchOrderList,
  getOrderDetailPlaceholderMessage,
  getScenarioLabel,
  redirectToLoginFromOrderList,
  type OrderListItem,
  type OrderListScenario,
} from './service';

interface OrderListPageData {
  /** 当前渲染的订单列表。 */
  items: OrderListItem[];
  /** 当前场景下的订单总数。 */
  total: number;
  /** 是否正在加载列表。 */
  loading: boolean;
  /** 错误态提示文案，为空时表示当前无错误。 */
  errorMessage: string;
  /** 当前模拟场景，用于切换正常态、空态和错误态。 */
  scenario: OrderListScenario;
  /** 当前模拟场景的中文展示文案。 */
  scenarioLabel: string;
  /** 当前列表数据更新时间。 */
  updatedAt: string;
}

const createInitialData = (): OrderListPageData => ({
  items: [],
  total: 0,
  loading: false,
  errorMessage: '',
  scenario: 'normal',
  scenarioLabel: getScenarioLabel('normal'),
  updatedAt: '',
});

Page({
  data: createInitialData(),
  async onLoad() {
    if (!canVisitOrderList()) {
      redirectToLoginFromOrderList();
      return;
    }

    await this.loadOrders('normal');
  },
  async onPullDownRefresh() {
    await this.loadOrders(this.data.scenario);
    wx.stopPullDownRefresh();
  },
  async loadOrders(scenario: OrderListScenario) {
    this.setData({
      loading: true,
      errorMessage: '',
      scenario,
      scenarioLabel: getScenarioLabel(scenario),
    });

    try {
      const result = await fetchOrderList({ scenario });

      this.setData({
        items: result.items,
        total: result.total,
        updatedAt: result.updatedAt,
        loading: false,
      });
    } catch (error) {
      this.setData({
        items: [],
        total: 0,
        updatedAt: '',
        loading: false,
        errorMessage: error instanceof Error ? error.message : '订单列表加载失败',
      });
    }
  },
  switchScenario(event: WechatMiniprogram.BaseEvent) {
    const scenario = event.currentTarget.dataset.scenario as OrderListScenario | undefined;

    if (!scenario) {
      return;
    }

    void this.loadOrders(scenario);
  },
  retry() {
    void this.loadOrders(this.data.scenario);
  },
  openDetail(event: WechatMiniprogram.BaseEvent) {
    const orderId = event.currentTarget.dataset.id as string | undefined;

    if (!orderId) {
      return;
    }

    wx.showToast({
      title: getOrderDetailPlaceholderMessage(orderId),
      icon: 'none',
    });
  },
});
