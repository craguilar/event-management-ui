import * as React from "react";

// Properties
export interface PageTitleProps {
  title: string;
}

export class PageTitle extends React.Component<PageTitleProps> {
  render() {
    return (
      <div>
        <h3>{this.props.title}</h3>
      </div>
    );
  }
}
