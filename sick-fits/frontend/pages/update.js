import UpdateItem from '../components/UpdateItem';
import Router from 'next/router';

const Update = ({ query }) => {
	return (
		<div>
			<UpdateItem id={query.id} />
		</div>
	);
};

export default Update;
