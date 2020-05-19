import React from 'react';
import styled from 'styled-components';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import Error from './ErrorMessage';
import Head from 'next/head';

const SINGLE_ITEM_QUERY = gql`
	query SINGLE_ITEM_QUERY($id: ID!) {
		item(where: { id: $id }) {
			id
			title
			description
			largeImage
		}
	}
`;

const SingleItemStyles = styled.div`
	max-width: 1200px;
	margin: 2rem auto;
	box-shadow: ${props => props.theme.bs};
	display: grid;
	grid-auto-columns: 1fr;
	grid-auto-flow: column;
	min-height: 800px;

	img {
		width: 100%;
		height: 100%;
		object-fit: contain;
	}

	.details {
		margin: 3rem;
		font-size: 2rem;
	}
`;

const SingleItem = ({ id }) => {
	const { loading, error, data } = useQuery(SINGLE_ITEM_QUERY, {
		variables: { id: id },
	});

	if (error) return <Error error={error} />;
	if (loading) return <p>Loading!</p>;
	if (!data.item) return <p>No Item Found For {id}</p>;

	const item = data.item;

	return (
		<SingleItemStyles>
			<Head>
				<title>Sick Fits | {item.title}</title>
			</Head>
			<img src={item.largeImage} alt={item.title} />
			<div className="details">
				<h2>Viewing {item.title}</h2>
				<p>{item.description}</p>
			</div>
		</SingleItemStyles>
	);
};

export default SingleItem;
