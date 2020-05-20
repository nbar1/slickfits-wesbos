import React, { useState } from 'react';
import gql from 'graphql-tag';
import Form from './styles/Form';
import Error from './ErrorMessage';

import { useMutation } from '@apollo/react-hooks';
import { CURRENT_USER_QUERY } from './User';

const SIGNIN_MUTATION = gql`
	mutation SIGNIN_MUTATION($email: String!, $password: String!) {
		signin(email: $email, password: $password) {
			id
			email
			name
		}
	}
`;

const Signin = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const [signin, { error, loading }] = useMutation(SIGNIN_MUTATION, {
		variables: { email, password },
		refetchQueries: [{ query: CURRENT_USER_QUERY }],
	});

	return (
		<Form
			method="post"
			onSubmit={async e => {
				e.preventDefault();
				await signin();
				setEmail('');
				setPassword('');
			}}
		>
			<fieldset disabled={loading} aria-busy={loading}>
				<h2>Sign into your account</h2>
				<Error error={error} />
				<label htmlFor="email">
					Email
					<input
						type="email"
						name="email"
						placeholder="Email"
						value={email}
						onChange={e => setEmail(e.target.value)}
					/>
				</label>
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
				<button type="submit">Sign In</button>
			</fieldset>
		</Form>
	);
};

export default Signin;
