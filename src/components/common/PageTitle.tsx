import * as React from "react";
import { Trans } from "react-i18next";

// Properties
export interface PageTitleProps {
  title: string;
}

export class PageTitle extends React.Component<PageTitleProps> {
  render() {
    return (
      <div>
        <Trans>
          <h3>{this.props.title}</h3>
        </Trans>
      </div>
    );
  }
}
