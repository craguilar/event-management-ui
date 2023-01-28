import * as React from "react";
import GitInfo from 'react-git-info/macro';


export class Footer extends React.Component {

  private currentYear = new Date().getFullYear();
  private gitInfo = GitInfo();

  render() {
    return (
      <div>
        <footer className="page-footer font-small blue">
          <div className="footer-copyright text-center py-3">© {this.currentYear} Copyright: Carlos Ruiz - Version <i>{this.gitInfo.commit.shortHash}</i>
          </div>
        </footer>
      </div>

    );
  }
}
