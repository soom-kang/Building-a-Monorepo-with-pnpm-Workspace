# Abstract

Introducing the Monorepo Approach through pnpm Workspace.

`Multi Repo`, `Mono Repo`, `Micro Frontend Architecture` 등 최근에는 효율성을 높이기 위한 다양한 접근 방법이 소개되고 있다.

본 포스팅에서는 `pnpm workspace` 릁 통해 간단한 `Monorepo` 구조를 구현해 보겠다.

p.s 지난번 `dev.to` 쪽 이슈로 글이 날아가버려서 다시 쓰는 내용이기 때문에 기억이 잘 나지 않아 아쉽다.
역시 백업은 중요한 것

---

## Getting Started

<p>
  <img src="https://img.shields.io/badge/pnpm-F69220?style=flat-square&logo=pnpm&logoColor=white"/>
  <img src="https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=Vite&logoColor=white"/>
  <img src="https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=React&logoColor=white"/>
  <img src="https://img.shields.io/badge/TypeScript-3178c6?style=flat-square&logo=TypeScript&logoColor=white"/>
</p>

### Prerequisite

- `pnpm` global 설치가 필요

##### Terminal

```sh
# Node Version <16.14
npm install -g pnpm

# Node Version >16.17
corepack enable

corepack prepare pnpm@latest --activate
```

---

### Set Project Structure

프로젝트 구조를 구성해보자

```
├── packages/
│   ├── app/
│   └── common/
├── package.json
└── pnpm-workspace.yaml
```

파일 생성 뒤 다음과 같이 작성

##### /package.json

```json
{
	"name": "@soom/root",
	"private": true,
	"scripts": {
		"preinstall": "pnpm dlx only-allow pnpm"
	},
	"workspaces": ["packages/*"],
	"engines": {
		"node": ">=16.14.2",
		"pnpm": ">=7.9.0"
	},
	"packageManager": "pnpm@7.9.0",
	"devDependencies": {
		"pnpm": "^7.9.0"
	}
}
```

##### /pnpm-workspace.yaml

```yaml
packages:
  - 'packages/*'
```

---

`packages/app/` `packages/common/` 폴더 안에 리액트 프로젝트를 생성

여기서는 `vite` 를 통해 생성

```sh
pnpm create vite .
```

---

### Setting Common Component

먼저 `packages/common/` 폴더 쪽에 다음과 같이 Button Component를 생성

##### packages/common/src/components/Button.tsx

```ts
import type { FC, PropsWithChildren } from 'react';

interface Props extends PropsWithChildren {
	textColor: string;
}

const Button: FC<Props> = (props) => {
	return <button style={{ color: props.textColor }}>{props.children}</button>;
};

export default Button;
```

---

`main.tsx` 에서 방금전 생성한 Button Component 를 export

##### packages/common/src/main.tsx

```ts
import Button from './components/Button';

export { Button };
```

---

`package.json`을 다음과 같이 수정

##### packages/common/package.json

```json
{
	"name": "@soom/common",
	"type": "module",
	"main": "./src/main.tsx",
    ...
}
```

---

### Run App with Imported Shared Component

이제 `app` 폴더로 가서 `package.json` 을 다음과 같이 수정 후 패키지 설치 재실행

##### packages/app/package.json

```json
{
	"name": "@soom/app",
	"private": true,
	"type": "module",
    ...
	"dependencies": {
		"@soom/common": "^0.0.0",

	},
    ...
}
```

패키지 설치

```sh
pnpm install
```

---

`App.tsx` 에서 좀전에 설치한 `@soom/common` 패키지를 이용해 버튼을 import

##### packages/app/src/App.tsx

```ts
import './App.css';
import { Button } from '@soom/common';

function App() {
	return (
		<div className='App'>
			<h1>Monorepo Button?</h1>

			<Button textColor='red'>Hello Common Package Button</Button>
		</div>
	);
}

export default App;
```

`app` 폴더에서 프로젝트 실행

이제 `common` 프로젝트의 버튼이 무사히 `app` 프로젝트에 적용이 된것을 확인할 수 있다.

```sh
pnpm dev
```

---

## Result

### 👉 [CodeSandBox Sample Link](https://codesandbox.io/p/github/soom-kang/Building-a-Monorepo-with-pnpm-Workspace/main?file=%2FREADME.md)

![Result](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/ltnyvmbxcirirh58ia52.png)

---

➕ P.S

마지막으로 monorepo 루트 폴더에서 직접 `app`폴더에 접근하지 않고 구동시키기 위해서 root 폴더의 `package.json`에 다음과 같이 스크립트를 사용할 수 있다.

##### package.json

```json
{
	"name": "@soom/root",
...

    "scripts": {
    	"preinstall": "pnpm dlx only-allow pnpm",
        "dev:app": "pnpm --filter @soom/app dev"
    },

...
}

```

###### Terminal

```sh
pnpm dev:app
```

---

# Conclusion

`pnpm workspace` 를 이용해서 monorepo 를 구성해보았다.
이 프로젝트에 `turborepo`, `lerna` 등을 이용해 다양한 관리를 할 수 있다.
monorepo를 구성하는 방법은 여러가지가 있지만 개인적으로 `pnpm workspace`를 이용하는 방법이 가장 가볍고 직관적이었다.

pnpm 의 자세한 내용은 하기 링크를 참고.
https://pnpm.io/ko/

Monorepo Tool에 대한 자세한 내용은 하기 링크를 참조.
참고 링크: https://monorepo.tools/
