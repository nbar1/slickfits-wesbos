import React from 'react';
import PaginationStyles from './styles/PaginationStyles';
import gql from 'graphql-tag';
import Head from 'next/head';
import Link from 'next/link';
import { useQuery } from '@apollo/react-hooks';
import { perPage } from '../config';

const PAGINATION_QUERY = gql`
	query PAGINATION_QUERY {
		itemsConnection {
			aggregate {
				count
			}
		}
	}
`;

const Pagination = ({ page }) => {
	const { loading, error, data } = useQuery(PAGINATION_QUERY);

	if (loading) return <p>Loading...</p>;
	if (error) return <p>Error: {error.message}</p>;

	const count = data.itemsConnection.aggregate.count;
	const pages = Math.ceil(count / perPage);

	return (
		<PaginationStyles>
			<Head>
				<title>
					Sick Fits | Page {page} of {pages}
				</title>
			</Head>
			<Link
				href={{
					pathname: 'items',
					query: { page: page - 1 },
				}}
			>
				<a className="prev" aria-disabled={page <= 1}>
					Prev
				</a>
			</Link>
			<p>
				Page {page} of {pages}
			</p>
			<p>{count} Items Total</p>

			<Link
				href={{
					pathname: 'items',
					query: { page: page + 1 },
				}}
			>
				<a className="next" aria-disabled={page >= pages}>
					Next
				</a>
			</Link>
		</PaginationStyles>
	);
};

export default Pagination;
