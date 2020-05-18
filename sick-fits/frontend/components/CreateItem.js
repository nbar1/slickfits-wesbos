import React, { useState } from 'react';
import { Mutation } from 'react-apollo';
import Router from 'next/router';
import gql from 'graphql-tag';
import styled from 'styled-components';
import Form from './styles/Form';
import Error from './ErrorMessage';

const ImagePreview = styled.div`
	margin: 15px auto 0;
	text-align: center;
`;

const CREATE_ITEM_MUTATION = gql`
	mutation CREATE_ITEM_MUTATION(
		$title: String!
		$description: String!
		$price: Int!
		$image: String
		$largeImage: String
	) {
		createItem(title: $title, description: $description, price: $price, image: $image, largeImage: $largeImage) {
			id
		}
	}
`;

const CreateItem = () => {
	const [title, setTitle] = useState('');
	const [price, setPrice] = useState('');
	const [description, setDescription] = useState('');
	const [image, setImage] = useState(null);
	const [largeImage, setLargeImage] = useState(null);

	const uploadFile = async e => {
		const files = e.target.files;

		if (!files[0]) return;

		const data = new FormData();
		data.append('file', files[0]);
		data.append('upload_preset', 'sickfits');

		const response = await fetch('https://api.cloudinary.com/v1_1/syniba/image/upload', {
			method: 'POST',
			body: data,
		});

		const file = await response.json();

		setImage(file.secure_url);
		setLargeImage(file.eager[0].secure_url);
	};

	return (
		<Mutation mutation={CREATE_ITEM_MUTATION} variables={{ title, price, description, image, largeImage }}>
			{(createItem, { loading, error }) => (
				<Form
					onSubmit={async e => {
						e.preventDefault();
						const response = await createItem();

						// go to item page
						Router.push({ pathname: '/item', query: { id: response.data.createItem.id } });
					}}
				>
					<Error errpr={error} />
					<fieldset disabled={loading} aria-busy={loading}>
						{image && (
							<ImagePreview>
								<img src={image} alt="Upload Preview" />
							</ImagePreview>
						)}

						<label htmlFor="file">
							Image
							<input
								type="file"
								id="file"
								name="file"
								placeholder="Upload An Image"
								required
								onChange={e => uploadFile(e)}
							/>
						</label>

						<label htmlFor="title">
							Title
							<input
								type="text"
								id="title"
								name="title"
								placeholder="Title"
								required
								value={title}
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
								value={price}
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
								value={description}
								onChange={e => setDescription(e.target.value)}
							/>
						</label>
						<button type="submit">Submit</button>
					</fieldset>
				</Form>
			)}
		</Mutation>
	);
};

CreateItem.propTypes = {};

export default CreateItem;
export { CREATE_ITEM_MUTATION };
