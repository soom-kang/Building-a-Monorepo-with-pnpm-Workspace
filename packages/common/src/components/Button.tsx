import type { FC, PropsWithChildren } from 'react';

interface Props extends PropsWithChildren {
	textColor: string;
}

const Button: FC<Props> = (props) => {
	return <button style={{ color: props.textColor }}>{props.children}</button>;
};

export default Button;
