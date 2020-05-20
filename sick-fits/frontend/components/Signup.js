import React, { useState } from 'react';
import gql from 'graphql-tag';
import Form from './styles/Form';
import Error from './ErrorMessage';

import { useMutation } from '@apollo/react-hooks';

const SIGNUP_MUTATION = gql`
	mutation SIGNUP_MUTATION($email: String!, $name: String!, $password: String!) {
		signup(email: $email, name: $name, password: $password) {
			id
			email
			name
		}
	}
`;

const Signup = () => {
	const [email, setEmail] = useState('');
	const [name, setName] = useState('');
	const [password, setPassword] = useState('');

	const [signup, { error, loading }] = useMutation(SIGNUP_MUTATION, { variables: { email, name, password } });

	return (
		<Form
			method="post"
			onSubmit={async e => {
				e.preventDefault();
				await signup();
				setEmail('');
				setName('');
				setPassword('');
			}}
		>
			<fieldset disabled={loading} aria-busy={loading}>
				<h2>Sign up for an account</h2>
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
				<label htmlFor="name"></label>
				Name
				<input
					type="text"
					name="name"
					placeholder="Name"
					value={name}
					onChange={e => setName(e.target.value)}
				/>
				<label htmlFor="password">
					Password
					<input
						type="password"
						name="oassword"
						placeholder="Password"
						value={password}
						onChange={e => setPassword(e.target.value)}
					/>
				</label>
				<button type="submit">Sign Up</button>
			</fieldset>
		</Form>
	);
};

export default Signup;
