import type { ReactNode } from "react";
import type { ResultStatus } from "@argon-kit/core";

const COPY: Record<ResultStatus, { title: string; sub: string }> = {
  "403": { title: "无权访问", sub: "你没有权限查看该页面，请联系管理员。" },
  "404": { title: "页面不存在", sub: "你访问的地址不存在或已被移除。" },
  "500": { title: "服务器错误", sub: "服务暂时不可用，请稍后重试。" },
};

export function Result({
  status = "403",
  title,
  subTitle,
  extra,
}: {
  status?: ResultStatus;
  title?: string;
  subTitle?: string;
  extra?: ReactNode;
}) {
  const fallback = COPY[status];
  return (
    <div className={`ag-result ag-result--${status}`}>
      <div className="ag-result__code">{status}</div>
      <h2 className="ag-result__title">{title ?? fallback.title}</h2>
      <p className="ag-result__sub">{subTitle ?? fallback.sub}</p>
      {extra}
    </div>
  );
}
