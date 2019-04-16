useReselect
===

__DEVELOPMENT PREVIEW__

This is a fork of [reselect](https://github.com/reduxjs/reselect), mixed with [kashe](https://github.com/theKashey/kashe) and React `hooks`.

# API
API is 100% compatible with Reselect.

- `createSelector` - as seen in reselect

# Hooks
## useReselect
- `useReselect(cb)` - selection runner. __All__ selectors inside would be executed inside a sandbox, making result instance bound.
```js
const getUser = createSelector((state: any, userId: string) => (
  state.users[userId] + `:${recomputations++}`
), i => i);

const User = ({userId, tick}) => {
  const userName = useReselect(() => getUser(state, userId));
  return <span>user({userId}): {userName}</span>
}

// this would work
<>
 <User userId="user1" />
 <User userId="user2" /> 
</>


// this would not, getUser still could hold only one result
const DoubleUser = ({userId, tick}) => {
  const [u1, u2] = useReselect(() => [getUser(state, 'a'),getUser(state, 'b')]);
  return <span>{u1} - {u2}</span>
}
```

## useReReselect
- `useReReselect(cb)` - selection runner. __Every__ selector inside would be executed in a personal sandbox, making it instance bound
```js
// every selector would be executed in a personal sandbox
const DoubleUser = ({userId, tick}) => {
  const [u1, u2] = useReReselect(() => [getUser(state, 'a'),getUser(state, 'b')]);
  return <span>{u1} - {u2}</span>
}
```

## Running selectors without React
```js
// run it once
const [u1, u2] = useReReselect(() => [getUser(state, 'a'),getUser(state, 'b')]);
// get "hooks"
const stack = useReReselect.getStack();

// run it with "custom hooks"
const [u1, u2] = useReReselect(() => [getUser(state, 'a'),getUser(state, 'b')], stack);
```

## Sharing results
All selectors are double memoized, letting _shareable_ data be shared.

# License
MIT