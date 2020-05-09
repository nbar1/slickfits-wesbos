import Page from '../components/Page';
import { ApolloProvider } from 'react-apollo';
import withData from '../lib/withData';

const App = ({ Component, pageProps, apollo }) => (
	<ApolloProvider client={apollo}>
		<Page>
			<Component {...pageProps} />
		</Page>
	</ApolloProvider>
);

App.getInitialProps = async ({ Component, ctx }) => {
	let pageProps = {};
	if (Component.getInitialProps) {
		pageProps = await Component.getInitialProps(ctx);

		pageProps.query = ctx.query;
		return pageProps;
	}
};

export default withData(App);
