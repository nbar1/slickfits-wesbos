import styled, { ThemeProvider, injectGlobal } from 'styled-components';
import Header from './Header';
import Meta from './Meta';

const theme = {
	red: '#ff0000',
	black: '#393939',
	grey: '#3a3a3a',
	lightgrey: '#e1e1e1',
	offWhite: '#ededed',
	maxWidth: '1000px',
	bs: '0 12px 24px 0 rgha(0, 0, 0, 0.09)',
};

const StyledPage = styled.div`
	background: #fff;
	color: ${props => props.theme.black};
`;

const Inner = styled.div`
	max-width: ${props => props.theme.maxWidth};
	margin: 0 auto;
	padding: 2rem;
`;

injectGlobal`
	@font-face {
		font-family: 'radnika_next';
		src: url('/static/radnikanext-medium-webfont.woff2') format('woff2');
		font-weight: normal;
		font-style: normal;
	}

	html {
		box-sizing: border-box;
		font-size: 10px;
	}

	*, *:before, *:after {
		box-sizing: inherit;
	}

	body {
		font-size: 1.5rem;
		margin: 0;
		padding: 0;
		line-height: 2;
		font-family: 'radnika_next';
	}

	a {
		text-decoration: none;
		color: ${theme.black};
	}
`;

const Page = ({ children }) => {
	return (
		<ThemeProvider theme={theme}>
			<StyledPage>
				<Meta />
				<Header />
				<Inner>{children}</Inner>
			</StyledPage>
		</ThemeProvider>
	);
};

Page.propTypes = {};

export default Page;
