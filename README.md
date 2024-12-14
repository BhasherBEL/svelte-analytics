# Svelte-analytics

Svelte-analytics is an opinionated svelte-kit library to handle analytics easily. It requires svelte 5 and a [plausible](https://plausible.io) server. It acts as a server-side only analytics middleware, respect user privacy and do not send any [PII](https://en.wikipedia.org/wiki/Personal_data).

## Features

## Planned features

- None for now!

## Usage

### Installation

```sh
npm install @bhasher/svelte-analytics@latest
```

### Initialization

`Svelte-analytics` needs to be initialized somewhere and be accessible to the rest of the back-end.

```ts
# analytics.ts

import { Analytics } from '@bhasher/Svelte-analytics';

export default new Analytics('my-website', 'https://plausible.domain.tld')
```

### Flows

Every tracking method requires at least a `RequestEvent` object. The methods are asynchronous, but errors can be caught as for any asynchronous function:
```ts
analytics.trackSomething(event).catch(console.warn);
```

#### Page view

```ts
analytics.trackPlausiblePageview(event);
```

#### Register

```ts
analytics.trackPlausibleRegister(
    event, 
    'password', // method
    'success' // result
);
```

#### Login

```ts
analytics.trackPlausibleLogin(
    event,
    'password', // method
    'success' //result
)
```

#### Custom

```ts
analytics.trackPlausibleCustom(
    event,
    'event-name',
    { 'test': true } // props
)
```
