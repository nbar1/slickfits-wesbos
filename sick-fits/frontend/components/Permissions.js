import { useState } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/react-hooks';
import Error from './ErrorMessage';
import gql from 'graphql-tag';
import Table from './styles/Table';
import SickButton from './styles/SickButton';

const possiblePermissions = ['ADMIN', 'USER', 'ITEMCREATE', 'ITEMUPDATE', 'ITEMDELETE', 'PERMISSIONUPDATE'];

const ALL_USERS_QUERY = gql`
	query {
		users {
			id
			name
			email
			permissions
		}
	}
`;

const Permissions = () => {
	const { loading, error, data } = useQuery(ALL_USERS_QUERY);
	if (loading) return <p>Loading</p>;
	if (error) return <Error error={error} />;

	return (
		<div>
			<Error error={error} />
			<div>
				<h1>Manage Permissions</h1>
				<Table>
					<thead>
						<tr>
							<th>Name</th>
							<th>Email</th>
							{possiblePermissions.map(permission => (
								<th key={permission}>{permission}</th>
							))}
							<th>👇</th>
						</tr>
					</thead>
					<tbody>
						{data.users.map(user => (
							<UserPermissions user={user} key={user.id} />
						))}
					</tbody>
				</Table>
			</div>
		</div>
	);
};

const UserPermissions = ({ user }) => {
	const [permissions, setPermissions] = useState(user.permissions);

	const handlePermissionChange = e => {
		const checkbox = e.target;
		let updatedPermissions = [...permissions];

		if (checkbox.checked) {
			updatedPermissions.push(checkbox.value);
		} else {
			updatedPermissions = updatedPermissions.filter(permission => permission !== checkbox.value);
		}

		setPermissions(updatedPermissions);
	};

	return (
		<tr>
			<td>{user.name}</td>
			<td>{user.email}</td>
			{possiblePermissions.map(permission => (
				<td key={permission}>
					<label htmlFor={`${user.id}-permission-${permission}`}>
						<input
							type="checkbox"
							checked={permissions.includes(permission)}
							value={permission}
							onChange={handlePermissionChange}
						/>
					</label>
				</td>
			))}
			<td>
				<SickButton>Update</SickButton>
			</td>
		</tr>
	);
};

UserPermissions.propTypes = {
	user: PropTypes.shape({
		name: PropTypes.string,
		email: PropTypes.string,
		id: PropTypes.string,
		id: PropTypes.string,
		permissions: PropTypes.array,
	}).isRequired,
};

export default Permissions;
