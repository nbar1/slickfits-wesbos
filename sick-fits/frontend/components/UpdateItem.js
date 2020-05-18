import React, { useState } from 'react';
import { Query, Mutation } from 'react-apollo';
import Router from 'next/router';
import gql from 'graphql-tag';
import styled from 'styled-components';
import Form from './styles/Form';
import Error from './ErrorMessage';

const ImagePreview = styled.div`
	margin: 15px auto 0;
	text-align: center;
`;

const SINGLE_ITEM_QUERY = gql`
	query SINGLE_ITEM_QUERY($id: ID!) {
		item(where: { id: $id }) {
			id
			title
			description
			price
		}
	}
`;

const UPDATE_ITEM_MUTATION = gql`
	mutation UPDATE_ITEM_MUTATION($id: ID!, $title: String, $description: String, $price: Int) {
		updateItem(id: $id, title: $title, description: $description, price: $price) {
			id
		}
	}
`;

const UpdateItem = ({ id }) => {
	const [title, setTitle] = useState('');
	const [price, setPrice] = useState('');
	const [description, setDescription] = useState('');

	return (
		<Query query={SINGLE_ITEM_QUERY} variables={{ id: id }}>
			{({ data, loading }) => {
				if (loading) return <p>Loading...</p>;
				if (!data.item) return <p>No Item Found</p>;

				return (
					<Mutation
						mutation={UPDATE_ITEM_MUTATION}
						variables={{
							title: data.item.title,
							price: data.item.price,
							description: data.item.description,
						}}
					>
						{(updateItem, { loading, error }) => (
							<Form
								onSubmit={async e => {
									e.preventDefault();
									const response = await updateItem({
										variables: {
											id,
											title: title ? title : data.item.title,
											price: price ? price : data.item.price,
											description: description ? description : data.item.description,
										},
									});
								}}
							>
								<Error errpr={error} />
								<fieldset disabled={loading} aria-busy={loading}>
									<label htmlFor="title">
										Title
										<input
											type="text"
											id="title"
											name="title"
											placeholder="Title"
											required
											defaultValue={data.item.title}
											onChange={e => setTitle(e.target.value)}
										/>
									</label>

									<label htmlFor="price">
										Price
										<input
											type="number"
											id="price"
											name="price"
											placeholder="Price"
											required
											defaultValue={data.item.price}
											onChange={e => setPrice(parseFloat(e.target.value))}
										/>
									</label>

									<label htmlFor="description">
										Description
										<textarea
											id="description"
											name="description"
											placeholder="Enter A Description"
											required
											defaultValue={data.item.description}
											onChange={e => setDescription(e.target.value)}
										/>
									</label>
									<button type="submit">Sav{loading ? 'ing' : 'e'} Changes</button>
								</fieldset>
							</Form>
						)}
					</Mutation>
				);
			}}
		</Query>
	);
};

UpdateItem.propTypes = {};

export default UpdateItem;
export { UPDATE_ITEM_MUTATION };
