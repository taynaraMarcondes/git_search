import { NameContainer } from './NameContainer';
import { arrow } from '../assets/images';
import '../assets/css/name_box.css';

function NameBox({ data, key, handleEnable, background = null, isLast = false }) {

	return (
		<div
			className='userBox'
			style={{ background: background !== null ? background : '#FFFFFF' }}
			key={key}
		>
			<img src={data?.avatar_url} />
			<NameContainer data={data} />
			<img
				className='arrowImg'
				src={arrow}
				alt='arrow'
				onClick={() => handleEnable(data, isLast)}
			/>
		</div >
	);
}

export { NameBox };