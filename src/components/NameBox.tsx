import { NameContainer } from './NameContainer';
import '../assets/css/name_box.css';

function NameBox({ data, key, handleEnable, background = null, isLast = false }) {

	return (
		<div
			className='userBox'
			style={{ background: background !== null ? background : '#FFFFFF' }}
			key={key}
		>
			<img src={data?.avatar_url} alt='foto de perfil'/>
			<NameContainer data={data} />
			<svg
				width="15"
				height="25"
				viewBox="0 0 15 25"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
				className='arrowImg'
				onClick={() => handleEnable(data, isLast)}
			>
				<path d="M2.7501 25L0.600098 22.85L10.5001 12.95L0.600098 
				3.04999L2.7501 0.899994L14.8001 12.95L2.7501 25Z" fill="black"/>
			</svg>
		</div >
	);
}

export { NameBox };