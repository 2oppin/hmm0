import * as React from "react";

export const alertDlg = (contents: React.ReactElement | string, cb?: () => void | null) =>
<div className="dialog">
  <div className="dialog-content">
    {contents}
  </div>
  <div className="buttons">
    <button onClick={cb || closeParentDlg}>OK</button>
  </div>
</div>;

export const textDlg = (contents: React.ReactElement | string, buttons: [string, () => void][]) =>
<div className="dialog">
  <div className="dialog-content">
    {contents}
  </div>
  <div className="buttons">
    {buttons.map(([title, cb], i) => <button key={i} onClick={cb || closeParentDlg}>{title}</button>)}
  </div>
</div>;

function closeParentDlg(e: React.MouseEvent<HTMLButtonElement>) {
  const el: HTMLElement | null = e.currentTarget.parentElement;
  const closeBtn = el.closest('.dialog-container').querySelector('.close-btn');
  (closeBtn as HTMLElement).click();
}
