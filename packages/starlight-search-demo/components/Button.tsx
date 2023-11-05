import styles from './button.module.css';

export function Button() {
	function handleSearch(event: SubmitEvent) {
		event.preventDefault();
		window.alert('Not implemented, this is just a demo!');
	}

	return (
		<button className={styles.button} onClick={handleSearch}>
			Search (Preact button)
		</button>
	);
}
