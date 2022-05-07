import * as React from "react";
export * from "./templates";


type DialogProps = {
  show: boolean;
  onClose: () => void;
  hasCloseButton?: boolean;
  children?: React.ReactNode;
};
type DialogState = {
};
export class Dialog extends React.Component<DialogProps, DialogState> {
  constructor(props: DialogProps) {
    super(props);
  }

  render () {
    const {hasCloseButton, show, children} = this.props;
    return (
      <div className={'dialog-container' + (show ? '' : ' hidden')}>
        <div className="close-btn" onClick={this.props.onClose} style={{display: hasCloseButton ? 'flex' : 'none'}}><div>&times;</div></div>
        {children}
      </div>
    );
  }
}