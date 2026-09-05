<!--
 *              © 2025-2026 Visa
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 -->
# Visa Product Design System - Nova React

## Quick start for this fork

**Agents:** follow the launch-first instructions at the top of `AGENTS.md`.
Start the app before exploring architecture or running a full repository audit.

From the repository root, run:

```sh
bash run.sh
```

Open **http://localhost:3000/react/**. The script installs the locked dependencies
and starts the workshop directly from the library's TypeScript sources. No Rollup
build, doc-generation pass, coverage run, private Visa package, or API key is needed.
This is a real Vite development server with live compilation and HMR, not a
checked-in preview snapshot. `bash run.sh --dev` is an alias for the same behavior.
On a bare Linux x64/arm64 VM without Node 22.12+, it downloads a checksum-verified
Node 22 runtime into your user cache (requires curl, wget, or Python 3).
Otherwise it uses your existing Node installation. No system-wide npm install is needed.

Startup resolves pnpm once and goes directly to the workshop's normal `predev`
and `dev` scripts after `pnpm install --frozen-lockfile`. It does not skip dependency
validation or lifecycle scripts. Metadata generation groups examples by file and
only writes changed output, avoiding redundant disk writes and watcher events.
Use `pnpm test:startup` to verify these startup invariants.

After the first install, use `pnpm start` for the shortest restart path, or rerun
`bash run.sh` to also reconcile dependencies. `bash run.sh --port 3001` selects
another port; an occupied port causes an error rather than silently moving.
The dev server listens on `0.0.0.0` and accepts localhost and Replit preview
hostnames. For another proxy, set Vite's
`__VITE_ADDITIONAL_SERVER_ALLOWED_HOSTS` to its exact hostname.

For an imported project, configure its run command as `bash run.sh`, use Node 22,
and expose port 3000. Keep long-running VM sessions under a process supervisor;
do not leave the server attached to a short-lived setup shell.

`pnpm dev` and `pnpm dev:docs` use the same source-first path. The small navigation
manifest is generated automatically on each start, including on a clean clone.
Component API metadata and source-code views also read from the source tree.

