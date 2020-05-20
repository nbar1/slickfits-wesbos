import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';

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

const User = ({ children }) => {
	const payload = useQuery(CURRENT_USER_QUERY);

	// TODO issue with this, chapter 26/27
	if (!payload.data) return null;

	return children(payload);
};

User.propTypes = {
	children: PropTypes.func.isRequired,
};

export default User;
export { CURRENT_USER_QUERY };
