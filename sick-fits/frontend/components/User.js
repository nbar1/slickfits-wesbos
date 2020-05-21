import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

const CURRENT_USER_QUERY = gql`
	query {
		me {
			id
			email
			name
			permissions
		}
	}
`;

const useUser = () => {
	const { data, loading, error } = useQuery(CURRENT_USER_QUERY);
	if (data) {
		return data.me;
	}
};

export { CURRENT_USER_QUERY, useUser };