- [About](#about)
- [Security](#security)
- [Background](#background)
- [Install](#install)
- [Usage](#usage)
- [Why Nova React?](#why-nova-react)
- [Testing](#testing)
- [Maintainers](#maintainers)
- [Thanks](#thanks)
- [Contributing](#contributing)
- [License](#license)

## <a name="about"></a>About Nova React

Accessible Visa Product Design System components built for React

Nova React is a comprehensive library of accessible components designed to align with the Visa Product Design System. It provides developers with a set of reusable UI elements that can be easily integrated into React applications. With Nova React, developers can quickly build visually consistent and user-friendly interfaces that adhere to accessibility best practices.

### Key Features

- **Wide range of components**: Includes buttons, form elements, navigation menus, and more.
- **Customizable**: Built on Nova Styles CSS, allowing for extensive theming and customization.
- **Accessibility**: Adheres to accessibility best practices to ensure inclusive user experiences.
- **Flexible state management**: Supports bring-your-own state, enabling custom services and classes.

Whether you are building a small project or a large-scale application, Nova React offers a robust foundation for creating visually appealing and accessible user interfaces.

This library is built on our Nova Styles CSS which is extremely theme-able/customizable and the React components are now bring-your-own state. That means if our examples, styles, or behaviors don't cover your use case then you just add your own services, classes, or themes and now the world is your oyster!

## <a name="security"></a>Security

Our package follows security best practices and ensures the safety of user data. It relies on a minimal number of dependencies, minimizing potential vulnerabilities.

## <a name="install"></a>Install

Available through [NPM](https://www.npmjs.com/).

### Run the workshop locally

With Node 22.12+ and pnpm 10.8.0 already available:

```sh
pnpm install --frozen-lockfile
pnpm start
```

The workshop is available at `http://localhost:3000/react`.

Alternatively, run it with Docker:

```sh
docker build -t nova-react .
docker run --rm -p 3000:3000 nova-react
```

Docker caches dependency installation separately from source changes and excludes
local dependencies/build output from its context. It runs the development
workshop, not a production web server. For a production bundle, run
`pnpm build:docs`; library packaging remains available via `pnpm build:lib`.
`pnpm dev:packages` retains the original library-watch + workshop workflow.
The full `pnpm build` / coverage pipeline is intentionally not part of startup.

This fork removes the unavailable private `@visa/scripts` package from normal
installation. Upstream maintenance commands `api:json` and `license:update` still
require that private tool and are not needed to run the workshop.

**NPM:**

```sh
npm install @visa/nova-react
```

**PNPM:**

```sh
pnpm install @visa/nova-react
```

**Yarn:**

```sh
yarn add @visa/nova-react
```

**Bun:**

```sh
bun add @visa/nova-react
```

### Dependencies

View our package.json for the most up-to-date dependencies, including peer dependencies and dev dependencies.

## <a name="usage"></a>Usage

### Step 1: Update React

Nova React supports React 18 and up. Visit React’s guide on <a href="https://react.dev/blog/2022/03/08/react-18-upgrade-guide">how to upgrade to React 18</a> for more.

### Step 2: Install the library

Reference our <a href="#install">install guidelines</a>.

### Step 3: Set up the application

#### Import Nova styles

Import the Nova Styles library and your desired theme at the root level of your React project. The visa-light theme is the default.

```ts
import React from 'react';
import { createRoot } from 'react-dom/client';

// Import the styles:
import '@visa/nova-styles/styles.css';
// Import your desired theme:
import '@visa/nova-styles/themes/visa-light/index.css';

const root = createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

### Step 4: Add icons (optional)

For React, each icon has been developed as a React component, allowing you to selectively choose the icons you need. The library is designed to support deep tree shaking, ensuring that only the icons you use are bundled with your app. This optimization reduces build and load times as well as app sizes. The React library also provides native support for TypeScript, along with full support for all SVG properties and refs.

Once you’ve installed the icon library, you can use them as components inside your TSX or JSX.

```tsx
import React from 'react';
import { GenericAccessibilityLow, GenericCalendarTiny } from '@visa/nova-icons-react';

export const MyComponent: React.FC = () => (
  <div>
    MyComponent
    <GenericAccessibilityLow />
    <GenericCalendarTiny />
  </div>
);
```

### Step 5: Use the components

You’re ready to use React components by copying and pasting the example code into your application. Check out below how to put our components to use with a few sample components.

```tsx
import { Button, ContentCard, ContentCardBody, ContentCardTitle, Link, Typography, Utility } from '@visa/nova-react';

type YourComponentProps = { className?: string; name?: string };

// Reusable component that has a name prop with a default name set to "Alex Miller",
// and developer can add to the className prop at the top layer of the component.
const YourComponent = ({ className, name = 'Alex Miller' }: YourComponentProps) => {
  return (
    <ContentCard borderBlockEnd className={className}>
      <Utility element={<ContentCardBody />} vFlex vFlexCol vGap={4}>
        <ContentCardTitle variant="headline-4">{name}</ContentCardTitle>
        <Typography className="v-pt-4">Our favorite commmunity member</Typography>
        <Utility vAlignItems="center" vFlex vFlexWrap vGap={16} vPaddingTop={12}>
          <Button>Primary action</Button>
          <Link href="./content-card" noUnderline>
            Destination label
          </Link>
        </Utility>
      </Utility>
    </ContentCard>
  );
};

export default YourComponent;
```

## <a name="why-nova-react"></a>Why Nova React?

### Light Weight

We've reduced our library to basic markup components and functional hooks for a lighter, simpler, and more flexible experience.

### Building Blocks

No more waiting on feature requests. We provide the building blocks for you to easily create and customize your own components.

### Built For Developers

Nova React is sleek and unobtrusive. Our beautifully designed components allow any developer to create stunning apps with ease. We now also support strict type safety, so now type warnings are provided inline, before building and deploying.

## <a name="testing"></a>Testing

### Our Approach

We conduct rigorous testing using Jest to ensure our components are accessible and meet our high standards. We use Axe for comprehensive accessibility testing and snapshot testing to minimize regression. Each component undergoes individual unit testing based on its API, followed by integration testing using examples to ensure seamless interaction.

Our goal is to achieve 100% test coverage for all components. Our pipeline safeguards against merging any code that fails our tests. While we have hundreds of tests providing us with full code coverage, we recognize that there is always room for improvement. We are constantly working to improve our testing suite.

## <a name="maintainers"></a>Maintainers

This project is maintained by the Visa Product Design System engineering team. If you need to get in touch please reach out to us via any of our options on our support page.

## <a name="thanks"></a>Thanks

Thanks to all those who have contributed and to the Visa Product Design team for all of the hours and thought that have gone into making the design system as easy to use as possible.

## <a name="contributing"></a>Contributing

SEE CONTRIBUTING.md

## <a name="license"></a>License

SEE LICENSE IN LICENSE
