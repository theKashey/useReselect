import * as React from 'react';
import {createSelector, useReselect, useReReselect} from "../src";

let recomputations = 0;

const getUser = createSelector((state: any, userId: string) => (
  state.users[userId] + `:${recomputations++}`
), x => `${x}:${recomputations++}`);

// const getSharedUser = createSelector((state: any, userId: string) => (
//   state.users[userId] + `:${recomputations++}`
// ), x => `${x}:${recomputations++}`);
//
// const getCountedUser = createSelector(
//   (state: any, userId: string) => (state.users[userId] + `:${recomputations++}`),
//   (state: any, userId: string) => userId,
//   (x, y) => `${x}:${recomputations++}|${y}`
// );


const state = {
  users: {
    'a': 'userA',
    'b': 'userB',
  }
};
//
// const User = ({userId, tick}) => {
//   const userName = useReselect(() => getUser(state, userId));
//
//   return <span>user({userId}): {userName} | {tick}</span>
// }
//
// const CountedUser = ({userId, tick}) => {
//   const userName = useReselect(() => getCountedUser(state, userId));
//
//   return <span>user({userId}): {userName} | {tick}</span>
// }
//
// const SharedUser = ({userId, tick}) => {
//   const userName = useReselect(() => getSharedUser(state, userId));
//
//   return <span>user({userId}): {userName} | {tick}</span>
// }
//
// const DoubleUser = ({userId, tick}) => {
//   const userName1 = useReselect(() => getUser(state, 'a'));
//   const userName2 = useReselect(() => getUser(state, 'b'));
//
//   return <span>{tick}: {userName1} | {userName2}</span>
// }

const DoubleUserMixed = ({userId, tick}) => {
  const [userName1, userName2] = 0 * tick % 2
    ? useReReselect(() => [getUser(state, 'a'), getUser(state, 'b')])
    : useReReselect(() => [getUser(state, 'b'), getUser(state, 'a')]);

  const lastStack = useReReselect.getStack();

  React.useEffect(() => {
    // testing ability to repeat selector
    console.log('>>', useReselect(() => getUser(state, 'b'), lastStack));
  });

  return <span>{tick}: {userName1} | {userName2}</span>
}

const App = () => {
  const [tick, nextTick] = React.useState(0);

  React.useEffect(() => {
    const tm = setInterval(() => nextTick(t => t + 1), 1000);

    return () => clearTimeout(tm);
  }, [])

  return (
    <div> tick: {tick}
      <ul>
        {/*<li><User userId='a' tick={tick}/></li>*/}
        {/*<li><User userId='b'/></li>*/}
        {/*<li><User userId='a'/></li>*/}
        {/*<li><User userId='b'/></li>*/}
        {/*<li>counted:</li>*/}
        {/*<li><CountedUser userId='a' tick={tick}/></li>*/}
        {/*<li><CountedUser userId='b'/></li>*/}
        {/*<li><CountedUser userId='a'/></li>*/}
        {/*<li><CountedUser userId='b'/></li>*/}
        {/*<li>shared:</li>*/}
        {/*<li><SharedUser userId='a' tick={tick}/></li>*/}
        {/*<li><SharedUser userId='a'/></li>*/}
        {/*<li><SharedUser userId='a'/></li>*/}
        {/*<li>double data</li>*/}
        {/*<li><DoubleUser tick={tick}/></li>*/}
        <li><DoubleUserMixed tick={tick}/></li>
      </ul>
    </div>
  );
}

export default App;