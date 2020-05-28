import React, { useState } from 'react';
import gql from 'graphql-tag';
import Form from './styles/Form';
import Error from './ErrorMessage';

import { useMutation } from '@apollo/react-hooks';

const REQUEST_RESET_MUTATION = gql`
	mutation REQUEST_RESET_MUTATION($email: String!) {
		requestReset(email: $email) {
			message
		}
	}
`;

const RequestReset = () => {
	const [email, setEmail] = useState('');

	const [reset, { error, loading, called }] = useMutation(REQUEST_RESET_MUTATION, {
		variables: { email },
	});

	return (
		<Form
			method="post"
			onSubmit={async e => {
				e.preventDefault();
				await reset();
				setEmail('');
			}}
		>
			<fieldset disabled={loading} aria-busy={loading}>
				<h2>Request A Password Reset</h2>
				<Error error={error} />
				{!error && !loading && called && <p>Success! Check your email for a reset link.</p>}
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
				<button type="submit">Request Reset</button>
			</fieldset>
		</Form>
	);
};

export default RequestReset;
