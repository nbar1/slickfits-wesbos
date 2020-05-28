import React, { useState } from 'react';
import gql from 'graphql-tag';
import Form from './styles/Form';
import Error from './ErrorMessage';
import { CURRENT_USER_QUERY } from './User';

import { useMutation } from '@apollo/react-hooks';

const RESET_MUTATION = gql`
	mutation RESET_MUTATION($resetToken: String!, $password: String!, $confirmPassword: String!) {
		resetPassword(resetToken: $resetToken, password: $password, confirmPassword: $confirmPassword) {
			id
			email
			name
		}
	}
`;

const Reset = ({ resetToken }) => {
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');

	const [reset, { error, loading }] = useMutation(RESET_MUTATION, {
		variables: { resetToken, password, confirmPassword },
		refetchQueries: [{ query: CURRENT_USER_QUERY }],
	});

	return (
		<Form
			method="post"
			onSubmit={async e => {
				e.preventDefault();
				await reset();
				setPassword('');
				setConfirmPassword('');
			}}
		>
			<fieldset disabled={loading} aria-busy={loading}>
				<h2>Reset Your Password</h2>
				<Error error={error} />
				<label htmlFor="password">
					Password
					<input
						type="password"
						name="password"
						placeholder="Password"
						value={password}
						onChange={e => setPassword(e.target.value)}
					/>
				</label>
				<label htmlFor="confirmPassword">
					Confirm Password
					<input
						type="password"
						name="confirmPassword"
						placeholder="confirmPassword"
						value={confirmPassword}
						onChange={e => setConfirmPassword(e.target.value)}
					/>
				</label>
				<button type="submit">Reset Your Password</button>
			</fieldset>
		</Form>
	);
};

export default Reset;
