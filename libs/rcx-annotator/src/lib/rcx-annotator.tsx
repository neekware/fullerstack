import './rcx-annotator.module.scss';

import { Link, Route } from 'react-router-dom';

/* eslint-disable-next-line */
export interface RcxAnnotatorProps {}

export function RcxAnnotator(props: RcxAnnotatorProps) {
  return (
    <div>
      <h1>Welcome to RcxAnnotator!</h1>

      <ul>
        <li>
          <Link to="/">rcx-annotator root</Link>
        </li>
      </ul>
      <Route path="/" render={() => <div>This is the rcx-annotator root route.</div>} />
    </div>
  );
}

export default RcxAnnotator;
