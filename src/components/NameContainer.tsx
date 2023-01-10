import '../assets/css/name_container.css';

function NameContainer({ data, margin = null }) {
	return (
		<div
			className='nameContainer'
			style={{ marginLeft: margin !== null ? margin : '17px' }
			}>
			<h3>{data?.name}</h3>
			<label>{'@' + data?.login}</label>
		</div>
	)
}
export { NameContainer };
