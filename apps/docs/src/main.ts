import { createApp } from "vue";
import { createRouter, createWebHashHistory } from "vue-router";
import "@argon-kit/styles";
import "@argon-kit/editor/style"; // Quill snow 主题（lib 构建产物中的插件 CSS）
import "@argon-kit/plugins/style"; // noUiSlider / dropzone 样式
import "./styles/docs.css";
import App from "./App.vue";
import DocLayout from "./layout/DocLayout.vue";
import Home from "./pages/Home.vue";
import Install from "./pages/Install.vue";
import ButtonDoc from "./pages/ButtonDoc.vue";
import InputDoc from "./pages/InputDoc.vue";
import SelectDoc from "./pages/SelectDoc.vue";
import CheckboxDoc from "./pages/CheckboxDoc.vue";
import SwitchDoc from "./pages/SwitchDoc.vue";
import UploadDoc from "./pages/UploadDoc.vue";
import MessageDoc from "./pages/MessageDoc.vue";
import OverlayDoc from "./pages/OverlayDoc.vue";
import ModalDoc from "./pages/ModalDoc.vue";
import DatePickerDoc from "./pages/DatePickerDoc.vue";
import TableDoc from "./pages/TableDoc.vue";
import PageSelectDoc from "./pages/PageSelectDoc.vue";
import ProTableDoc from "./pages/ProTableDoc.vue";
import TreeSelectDoc from "./pages/TreeSelectDoc.vue";
import ResultDoc from "./pages/ResultDoc.vue";
import AppShellDoc from "./pages/AppShellDoc.vue";
import TabsDoc from "./pages/TabsDoc.vue";
import LoginDoc from "./pages/LoginDoc.vue";
import StatCardDoc from "./pages/StatCardDoc.vue";
import TreeDoc from "./pages/TreeDoc.vue";
import TransferDoc from "./pages/TransferDoc.vue";
import AlertDoc from "./pages/AlertDoc.vue";
import BadgeDoc from "./pages/BadgeDoc.vue";
import AvatarDoc from "./pages/AvatarDoc.vue";
import CardDoc from "./pages/CardDoc.vue";
import ProgressDoc from "./pages/ProgressDoc.vue";
import TimelineDoc from "./pages/TimelineDoc.vue";
import DescriptionsDoc from "./pages/DescriptionsDoc.vue";
import ListDoc from "./pages/ListDoc.vue";
import SliderDoc from "./pages/SliderDoc.vue";
import CollapseDoc from "./pages/CollapseDoc.vue";
import StepsDoc from "./pages/StepsDoc.vue";
import NotificationDoc from "./pages/NotificationDoc.vue";
import SweetAlertDoc from "./pages/SweetAlertDoc.vue";
import ChartsDoc from "./pages/ChartsDoc.vue";
import CalendarPluginDoc from "./pages/CalendarPluginDoc.vue";
import RichTextDoc from "./pages/RichTextDoc.vue";
import SliderTagsDoc from "./pages/SliderTagsDoc.vue";
import SelectCarouselDoc from "./pages/SelectCarouselDoc.vue";
import DropzoneDoc from "./pages/DropzoneDoc.vue";
import VectorMapDoc from "./pages/VectorMapDoc.vue";
import FormDoc from "./pages/FormDoc.vue";
import CrudFormModalDoc from "./pages/CrudFormModalDoc.vue";

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: "/", component: Home },
    {
      path: "/",
      component: DocLayout,
      children: [
        { path: "guide/install", component: Install },
        { path: "components/button", component: ButtonDoc },
        { path: "components/input", component: InputDoc },
        { path: "components/select", component: SelectDoc },
        { path: "components/checkbox", component: CheckboxDoc },
        { path: "components/switch", component: SwitchDoc },
        { path: "components/upload", component: UploadDoc },
        { path: "components/message", component: MessageDoc },
        { path: "components/overlay", component: OverlayDoc },
        { path: "components/modal", component: ModalDoc },
        { path: "components/datepicker", component: DatePickerDoc },
        { path: "components/table", component: TableDoc },
        { path: "components/page-select", component: PageSelectDoc },
        { path: "components/pro-table", component: ProTableDoc },
        { path: "components/tree-select", component: TreeSelectDoc },
        { path: "components/tree", component: TreeDoc },
        { path: "components/transfer", component: TransferDoc },
        { path: "components/stat-card", component: StatCardDoc },
        { path: "components/app-shell", component: AppShellDoc },
        { path: "components/tabs", component: TabsDoc },
        { path: "components/login", component: LoginDoc },
        { path: "components/result", component: ResultDoc },
        { path: "components/alert", component: AlertDoc },
        { path: "components/badge", component: BadgeDoc },
        { path: "components/avatar", component: AvatarDoc },
        { path: "components/card", component: CardDoc },
        { path: "components/progress", component: ProgressDoc },
        { path: "components/timeline", component: TimelineDoc },
        { path: "components/descriptions", component: DescriptionsDoc },
        { path: "components/list", component: ListDoc },
        { path: "components/slider", component: SliderDoc },
        { path: "components/collapse", component: CollapseDoc },
        { path: "components/steps", component: StepsDoc },
        { path: "components/notification", component: NotificationDoc },
        { path: "components/sweet-alert", component: SweetAlertDoc },
        { path: "plugins/charts", component: ChartsDoc },
        { path: "plugins/calendar", component: CalendarPluginDoc },
        { path: "plugins/rich-text", component: RichTextDoc },
        { path: "plugins/slider-tags", component: SliderTagsDoc },
        { path: "plugins/select-carousel", component: SelectCarouselDoc },
        { path: "plugins/dropzone", component: DropzoneDoc },
        { path: "plugins/vector-map", component: VectorMapDoc },
        { path: "components/form", component: FormDoc },
        { path: "components/crud-form-modal", component: CrudFormModalDoc },
      ],
    },
  ],
  scrollBehavior() {
    return { top: 0 };
  },
});

createApp(App).use(router).mount("#app");
