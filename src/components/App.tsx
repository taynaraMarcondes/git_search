import gitColors from '../github-lang-colors.json';
import octokit from '../api';
import { NameContainer } from '../components/NameContainer';
import { NameBox } from './NameBox';
import { useState } from 'react';
import { useQuery } from 'react-query';
import '../assets/css/app.css';
import '../assets/css/content_container.css';
import '../assets/css/sidebar.css';

export function App() {
	const [searchName, setSearchName] = useState('');
	const [devFound, setDevFound] = useState<string[]>([]);
	const [enableView, setEnableView] = useState(false);
	const [userSelected, setUserSelected] = useState<devInfo | null>(null);
	const [last5Devs, setLast5Devs] = useState<devInfo[]>([]);
	const { data: devData } = useQuery(
		['devData', devFound],
		() => getDevData()
	);
	const { data: repoData } = useQuery(
		['devData', userSelected],
		() => getReposInfo()
	);

	type devInfo = {
		created_at: string;
		followers: number;
		following: number;
		public_repos: number;
		bio: string | null;
		avatar_url: string;
		login: string;
		name: string | null;
		html_url: string;
	};
	type devRepo = {
		name: string;
		description: string;
		language: string;
		updated_at: string;
		created_at: string;
		html_url: string;
	};

	async function handleSearch(e) {
		e?.preventDefault();
		try {
			if (searchName !== '') {
				const { items } = (
					await octokit.request('GET /search/users{?q,per_page,page}', {
						q: searchName,
						per_page: 10,
					})
				).data;

				const login: string[] = [];
				items.map(e => login.push(e?.login));

				setDevFound(login);
				setEnableView(false);
			}
		} catch (error) { }
	}

	async function getDevData() {
		try {
			const data: devInfo[] = [];
			await Promise.all(
				devFound.map(async e =>
					data.push((
						await octokit.request('GET /users/{username}', {
							username: e,
						}
						)).data)
				));

			return data;
		} catch (error) {
			throw new Error(error);
		}
	}

	async function getReposInfo() {
		try {
			if (userSelected !== null && enableView) {
				const { data } = await octokit.request('GET /users/{username}/repos', {
					username: userSelected?.login,
				});

				return data as devRepo[];
			}
		} catch (error) {
			throw new Error(error);
		}
	}

	function handleEnable(devSelected: devInfo, isLast: boolean) {
		let data;
		if (isLast) {
			data = last5Devs?.find(e => e?.login === devSelected?.login);
		} else {
			data = devData?.find(e => e?.login === devSelected?.login);
		}

		setUserSelected(data);
		setEnableView(true);
		putLastDevs(devSelected);
	}

	function putLastDevs(devSelected: devInfo) {
		let devs = [...last5Devs];

		devs = [...devs.filter((e) => e !== devSelected)];
		devs.unshift(devSelected);
		if (devs?.length > 5) devs.pop();

		setLast5Devs(devs);
	}

	function getDate(oldDate: string) {
		const date = new Date(oldDate);
		const month = [
			'Jan', 'Fev', 'Mar', 'Abr', 'Maio', 'Jun',
			'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez',
		];
		return (date?.getDate() + ' ' + month[date?.getMonth()]
			+ ' ' + date?.getFullYear()
		);
	}

	return (
		<div className="App">
			<div className="sidebar">
				<h2>Encontrar Dev:</h2>
				<form
					onSubmit={e => handleSearch(e)}
					style={{ background: 'content-box' }}
				>
					<div className="formContainer">
						<svg
							style={{ background: 'content-box',
								width:"19",
								height:"19"
							}}
							viewBox="0 0 19 19"
							fill="none"
							xmlns="http://www.w3.org/2000/svg">
								<path d="M13.5792 11.9497H12.721L12.4168 11.6564C13.4814 10.418 
								14.1224 8.81018 14.1224 7.06118C14.1224 3.16124 10.9611 0 7.06118 
								0C3.16124 0 0 3.16124 0 7.06118C0 10.9611 3.16124 14.1224 7.06118 
								14.1224C8.81018 14.1224 10.418 13.4814 11.6564 12.4168L11.9497 
								12.721V13.5792L17.3814 19L19 17.3814L13.5792 11.9497ZM7.06118 
								11.9497C4.3562 11.9497 2.17267 9.76615 2.17267 7.06118C2.17267 
								4.3562 4.3562 2.17267 7.06118 2.17267C9.76615 2.17267 11.9497 
								4.3562 11.9497 7.06118C11.9497 9.76615 9.76615 11.9497 7.06118 
								11.9497Z" fill="#1C255C"/>
						</svg>
						<input
							className="inputText"
							type="text"
							name="name"
							placeholder="GitHub username..."
							defaultValue={searchName}
							onChange={e => setSearchName(e?.target?.value)}
						/>
						<input
							className="searchButton"
							type="submit"
							value="Buscar"
						/>
					</div>
				</form>
				<div className="userContainer">
					{devData && devData?.length > 0 ? (
						devData?.map((e, key) => (
							<NameBox data={e} key={key} handleEnable={handleEnable}></NameBox>
						))
					) : (
						<></>
					)}
				</div>
				{last5Devs?.length > 0 ? (
					<div
						className="last5DevsContainer"
						style={{ background: 'content-box' }}
					>
						<div className="line"></div>
						<h4>Recentes</h4>
						<div className="userContainer">
							{last5Devs.map((e, key) => (
								<NameBox
									data={e}
									key={key}
									handleEnable={handleEnable}
									background={'rgba(255, 255, 255, 0.6)'}
									isLast={true}
								></NameBox>
							))}
						</div>
					</div>
				) : (
					<></>
				)}
			</div>
			<div className="contentContainer">
				{enableView ? (
					<div>
						<div>
							<h2 style={{ marginTop: '38px' }}>
								Detalhes do Perfil
							</h2>
							<a
								href={userSelected?.html_url}
								style={{ textDecoration: 'none' }}
							>
								<div className="profileContainer">
									<img src={userSelected?.avatar_url} alt='foto de perfil'/>
									<div style={{
										marginLeft: '313px',
										marginTop: '50px',
										background: 'content-box',
									}}>
										<div
											style={{
												width: '400px',
												alignItems: 'baseline',
												display: 'flex',
												background: 'content-box',
											}}
										>
											<NameContainer data={userSelected} margin={'0px'} />
											<h4>
												{'Ingressou em ' + getDate(userSelected?.created_at)}
											</h4>
										</div>
										<div style={{ background: 'content-box' }}>
											<p className="bio">{userSelected?.bio}</p>
										</div>
										<div className="profileData">
											<div>
												<label>Repositórios</label>
												<span>{userSelected?.public_repos}</span>
											</div>
											<div>
												<label>Seguidores</label>
												<span>{userSelected?.followers}</span>
											</div>
											<div>
												<label>Seguindo</label>
												<span>{userSelected?.following}</span>
											</div>
										</div>
									</div>
								</div>
							</a>
						</div>
						<div>
							<h2 style={{ marginTop: '75px', }}>
								Repositórios
							</h2>
							<div
								style={{
									marginLeft: '76px',
									flexWrap: 'wrap',
									maxHeight: '500px',
									overflow: 'auto',
									display: 'flex',
								}}
							>
								{repoData && repoData?.length > 0 ? (
									repoData?.map((e, key) => (
										<a
											href={e?.html_url}
											key={key}
										>
											<div className="repoContainer">
												<h4>{e?.name}</h4>
												<p className="description">{e?.description}</p>
												<div style={{ marginTop: '11px' }}>
													<div
														className="langCircle"
														style={{
															backgroundColor: gitColors?.[`${e?.language}`],
														}}
													></div>
													<p
														style={{
															marginLeft: '10px',
															marginBottom: '0px',
															fontSize: '14px',
															lineHeight: '16px',
															color: 'rgba(28, 37, 92, 0.8)',
														}}
													>
														{e?.language}
													</p>
												</div>
												<p
													style={{
														marginBottom: '2px',
														marginTop: '11px',
													}}
												>
													{'Criado em ' + getDate(e?.created_at)}
												</p>
												<p
													style={{
														maxWidth: '150px',
														justifyContent: 'flex-start',
														display: 'flex',
													}}
												>
													{'Atualizado em ' + getDate(e?.updated_at)}
												</p>
											</div>
										</a>
									))
								) : (
									<></>
								)}
							</div>
						</div>
					</div>
				) : (
					<div className="homeWallpaper">
						<h1>PESQUISE UM PERFIL DO GITHUB</h1>
						<svg
							width="19"
							height="19"
							viewBox="0 0 19 19"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path d="M13.5792 11.9497H12.721L12.4168 11.6564C13.4814
							 10.418 14.1224 8.81018 14.1224 7.06118C14.1224 3.16124 
							 10.9611 0 7.06118 0C3.16124 0 0 3.16124 0 7.06118C0 10.9611 
							 3.16124 14.1224 7.06118 14.1224C8.81018 14.1224 10.418 
							 13.4814 11.6564 12.4168L11.9497 12.721V13.5792L17.3814 
							 19L19 17.3814L13.5792 11.9497ZM7.06118 11.9497C4.3562 
							 11.9497 2.17267 9.76615 2.17267 7.06118C2.17267 4.3562 
							 4.3562 2.17267 7.06118 2.17267C9.76615 2.17267 11.9497 
							 4.3562 11.9497 7.06118C11.9497 9.76615 9.76615 11.9497 
							 7.06118 11.9497Z" fill="#1C255C80"/>
						</svg>
					</div>
				)}
			</div>
		</div>
	);
}
