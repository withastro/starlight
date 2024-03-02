import { FileIcons } from '../user-components/file-tree-icons';

export const BuiltInIcons = {
	'up-caret':
		'<path d="m17 13.41-4.29-4.24a.999.999 0 0 0-1.42 0l-4.24 4.24a1 1 0 1 0 1.41 1.42L12 11.29l3.54 3.54a1 1 0 0 0 1.41 0 1 1 0 0 0 .05-1.42Z"/>',
	'down-caret':
		'<path d="M17 9.17a1 1 0 0 0-1.41 0L12 12.71 8.46 9.17a1 1 0 1 0-1.41 1.42l4.24 4.24a1.002 1.002 0 0 0 1.42 0L17 10.59a1.002 1.002 0 0 0 0-1.42Z"/>',
	'right-caret':
		'<path d="m14.83 11.29-4.24-4.24a1 1 0 1 0-1.42 1.41L12.71 12l-3.54 3.54a1 1 0 0 0 0 1.41 1 1 0 0 0 .71.29 1 1 0 0 0 .71-.29l4.24-4.24a1.002 1.002 0 0 0 0-1.42Z"/>',
	'right-arrow':
		'<path d="M17.92 11.62a1.001 1.001 0 0 0-.21-.33l-5-5a1.003 1.003 0 1 0-1.42 1.42l3.3 3.29H7a1 1 0 0 0 0 2h7.59l-3.3 3.29a1.002 1.002 0 0 0 .325 1.639 1 1 0 0 0 1.095-.219l5-5a1 1 0 0 0 .21-.33 1 1 0 0 0 0-.76Z"/>',
	'left-arrow':
		'<path d="M17 11H9.41l3.3-3.29a1.004 1.004 0 1 0-1.42-1.42l-5 5a1 1 0 0 0-.21.33 1 1 0 0 0 0 .76 1 1 0 0 0 .21.33l5 5a1.002 1.002 0 0 0 1.639-.325 1 1 0 0 0-.219-1.095L9.41 13H17a1 1 0 0 0 0-2Z"/>',
	bars: '<path d="M3 8h18a1 1 0 1 0 0-2H3a1 1 0 0 0 0 2Zm18 8H3a1 1 0 0 0 0 2h18a1 1 0 0 0 0-2Zm0-5H3a1 1 0 0 0 0 2h18a1 1 0 0 0 0-2Z"/>',
	translate:
		'<path fill-rule="evenodd" d="M8.516 3a.94.94 0 0 0-.941.94v1.15H2.94a.94.94 0 1 0 0 1.882h7.362a7.422 7.422 0 0 1-1.787 3.958 7.42 7.42 0 0 1-1.422-2.425.94.94 0 1 0-1.774.627 9.303 9.303 0 0 0 1.785 3.043 7.422 7.422 0 0 1-4.164 1.278.94.94 0 1 0 0 1.881 9.303 9.303 0 0 0 5.575-1.855 9.303 9.303 0 0 0 4.11 1.74l-.763 1.525a.968.968 0 0 0-.016.034l-1.385 2.77a.94.94 0 1 0 1.683.841l1.133-2.267h5.806l1.134 2.267a.94.94 0 0 0 1.683-.841l-1.385-2.769a.95.95 0 0 0-.018-.036l-3.476-6.951a.94.94 0 0 0-1.682 0l-1.82 3.639a7.423 7.423 0 0 1-3.593-1.256 9.303 9.303 0 0 0 2.27-5.203h1.894a.94.94 0 0 0 0-1.881H9.456V3.94A.94.94 0 0 0 8.516 3Zm6.426 11.794a1.068 1.068 0 0 1-.02.039l-.703 1.407h3.924l-1.962-3.924-1.24 2.478Z" clip-rule="evenodd"/>',
	pencil:
		'<path d="M22 7.24a1 1 0 0 0-.29-.71l-4.24-4.24a1 1 0 0 0-1.1-.22 1 1 0 0 0-.32.22l-2.83 2.83L2.29 16.05a1 1 0 0 0-.29.71V21a1 1 0 0 0 1 1h4.24a1 1 0 0 0 .76-.29l10.87-10.93L21.71 8c.1-.1.17-.2.22-.33a1 1 0 0 0 0-.24v-.14l.07-.05ZM6.83 20H4v-2.83l9.93-9.93 2.83 2.83L6.83 20ZM18.17 8.66l-2.83-2.83 1.42-1.41 2.82 2.82-1.41 1.42Z"/>',
	pen: '<path d="M21 12a1 1 0 0 0-1 1v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h6a1 1 0 1 0 0-2H5a3 3 0 0 0-3 3v14a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3v-6a1 1 0 0 0-1-1Zm-15 .76V17a1 1 0 0 0 1 1h4.24a1 1 0 0 0 .71-.29l6.92-6.93L21.71 8a1 1 0 0 0 0-1.42l-4.24-4.29a1 1 0 0 0-1.42 0l-2.82 2.83-6.94 6.93a1 1 0 0 0-.29.71Zm10.76-8.35 2.83 2.83-1.42 1.42-2.83-2.83 1.42-1.42ZM8 13.17l5.93-5.93 2.83 2.83L10.83 16H8v-2.83Z"/>',
	document:
		'<path d="M9 10h1a1 1 0 1 0 0-2H9a1 1 0 0 0 0 2Zm0 2a1 1 0 0 0 0 2h6a1 1 0 0 0 0-2H9Zm11-3.06a1.3 1.3 0 0 0-.06-.27v-.09c-.05-.1-.11-.2-.19-.28l-6-6a1.07 1.07 0 0 0-.28-.19h-.09a.88.88 0 0 0-.33-.11H7a3 3 0 0 0-3 3v14a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V8.94Zm-6-3.53L16.59 8H15a1 1 0 0 1-1-1V5.41ZM18 19a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h5v3a3 3 0 0 0 3 3h3v9Zm-3-3H9a1 1 0 0 0 0 2h6a1 1 0 0 0 0-2Z"/>',
	'add-document':
		'<path d="M20 8.94a1.3 1.3 0 0 0-.06-.27v-.09c-.05-.1-.11-.2-.19-.28l-6-6a1.07 1.07 0 0 0-.28-.19h-.09a.88.88 0 0 0-.33-.11H7a3 3 0 0 0-3 3v14a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V8.94Zm-6-3.53L16.59 8H15a1 1 0 0 1-1-1V5.41ZM18 19a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h5v3a3 3 0 0 0 3 3h3v9Zm-4-5h-1v-1a1 1 0 0 0-2 0v1h-1a1 1 0 0 0 0 2h1v1a1 1 0 0 0 2 0v-1h1a1 1 0 0 0 0-2Z"/>',
	setting:
		'<path d="m21.32 9.55-1.89-.63.89-1.78A1 1 0 0 0 20.13 6L18 3.87a1 1 0 0 0-1.15-.19l-1.78.89-.63-1.89A1 1 0 0 0 13.5 2h-3a1 1 0 0 0-.95.68l-.63 1.89-1.78-.89A1 1 0 0 0 6 3.87L3.87 6a1 1 0 0 0-.19 1.15l.89 1.78-1.89.63a1 1 0 0 0-.68.94v3a1 1 0 0 0 .68.95l1.89.63-.89 1.78A1 1 0 0 0 3.87 18L6 20.13a1 1 0 0 0 1.15.19l1.78-.89.63 1.89a1 1 0 0 0 .95.68h3a1 1 0 0 0 .95-.68l.63-1.89 1.78.89a1 1 0 0 0 1.13-.19L20.13 18a1 1 0 0 0 .19-1.15l-.89-1.78 1.89-.63a1 1 0 0 0 .68-.94v-3a1 1 0 0 0-.68-.95ZM20 12.78l-1.2.4A2 2 0 0 0 17.64 16l.57 1.14-1.1 1.1-1.11-.6a2 2 0 0 0-2.79 1.16l-.4 1.2h-1.59l-.4-1.2A2 2 0 0 0 8 17.64l-1.14.57-1.1-1.1.6-1.11a2 2 0 0 0-1.16-2.82l-1.2-.4v-1.56l1.2-.4A2 2 0 0 0 6.36 8l-.57-1.11 1.1-1.1L8 6.36a2 2 0 0 0 2.82-1.16l.4-1.2h1.56l.4 1.2A2 2 0 0 0 16 6.36l1.14-.57 1.1 1.1-.6 1.11a2 2 0 0 0 1.16 2.79l1.2.4v1.59ZM12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm0 6a2 2 0 1 1 0-4 2 2 0 0 1 0 4Z"/>',
	external:
		'<path d="M19.33 10.18a1 1 0 0 1-.77 0 1 1 0 0 1-.62-.93l.01-1.83-8.2 8.2a1 1 0 0 1-1.41-1.42l8.2-8.2H14.7a1 1 0 0 1 0-2h4.25a1 1 0 0 1 1 1v4.25a1 1 0 0 1-.62.93Z"/><path d="M11 4a1 1 0 1 1 0 2H7a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-4a1 1 0 1 1 2 0v4a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3h4Z"/>',
	moon: '<path d="M21.64 13a1 1 0 0 0-1.05-.14 8.049 8.049 0 0 1-3.37.73 8.15 8.15 0 0 1-8.14-8.1 8.59 8.59 0 0 1 .25-2A1 1 0 0 0 8 2.36a10.14 10.14 0 1 0 14 11.69 1 1 0 0 0-.36-1.05Zm-9.5 6.69A8.14 8.14 0 0 1 7.08 5.22v.27a10.15 10.15 0 0 0 10.14 10.14 9.784 9.784 0 0 0 2.1-.22 8.11 8.11 0 0 1-7.18 4.32v-.04Z"/>',
	sun: '<path d="M5 12a1 1 0 0 0-1-1H3a1 1 0 0 0 0 2h1a1 1 0 0 0 1-1Zm.64 5-.71.71a1 1 0 0 0 0 1.41 1 1 0 0 0 1.41 0l.71-.71A1 1 0 0 0 5.64 17ZM12 5a1 1 0 0 0 1-1V3a1 1 0 0 0-2 0v1a1 1 0 0 0 1 1Zm5.66 2.34a1 1 0 0 0 .7-.29l.71-.71a1 1 0 1 0-1.41-1.41l-.66.71a1 1 0 0 0 0 1.41 1 1 0 0 0 .66.29Zm-12-.29a1 1 0 0 0 1.41 0 1 1 0 0 0 0-1.41l-.71-.71a1.004 1.004 0 1 0-1.43 1.41l.73.71ZM21 11h-1a1 1 0 0 0 0 2h1a1 1 0 0 0 0-2Zm-2.64 6A1 1 0 0 0 17 18.36l.71.71a1 1 0 0 0 1.41 0 1 1 0 0 0 0-1.41l-.76-.66ZM12 6.5a5.5 5.5 0 1 0 5.5 5.5A5.51 5.51 0 0 0 12 6.5Zm0 9a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7Zm0 3.5a1 1 0 0 0-1 1v1a1 1 0 0 0 2 0v-1a1 1 0 0 0-1-1Z"/>',
	laptop:
		'<path d="M21 14h-1V7a3 3 0 0 0-3-3H7a3 3 0 0 0-3 3v7H3a1 1 0 0 0-1 1v2a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3v-2a1 1 0 0 0-1-1ZM6 7a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v7H6V7Zm14 10a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-1h16v1Z"/>',
	'open-book':
		'<path d="M21.17 2.06A13.1 13.1 0 0 0 19 1.87a12.94 12.94 0 0 0-7 2.05 12.94 12.94 0 0 0-7-2 13.1 13.1 0 0 0-2.17.19 1 1 0 0 0-.83 1v12a1 1 0 0 0 1.17 1 10.9 10.9 0 0 1 8.25 1.91l.12.07h.11a.91.91 0 0 0 .7 0h.11l.12-.07A10.899 10.899 0 0 1 20.83 16 1 1 0 0 0 22 15V3a1 1 0 0 0-.83-.94ZM11 15.35a12.87 12.87 0 0 0-6-1.48H4v-10c.333-.02.667-.02 1 0a10.86 10.86 0 0 1 6 1.8v9.68Zm9-1.44h-1a12.87 12.87 0 0 0-6 1.48V5.67a10.86 10.86 0 0 1 6-1.8c.333-.02.667-.02 1 0v10.04Zm1.17 4.15a13.098 13.098 0 0 0-2.17-.19 12.94 12.94 0 0 0-7 2.05 12.94 12.94 0 0 0-7-2.05c-.727.003-1.453.066-2.17.19A1 1 0 0 0 2 19.21a1 1 0 0 0 1.17.79 10.9 10.9 0 0 1 8.25 1.91 1 1 0 0 0 1.16 0A10.9 10.9 0 0 1 20.83 20a1 1 0 0 0 1.17-.79 1 1 0 0 0-.83-1.15Z"/>',
	information:
		'<path d="M12 11a1 1 0 0 0-1 1v4a1 1 0 0 0 2 0v-4a1 1 0 0 0-1-1Zm.38-3.92a1 1 0 0 0-.76 0 1 1 0 0 0-.33.21 1.15 1.15 0 0 0-.21.33 1 1 0 0 0 .21 1.09c.097.088.209.16.33.21A1 1 0 0 0 13 8a1.05 1.05 0 0 0-.29-.71 1 1 0 0 0-.33-.21ZM12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm0 18a8 8 0 1 1 0-16.001A8 8 0 0 1 12 20Z"/>',
	magnifier:
		'<path d="M21.71 20.29 18 16.61A9 9 0 1 0 16.61 18l3.68 3.68a.999.999 0 0 0 1.42 0 1 1 0 0 0 0-1.39ZM11 18a7 7 0 1 1 0-14 7 7 0 0 1 0 14Z"/>',
	'forward-slash':
		'<path d="M17 2H7a5 5 0 0 0-5 5v10a5 5 0 0 0 5 5h10a5 5 0 0 0 5-5V7a5 5 0 0 0-5-5Zm3 15a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v10Z"/><path d="M15.293 6.707a1 1 0 1 1 1.414 1.414l-8.485 8.486a1 1 0 0 1-1.414-1.415l8.485-8.485Z"/>',
	close:
		'<path d="m13.41 12 6.3-6.29a1.004 1.004 0 1 0-1.42-1.42L12 10.59l-6.29-6.3a1.004 1.004 0 0 0-1.42 1.42l6.3 6.29-6.3 6.29a1 1 0 0 0 0 1.42.998.998 0 0 0 1.42 0l6.29-6.3 6.29 6.3a.999.999 0 0 0 1.42 0 1 1 0 0 0 0-1.42L13.41 12Z"/>',
	error:
		'<path d="M12 7a1 1 0 0 0-1 1v4a1 1 0 0 0 2 0V8a1 1 0 0 0-1-1Zm0 8a1 1 0 1 0 0 2 1 1 0 0 0 0-2Zm9.71-7.44-5.27-5.27a1.05 1.05 0 0 0-.71-.29H8.27a1.05 1.05 0 0 0-.71.29L2.29 7.56a1.05 1.05 0 0 0-.29.71v7.46c.004.265.107.518.29.71l5.27 5.27c.192.183.445.286.71.29h7.46a1.05 1.05 0 0 0 .71-.29l5.27-5.27a1.05 1.05 0 0 0 .29-.71V8.27a1.05 1.05 0 0 0-.29-.71ZM20 15.31 15.31 20H8.69L4 15.31V8.69L8.69 4h6.62L20 8.69v6.62Z"/>',
	warning:
		'<path d="M12 16a1 1 0 1 0 0 2 1 1 0 0 0 0-2Zm10.67 1.47-8.05-14a3 3 0 0 0-5.24 0l-8 14A3 3 0 0 0 3.94 22h16.12a3 3 0 0 0 2.61-4.53Zm-1.73 2a1 1 0 0 1-.88.51H3.94a1 1 0 0 1-.88-.51 1 1 0 0 1 0-1l8-14a1 1 0 0 1 1.78 0l8.05 14a1 1 0 0 1 .05 1.02v-.02ZM12 8a1 1 0 0 0-1 1v4a1 1 0 0 0 2 0V9a1 1 0 0 0-1-1Z"/>',
	'approve-check-circle':
		'<path d="m14.72 8.79-4.29 4.3-1.65-1.65a1 1 0 1 0-1.41 1.41l2.35 2.36a1 1 0 0 0 1.41 0l5-5a1.002 1.002 0 1 0-1.41-1.42ZM12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm0 18a8 8 0 1 1 0-16.001A8 8 0 0 1 12 20Z"/>',
	'approve-check':
		'<path d="M18.71 7.21a1 1 0 0 0-1.42 0l-7.45 7.46-3.13-3.14A1.02 1.02 0 1 0 5.29 13l3.84 3.84a1.001 1.001 0 0 0 1.42 0l8.16-8.16a1 1 0 0 0 0-1.47Z"/>',
	rocket:
		'<path fill-rule="evenodd" d="M1.44 8.855v-.001l3.527-3.516c.34-.344.802-.541 1.285-.548h6.649l.947-.947c3.07-3.07 6.207-3.072 7.62-2.868a1.821 1.821 0 0 1 1.557 1.557c.204 1.413.203 4.55-2.868 7.62l-.946.946v6.649a1.845 1.845 0 0 1-.549 1.286l-3.516 3.528a1.844 1.844 0 0 1-3.11-.944l-.858-4.275-4.52-4.52-2.31-.463-1.964-.394A1.847 1.847 0 0 1 .98 10.693a1.843 1.843 0 0 1 .46-1.838Zm5.379 2.017-3.873-.776L6.32 6.733h4.638l-4.14 4.14Zm8.403-5.655c2.459-2.46 4.856-2.463 5.89-2.33.134 1.035.13 3.432-2.329 5.891l-6.71 6.71-3.561-3.56 6.71-6.711Zm-1.318 15.837-.776-3.873 4.14-4.14v4.639l-3.364 3.374Z" clip-rule="evenodd"/><path d="M9.318 18.345a.972.972 0 0 0-1.86-.561c-.482 1.435-1.687 2.204-2.934 2.619a8.22 8.22 0 0 1-1.23.302c.062-.365.157-.79.303-1.229.415-1.247 1.184-2.452 2.62-2.935a.971.971 0 1 0-.62-1.842c-.12.04-.236.084-.35.13-2.02.828-3.012 2.588-3.493 4.033a10.383 10.383 0 0 0-.51 2.845l-.001.016v.063c0 .536.434.972.97.972H2.24a7.21 7.21 0 0 0 .878-.065c.527-.063 1.248-.19 2.02-.447 1.445-.48 3.205-1.472 4.033-3.494a5.828 5.828 0 0 0 .147-.407Z"/>',
	star: '<path d="M22 9.67a1 1 0 0 0-.86-.67l-5.69-.83L12.9 3a1 1 0 0 0-1.8 0L8.55 8.16 2.86 9a1 1 0 0 0-.81.68 1 1 0 0 0 .25 1l4.13 4-1 5.68a1 1 0 0 0 1.45 1.07L12 18.76l5.1 2.68c.14.08.3.12.46.12a1 1 0 0 0 .99-1.19l-1-5.68 4.13-4A1 1 0 0 0 22 9.67Zm-6.15 4a1 1 0 0 0-.29.89l.72 4.19-3.76-2a1 1 0 0 0-.94 0l-3.76 2 .72-4.19a1 1 0 0 0-.29-.89l-3-3 4.21-.61a1 1 0 0 0 .76-.55L12 5.7l1.88 3.82a1 1 0 0 0 .76.55l4.21.61-3 2.99Z"/>',
	puzzle:
		'<path d="M17 22H5a3 3 0 0 1-3-3V9a3 3 0 0 1 3-3h1a4 4 0 0 1 7.3-2.18c.448.64.692 1.4.7 2.18h3a1 1 0 0 1 1 1v3a4 4 0 0 1 2.18 7.3A3.86 3.86 0 0 1 18 18v3a1 1 0 0 1-1 1ZM5 8a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11v-3.18a1 1 0 0 1 1.33-.95 1.77 1.77 0 0 0 1.74-.23 2 2 0 0 0 .93-1.37 2 2 0 0 0-.48-1.59 1.89 1.89 0 0 0-2.17-.55 1 1 0 0 1-1.33-.95V8h-3.2a1 1 0 0 1-1-1.33 1.77 1.77 0 0 0-.23-1.74 1.939 1.939 0 0 0-3-.43A2 2 0 0 0 8 6c.002.23.046.456.13.67A1 1 0 0 1 7.18 8H5Z"/>',
	'list-format':
		'<path d="M3.71 16.29a1 1 0 0 0-.33-.21 1 1 0 0 0-.76 0 1 1 0 0 0-.33.21 1 1 0 0 0-.21.33 1 1 0 0 0 .21 1.09c.097.088.209.16.33.21a.94.94 0 0 0 .76 0 1.15 1.15 0 0 0 .33-.21 1 1 0 0 0 .21-1.09 1 1 0 0 0-.21-.33ZM7 8h14a1 1 0 1 0 0-2H7a1 1 0 0 0 0 2Zm-3.29 3.29a1 1 0 0 0-1.09-.21 1.15 1.15 0 0 0-.33.21 1 1 0 0 0-.21.33.94.94 0 0 0 0 .76c.05.121.122.233.21.33.097.088.209.16.33.21a.94.94 0 0 0 .76 0 1.15 1.15 0 0 0 .33-.21 1.15 1.15 0 0 0 .21-.33.94.94 0 0 0 0-.76 1 1 0 0 0-.21-.33ZM21 11H7a1 1 0 0 0 0 2h14a1 1 0 0 0 0-2ZM3.71 6.29a1 1 0 0 0-.33-.21 1 1 0 0 0-1.09.21 1.15 1.15 0 0 0-.21.33.94.94 0 0 0 0 .76c.05.121.122.233.21.33.097.088.209.16.33.21a1 1 0 0 0 1.09-.21 1.15 1.15 0 0 0 .21-.33.94.94 0 0 0 0-.76 1.15 1.15 0 0 0-.21-.33ZM21 16H7a1 1 0 0 0 0 2h14a1 1 0 0 0 0-2Z"/>',
	random:
		'<path d="M8.7 10a1 1 0 0 0 1.41 0 1 1 0 0 0 0-1.41l-6.27-6.3a1 1 0 0 0-1.42 1.42ZM21 14a1 1 0 0 0-1 1v3.59L15.44 14A1 1 0 0 0 14 15.44L18.59 20H15a1 1 0 0 0 0 2h6a1 1 0 0 0 .38-.08 1 1 0 0 0 .54-.54A1 1 0 0 0 22 21v-6a1 1 0 0 0-1-1Zm.92-11.38a1 1 0 0 0-.54-.54A1 1 0 0 0 21 2h-6a1 1 0 0 0 0 2h3.59L2.29 20.29a1 1 0 0 0 0 1.42 1 1 0 0 0 1.42 0L20 5.41V9a1 1 0 0 0 2 0V3a1 1 0 0 0-.08-.38Z"/>',
	github:
		'<path d="M12 .3a12 12 0 0 0-3.8 23.38c.6.12.83-.26.83-.57L9 21.07c-3.34.72-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.08-.74.09-.73.09-.73 1.2.09 1.83 1.24 1.83 1.24 1.08 1.83 2.81 1.3 3.5 1 .1-.78.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.14-.3-.54-1.52.1-3.18 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.28-1.55 3.29-1.23 3.29-1.23.64 1.66.24 2.88.12 3.18a4.65 4.65 0 0 1 1.23 3.22c0 4.61-2.8 5.63-5.48 5.92.42.36.81 1.1.81 2.22l-.01 3.29c0 .31.2.69.82.57A12 12 0 0 0 12 .3Z"/>',
	gitlab:
		'<path d="m22.63 9.8-.03-.09-3-7.81a.78.78 0 0 0-.76-.5.8.8 0 0 0-.46.18.8.8 0 0 0-.26.4L16.1 8.17H7.9l-2-6.19a.79.79 0 0 0-1.5-.08l-3 7.81-.02.08a5.56 5.56 0 0 0 1.84 6.43h.01l.03.02 4.56 3.42 2.26 1.7 1.37 1.05a.92.92 0 0 0 1.12 0l1.38-1.04 2.25-1.71 4.6-3.44a5.56 5.56 0 0 0 1.84-6.43Z"/>',
	bitbucket:
		'<path d="M1 1.5a.8.8 0 0 0-.7.9l3.2 19.3c0 .5.5.8 1 .8h15.2c.4 0 .7-.2.8-.6l3.2-19.5a.7.7 0 0 0-.8-.9H1zm13.4 14H9.6l-1.3-7h7.3l-1.2 7z"/>',
	codePen:
		'<path d="M23.5 7.5 12.5.2a1 1 0 0 0-1 0L.4 7.5a1 1 0 0 0-.5.8v7.4c0 .3.2.6.5.8l11 7.3c.3.3.7.3 1 0l11-7.3c.3-.2.5-.5.5-.8V8.3a1 1 0 0 0-.5-.8zM13 3l8.1 5.3-3.6 2.5-4.5-3V3zm-2 0v4.8l-4.5 3-3.6-2.5 8-5.3zm-9 7.3L4.7 12l-2.5 1.7v-3.4zM11 21l-8.1-5.3 3.6-2.5 4.5 3V21zm1-6.6L8.4 12 12 9.6l3.6 2.4-3.6 2.4zm1 6.6v-4.8l4.5-3 3.6 2.5-8 5.3zm9-7.3L19.3 12l2.5-1.7v3.4z"/>',
	discord:
		'<path d="M20.32 4.37a19.8 19.8 0 0 0-4.93-1.51 13.78 13.78 0 0 0-.64 1.28 18.27 18.27 0 0 0-5.5 0 12.64 12.64 0 0 0-.64-1.28h-.05A19.74 19.74 0 0 0 3.64 4.4 20.26 20.26 0 0 0 .11 18.09l.02.02a19.9 19.9 0 0 0 6.04 3.03l.04-.02a14.24 14.24 0 0 0 1.23-2.03.08.08 0 0 0-.05-.07 13.1 13.1 0 0 1-1.9-.92.08.08 0 0 1 .02-.1 10.2 10.2 0 0 0 .41-.31h.04a14.2 14.2 0 0 0 12.1 0l.04.01a9.63 9.63 0 0 0 .4.32.08.08 0 0 1-.03.1 12.29 12.29 0 0 1-1.9.91.08.08 0 0 0-.02.1 15.97 15.97 0 0 0 1.27 2.01h.04a19.84 19.84 0 0 0 6.03-3.05v-.03a20.12 20.12 0 0 0-3.57-13.69ZM8.02 15.33c-1.18 0-2.16-1.08-2.16-2.42 0-1.33.96-2.42 2.16-2.42 1.21 0 2.18 1.1 2.16 2.42 0 1.34-.96 2.42-2.16 2.42Zm7.97 0c-1.18 0-2.15-1.08-2.15-2.42 0-1.33.95-2.42 2.15-2.42 1.22 0 2.18 1.1 2.16 2.42 0 1.34-.94 2.42-2.16 2.42Z"/>',
	gitter:
		'<path d="M6.11 15.12H3.75V0h2.36v15.12zm4.71-11.55H8.46V24h2.36V3.57zm4.72 0h-2.36V24h2.36V3.57zm4.71 0h-2.36v11.57h2.36V3.56z"/>',
	twitter:
		'<path d="M24 4.4a10 10 0 0 1-2.83.78 5.05 5.05 0 0 0 2.17-2.79 9.7 9.7 0 0 1-3.13 1.23 4.89 4.89 0 0 0-5.94-1.03 5 5 0 0 0-2.17 2.38 5.15 5.15 0 0 0-.3 3.25c-1.95-.1-3.86-.63-5.61-1.53a14.04 14.04 0 0 1-4.52-3.74 5.2 5.2 0 0 0-.09 4.91c.39.74.94 1.35 1.61 1.82a4.77 4.77 0 0 1-2.23-.63v.06c0 1.16.4 2.29 1.12 3.18a4.9 4.9 0 0 0 2.84 1.74c-.73.22-1.5.26-2.24.12a4.89 4.89 0 0 0 4.59 3.49A9.78 9.78 0 0 1 0 19.73 13.65 13.65 0 0 0 7.55 22a13.63 13.63 0 0 0 9.96-4.16A14.26 14.26 0 0 0 21.6 7.65V7c.94-.72 1.75-1.6 2.4-2.6Z"/>',
	'x.com':
		'<path d="M 18.242188 2.25 L 21.554688 2.25 L 14.324219 10.507812 L 22.828125 21.75 L 16.171875 21.75 L 10.953125 14.933594 L 4.992188 21.75 L 1.679688 21.75 L 9.40625 12.914062 L 1.257812 2.25 L 8.082031 2.25 L 12.792969 8.480469 Z M 17.082031 19.773438 L 18.914062 19.773438 L 7.082031 4.125 L 5.113281 4.125 Z M 17.082031 19.773438 "/>',
	mastodon:
		'<path d="M16.45 17.77c2.77-.33 5.18-2.03 5.49-3.58.47-2.45.44-5.97.44-5.97 0-4.77-3.15-6.17-3.15-6.17-1.58-.72-4.3-1.03-7.13-1.05h-.07c-2.83.02-5.55.33-7.13 1.05 0 0-3.14 1.4-3.14 6.17v.91c-.01.88-.02 1.86 0 2.88.12 4.67.87 9.27 5.2 10.4 2 .53 3.72.64 5.1.57 2.51-.14 3.92-.9 3.92-.9l-.08-1.8s-1.8.56-3.8.5c-2-.08-4.1-.22-4.43-2.66a4.97 4.97 0 0 1-.04-.68s1.96.48 4.44.59c1.51.07 2.94-.09 4.38-.26Zm2.22-3.4h-2.3v-5.6c0-1.19-.5-1.79-1.5-1.79-1.1 0-1.66.71-1.66 2.12v3.07h-2.3V9.1c0-1.4-.55-2.12-1.65-2.12-1 0-1.5.6-1.5 1.78v5.61h-2.3V8.6c0-1.18.3-2.12.9-2.81a3.17 3.17 0 0 1 2.47-1.05c1.18 0 2.07.45 2.66 1.35l.57.96.58-.96a2.97 2.97 0 0 1 2.66-1.35c1.01 0 1.83.36 2.46 1.05.6.7.9 1.63.9 2.81v5.78Z"/>',
	codeberg:
		'<path d="M12 .5a12 12 0 0 0-12 12 12 12 0 0 0 1.8 6.4l10-13a.2.1 0 0 1 .4 0l10 13a12 12 0 0 0 1.8-6.4 12 12 0 0 0-12-12zm.3 6.5 4.4 16.5a12 12 0 0 0 5.2-4.2z"/>',
	youtube:
		'<path d="M23.5 6.2A3 3 0 0 0 21.4 4c-1.9-.5-9.4-.5-9.4-.5s-7.5 0-9.4.5A3 3 0 0 0 .5 6.3C0 8 0 12 0 12s0 4 .5 5.8A3 3 0 0 0 2.6 20c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2c.5-2 .5-5.9.5-5.9s0-4-.5-5.8zm-14 9.4V8.4l6.3 3.6-6.3 3.6z"/>',
	threads:
		'<path d="m17.73 11.2-.29-.13c-.17-3.13-1.88-4.92-4.75-4.94h-.04c-1.72 0-3.14.73-4.02 2.06l1.58 1.09a2.8 2.8 0 0 1 2.47-1.21c.94 0 1.66.28 2.12.81.33.4.56.93.67 1.61-.84-.14-1.74-.18-2.71-.13-2.73.16-4.49 1.75-4.37 3.97a3.41 3.41 0 0 0 1.57 2.71c.81.54 1.85.8 2.93.74a4.32 4.32 0 0 0 3.33-1.62 6 6 0 0 0 1.14-2.97 3.5 3.5 0 0 1 1.46 1.6 4 4 0 0 1-.98 4.4c-1.3 1.3-2.86 1.85-5.21 1.87-2.62-.02-4.6-.86-5.88-2.5-1.2-1.52-1.82-3.73-1.85-6.56.03-2.83.65-5.04 1.85-6.57 1.29-1.63 3.26-2.47 5.88-2.49 2.63.02 4.64.86 5.97 2.5.66.8 1.15 1.82 1.48 3l1.85-.5c-.4-1.44-1.02-2.7-1.86-3.73-1.71-2.1-4.21-3.19-7.44-3.21h-.01c-3.22.02-5.7 1.1-7.35 3.22C3.79 6.1 3.03 8.72 3 11.99V12c.03 3.29.79 5.9 2.27 7.78 1.66 2.12 4.13 3.2 7.35 3.22h.01c2.86-.02 4.88-.77 6.54-2.43a5.95 5.95 0 0 0 1.4-6.56 5.62 5.62 0 0 0-2.84-2.81Zm-4.94 4.64c-1.2.07-2.44-.47-2.5-1.62-.05-.85.6-1.8 2.57-1.92l.67-.02c.71 0 1.38.07 1.99.2-.23 2.84-1.56 3.3-2.73 3.36Z"/>',
	linkedin:
		'<path d="M20.47 2H3.53a1.45 1.45 0 0 0-1.47 1.43v17.14A1.45 1.45 0 0 0 3.53 22h16.94a1.45 1.45 0 0 0 1.47-1.43V3.43A1.45 1.45 0 0 0 20.47 2ZM8.09 18.74h-3v-9h3v9ZM6.59 8.48a1.56 1.56 0 0 1 0-3.12 1.57 1.57 0 1 1 0 3.12Zm12.32 10.26h-3v-4.83c0-1.21-.43-2-1.52-2A1.65 1.65 0 0 0 12.85 13a2 2 0 0 0-.1.73v5h-3v-9h3V11a3 3 0 0 1 2.71-1.5c2 0 3.45 1.29 3.45 4.06v5.18Z"/>',
	twitch:
		'<path d="M2.5 1 1 4.8v15.4h5.5V23h3.1l3-2.8H17l6-5.7V1H2.6ZM21 13.5l-3.4 3.3H12l-3 2.8v-2.8H4.5V3H21v10.5Zm-3.4-6.8v5.8h-2V6.7h2Zm-5.5 0v5.8h-2V6.7h2Z"/>',
	microsoftTeams:
		'<path d="M13.78 7.2a3.63 3.63 0 1 0-4.3-3.68h1.78a2.52 2.52 0 0 1 2.52 2.53V7.2zM7.34 18.8h3.92a2.52 2.52 0 0 0 2.52-2.52V8.37h4.17c.58.01 1.04.5 1.03 1.07v6.45a6.3 6.3 0 0 1-6.14 6.43 6.3 6.3 0 0 1-5.5-3.52zm16.1-14.06a2.51 2.51 0 1 1-5.02 0 2.51 2.51 0 0 1 5.02 0zm-3.36 14.24h-.17c.4-1 .59-2.05.57-3.11V9.46c0-.38-.07-.75-.23-1.09h2.69c.58 0 1.06.48 1.06 1.06v5.65a3.9 3.9 0 0 1-3.9 3.9h-.02z"/><path d="M1.02 5.02h10.24c.56 0 1.02.46 1.02 1.03v10.23a1.02 1.02 0 0 1-1.02 1.02H1.02A1.02 1.02 0 0 1 0 16.28V6.04c0-.56.46-1.02 1.02-1.02zm7.81 3.9V7.84H3.45v1.08h2.03v5.57h1.3V8.92h2.05z"/>',
	instagram:
		'<path d="M17.3 5.5a1.2 1.2 0 1 0 1.2 1.2 1.2 1.2 0 0 0-1.2-1.2ZM22 7.9a7.6 7.6 0 0 0-.4-2.5 5 5 0 0 0-1.2-1.7 4.7 4.7 0 0 0-1.8-1.2 7.3 7.3 0 0 0-2.4-.4L12 2H7.9a7.3 7.3 0 0 0-2.5.5 4.8 4.8 0 0 0-1.7 1.2 4.7 4.7 0 0 0-1.2 1.8 7.3 7.3 0 0 0-.4 2.4L2 12v4.1a7.3 7.3 0 0 0 .5 2.4 4.7 4.7 0 0 0 1.2 1.8 4.8 4.8 0 0 0 1.8 1.2 7.3 7.3 0 0 0 2.4.4l4.1.1h4.1a7.3 7.3 0 0 0 2.4-.5 4.7 4.7 0 0 0 1.8-1.2 4.8 4.8 0 0 0 1.2-1.7 7.6 7.6 0 0 0 .4-2.5L22 12V7.9ZM20.1 16a5.6 5.6 0 0 1-.3 1.9A3 3 0 0 1 19 19a3.2 3.2 0 0 1-1.1.8 5.6 5.6 0 0 1-1.9.3H8a5.7 5.7 0 0 1-1.9-.3A3.3 3.3 0 0 1 5 19a3 3 0 0 1-.7-1.1 5.5 5.5 0 0 1-.4-1.9l-.1-4V8a5.5 5.5 0 0 1 .4-1.9A3 3 0 0 1 5 5a3.1 3.1 0 0 1 1.1-.8A5.7 5.7 0 0 1 8 3.9l4-.1h4a5.6 5.6 0 0 1 1.9.4A3 3 0 0 1 19 5a3 3 0 0 1 .7 1.1A5.6 5.6 0 0 1 20 8l.1 4v4ZM12 6.9a5.1 5.1 0 1 0 5.1 5.1A5.1 5.1 0 0 0 12 6.9Zm0 8.4a3.3 3.3 0 1 1 3.3-3.3 3.3 3.3 0 0 1-3.3 3.3Z"/>',
	stackOverflow:
		'<path d="M15.72 0 14 1.28l6.4 8.58 1.7-1.26L15.73 0zm-3.94 3.42-1.36 1.64 8.22 6.85 1.37-1.64-8.23-6.85zM8.64 7.88l-.91 1.94 9.7 4.52.9-1.94-9.7-4.52zm-1.86 4.86-.44 2.1 10.48 2.2.44-2.1-10.47-2.2zM1.9 15.47V24h19.19v-8.53h-2.13v6.4H4.02v-6.4H1.9zm4.26 2.13v2.13h10.66V17.6H6.15Z"/>',
	telegram:
		'<path d="M22.265 2.428a2.048 2.048 0 0 0-2.078-.324L2.266 9.339a2.043 2.043 0 0 0 .104 3.818l3.625 1.261 2.02 6.682a.998.998 0 0 0 .119.252c.008.012.019.02.027.033a.988.988 0 0 0 .211.215.972.972 0 0 0 .07.05.986.986 0 0 0 .31.136l.013.001.006.003a1.022 1.022 0 0 0 .203.02l.018-.003a.993.993 0 0 0 .301-.052c.023-.008.042-.02.064-.03a.993.993 0 0 0 .205-.114 250.76 250.76 0 0 1 .152-.129l2.702-2.983 4.03 3.122a2.023 2.023 0 0 0 1.241.427 2.054 2.054 0 0 0 2.008-1.633l3.263-16.017a2.03 2.03 0 0 0-.693-1.97ZM9.37 14.736a.994.994 0 0 0-.272.506l-.31 1.504-.784-2.593 4.065-2.117Zm8.302 5.304-4.763-3.69a1.001 1.001 0 0 0-1.353.12l-.866.955.306-1.487 7.083-7.083a1 1 0 0 0-1.169-1.593L6.745 12.554 3.02 11.191 20.999 4Z"/>',
	rss: '<path d="M2.88 16.88a3 3 0 0 0 0 4.24 3 3 0 0 0 4.24 0 3 3 0 0 0-4.24-4.24Zm2.83 2.83a1 1 0 0 1-1.42-1.42 1 1 0 0 1 1.42 0 1 1 0 0 1 0 1.42ZM5 12a1 1 0 0 0 0 2 5 5 0 0 1 5 5 1 1 0 0 0 2 0 7 7 0 0 0-7-7Zm0-4a1 1 0 0 0 0 2 9 9 0 0 1 9 9 1 1 0 0 0 2 0 11.08 11.08 0 0 0-3.22-7.78A11.08 11.08 0 0 0 5 8Zm10.61.39A15.11 15.11 0 0 0 5 4a1 1 0 0 0 0 2 13 13 0 0 1 13 13 1 1 0 0 0 2 0 15.11 15.11 0 0 0-4.39-10.61Z"/>',
	facebook:
		'<path d="M20.9 2H3.1A1.1 1.1 0 0 0 2 3.1v17.8A1.1 1.1 0 0 0 3.1 22h9.58v-7.75h-2.6v-3h2.6V9a3.64 3.64 0 0 1 3.88-4 20.26 20.26 0 0 1 2.33.12v2.7H17.3c-1.26 0-1.5.6-1.5 1.47v1.93h3l-.39 3H15.8V22h5.1a1.1 1.1 0 0 0 1.1-1.1V3.1A1.1 1.1 0 0 0 20.9 2Z"/>',
	email:
		'<path d="M19 4H5a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3Zm-.41 2-5.88 5.88a1 1 0 0 1-1.42 0L5.41 6ZM20 17a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7.41l5.88 5.88a3 3 0 0 0 4.24 0L20 7.41Z"/>',
	reddit:
		'<path d="M14.41 16.87a3.38 3.38 0 0 1-2.37.63 3.37 3.37 0 0 1-2.36-.63 1 1 0 0 0-1.42 1.41 5.11 5.11 0 0 0 3.78 1.22 5.12 5.12 0 0 0 3.78-1.22 1 1 0 1 0-1.41-1.41ZM9.2 15a1 1 0 1 0-1-1 1 1 0 0 0 1 1Zm6-2a1 1 0 1 0 1 1 1 1 0 0 0-1-1Zm7.8-1.22a3.77 3.77 0 0 0-6.8-2.26 16.5 16.5 0 0 0-3.04-.48l.85-5.7 2.09.7a3 3 0 0 0 6-.06v-.02a3.03 3.03 0 0 0-3-2.96 2.98 2.98 0 0 0-2.34 1.16l-3.24-1.1a1 1 0 0 0-1.3.8l-1.09 7.17a16.66 16.66 0 0 0-3.34.49 3.77 3.77 0 0 0-6.22 4.23A4.86 4.86 0 0 0 1 16c0 3.92 4.83 7 11 7s11-3.08 11-7a4.86 4.86 0 0 0-.57-2.25 3.78 3.78 0 0 0 .57-1.97ZM19.1 3a1 1 0 1 1-1 1 1.02 1.02 0 0 1 1-1ZM4.77 10a1.76 1.76 0 0 1 .88.25A9.98 9.98 0 0 0 3 11.92v-.14A1.78 1.78 0 0 1 4.78 10ZM12 21c-4.88 0-9-2.29-9-5s4.12-5 9-5 9 2.29 9 5-4.12 5-9 5Zm8.99-9.08a9.98 9.98 0 0 0-2.65-1.67 1.76 1.76 0 0 1 .88-.25A1.78 1.78 0 0 1 21 11.78l-.01.14Z"/>',
	patreon:
		'<path d="M22.04 7.6c0-2.8-2.19-5.1-4.75-5.93a15.19 15.19 0 0 0-10.44.55C3.16 3.96 2 7.78 1.95 11.58c-.02 3.12.3 11.36 4.94 11.42 3.45.04 3.97-4.4 5.56-6.55 1.14-1.52 2.6-1.95 4.4-2.4 3.1-.76 5.2-3.2 5.2-6.44Z"/>',
	slack:
		'<path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52Zm1.271 0a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313ZM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834Zm0 1.271a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312Zm10.122 2.521a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834Zm-1.268 0a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312Zm-2.523 10.122a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52Zm0-1.268a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313Z"/>',
	matrix:
		'<path d="M22.5 1.5v21h-2.25V24H24V0h-3.75v1.5h2.25ZM7.46 7.95V9.1h.04a3.02 3.02 0 0 1 2.61-1.39c.54 0 1.03.1 1.48.32.44.2.78.58 1.01 1.1.26-.37.6-.7 1.03-.99.44-.28.95-.43 1.55-.43.45 0 .87.06 1.26.17.38.11.71.29.99.53.27.24.49.56.64.95.15.4.23.86.23 1.42v5.72h-2.34v-4.85c0-.29-.01-.56-.04-.8a1.73 1.73 0 0 0-.18-.67 1.1 1.1 0 0 0-.44-.45 1.6 1.6 0 0 0-.78-.16c-.33 0-.6.06-.8.19-.2.12-.37.29-.48.5a2 2 0 0 0-.23.69c-.04.26-.06.52-.06.78v4.77H10.6v-4.8l-.01-.75a2.29 2.29 0 0 0-.14-.69c-.08-.2-.23-.38-.42-.5a1.5 1.5 0 0 0-.85-.2c-.15.01-.3.04-.44.08-.19.06-.37.15-.52.28-.18.14-.32.34-.44.6-.12.26-.18.6-.18 1.02v4.96H5.25V7.94h2.21ZM1.5 1.5v21h2.25V24H0V0h3.75v1.5H1.5Z"/>',
	openCollective:
		'<path d="M21.86 5.17a11.94 11.94 0 0 1 0 13.66l-3.1-3.1a7.68 7.68 0 0 0 0-7.46l3.1-3.1Zm-3.03-3.03-3.1 3.1a7.71 7.71 0 1 0 0 13.51l3.1 3.11a12 12 0 1 1 0-19.73Z"/><path d="M21.86 5.17a11.94 11.94 0 0 1 0 13.66l-3.1-3.1a7.68 7.68 0 0 0 0-7.46l3.1-3.1Z"/>',
	astro:
		'<path d="M7.233 15.856c-.456 1.5-.132 3.586.948 4.57v-.036l.036-.096c.132-.636.648-1.032 1.309-1.008.612.012.96.336 1.044 1.044.036.264.036.528.048.803v.084c0 .6.168 1.176.504 1.68.3.48.72.851 1.284 1.103l-.024-.048-.024-.096c-.42-1.26-.12-2.135.984-2.879l.336-.227.745-.492a3.647 3.647 0 0 0 1.536-2.603c.06-.456 0-.9-.132-1.331l-.18.12c-1.668.887-3.577 1.2-5.425.84-1.117-.169-2.197-.48-3-1.416l.011-.012ZM2 15.592s3.205-1.559 6.421-1.559l2.437-7.508c.084-.36.348-.6.648-.6.3 0 .552.24.648.612l2.425 7.496c3.816 0 6.421 1.56 6.421 1.56L15.539.72c-.144-.444-.42-.72-.768-.72H8.24c-.348 0-.6.276-.768.72L2 15.592Z"/>',
	pnpm: '<path d="M0 0v7.5h7.5V0H0Zm8.25 0v7.5h7.498V0H8.25Zm8.25 0v7.5H24V0h-7.5ZM8.25 8.25v7.5h7.498v-7.5H8.25Zm8.25 0v7.5H24v-7.5h-7.5ZM0 16.5V24h7.5v-7.5H0Zm8.25 0V24h7.498v-7.5H8.25Zm8.25 0V24H24v-7.5h-7.5Z"/>',
	biome:
		'<path d="m12 2-5.346 9.259a12.065 12.065 0 0 1 6.326-.22l1.807.427-1.7 7.208-1.81-.427c-2.223-.524-4.36.644-5.263 2.507l-1.672-.809c1.276-2.636 4.284-4.232 7.363-3.505l.848-3.593A10.213 10.213 0 0 0 0 22.785h24L12 2Z"/>',
	bun: '<path d="M11.966 22.132c6.609 0 11.966-4.326 11.966-9.661 0-3.308-2.051-6.23-5.204-7.963-1.283-.713-2.291-1.353-3.13-1.885C14.018 1.619 13.043 1 11.966 1c-1.094 0-2.327.783-3.955 1.816a49.78 49.78 0 0 1-2.808 1.692C2.051 6.241 0 9.163 0 12.471c0 5.335 5.357 9.661 11.966 9.661Zm-1.397-17.83a5.885 5.885 0 0 0 .497-2.403c0-.144.201-.186.229-.028.656 2.775-.9 4.15-2.051 4.61-.124.048-.199-.12-.103-.208a5.747 5.747 0 0 0 1.428-1.971Zm2.052-.102a5.795 5.795 0 0 0-.78-2.3v-.015c-.068-.123.086-.263.185-.172 1.956 2.105 1.303 4.055.554 5.037-.082.102-.229-.003-.188-.126a5.837 5.837 0 0 0 .229-2.424Zm1.771-.559a5.709 5.709 0 0 0-1.607-1.801v-.014c-.112-.085-.024-.274.113-.218 2.588 1.084 2.766 3.171 2.452 4.395a.116.116 0 0 1-.13.09.11.11 0 0 1-.071-.045.118.118 0 0 1-.022-.083 5.863 5.863 0 0 0-.735-2.324ZM9.32 4.2c-.616.544-1.279.758-2.058.997-.116 0-.194-.078-.155-.18 1.747-.907 2.369-1.645 2.99-2.771 0 0 .155-.117.188.085 0 .303-.348 1.325-.965 1.869Zm4.931 11.205a2.95 2.95 0 0 1-.935 1.549 2.16 2.16 0 0 1-1.282.618 2.167 2.167 0 0 1-1.323-.618 2.95 2.95 0 0 1-.923-1.549.243.243 0 0 1 .064-.197.23.23 0 0 1 .192-.069h3.954a.227.227 0 0 1 .244.16c.01.035.014.07.009.106Zm-5.443-2.17a1.85 1.85 0 0 1-2.377-.244 1.969 1.969 0 0 1-.233-2.44c.207-.318.502-.565.846-.711a1.84 1.84 0 0 1 2.053.42c.264.27.443.616.515.99a1.98 1.98 0 0 1-.108 1.118c-.142.35-.384.653-.696.867Zm8.471.005a1.85 1.85 0 0 1-2.374-.252 1.956 1.956 0 0 1-.546-1.362c0-.383.11-.758.319-1.076.207-.318.502-.566.847-.711a1.84 1.84 0 0 1 1.09-.108c.366.076.702.261.965.533s.44.617.512.993a1.98 1.98 0 0 1-.113 1.118 1.922 1.922 0 0 1-.7.865Z"/>',
	mdx: '<path d="m15.494 12.406-3.169 3.169-3.25-3.169.894-.894 1.706 1.707V8.588h1.219V13.3l1.706-1.706.894.812Zm-13.65-.65 2.193 2.194 2.276-2.194v3.575H7.53v-6.58l-3.494 3.493L.625 8.75v6.581h1.219v-3.575ZM22.4 15.25l-2.519-2.519-2.518 2.519-.813-.894 2.519-2.518-2.6-2.6.893-.813 2.52 2.6 2.6-2.6.893.813-2.6 2.6 2.519 2.518-.894.894Z"/>',
	homebrew: '<path d="M7.94 0a.21.21 0 0 0-.2.16c-.32 1.1.17 2.15.83 2.93.15.18.31.35.48.5a2.04 2.04 0 0 0-.67.02c-1.18.24-2.2.99-2.74 2.53a3.9 3.9 0 0 0-.2 1.47 1.56 1.56 0 0 0-1.16 1.5 1.59 1.59 0 0 0 1.23 1.55l.03 12.04c0 .2.1.38.26.48a.21.21 0 0 0 .01 0c.54.32 2.05.82 5.21.82 3.24 0 4.7-.68 5.18-1.04a.57.57 0 0 0 .22-.45v-1.6a.14.14 0 0 1 .14-.14h1.32a1.83 1.83 0 0 0 1.83-1.82v-5.8a1.83 1.83 0 0 0-1.82-1.83h-1.33a.14.14 0 0 1-.14-.15v-.57a1.57 1.57 0 0 0 1.36-1.56c0-.81-.63-1.49-1.42-1.56a4.34 4.34 0 0 0-.74-2.58 3.1 3.1 0 0 0-2.28-1.32c-.5-.02-.84.12-1.13.25-.21.1-.42.18-.67.22 0-1.28.95-1.98.95-1.98a.21.21 0 0 0 .05-.3s-.09-.12-.21-.26c-.12-.13-.27-.3-.47-.38a.21.21 0 0 0-.08-.01.21.21 0 0 0-.14.05 4.3 4.3 0 0 0-.88 1.1 3.42 3.42 0 0 0-.13.28 3.5 3.5 0 0 0-.38-.85A4.44 4.44 0 0 0 8.02.02.21.21 0 0 0 7.94 0zm.15.52c.85.38 1.43.83 1.8 1.4.27.45.42.97.48 1.6a3.07 3.07 0 0 0-.01.45 6.9 6.9 0 0 1-.17-.05 5.49 5.49 0 0 1-1.3-1.1c-.54-.66-.93-1.46-.8-2.3m3.71 1.1c.07.05.14.1.21.18l.06.07a2.97 2.97 0 0 0-.95 2.45.21.21 0 0 0 .22.2c.47-.02.78-.17 1.06-.3.27-.13.5-.23.93-.21.87.02 1.64.71 1.94 1.13.3.45.65 1 .66 2.36a1.66 1.66 0 0 0-.41.14 1.94 1.94 0 0 0-1.77-1.16 1.94 1.94 0 0 0-1.87 1.45 1.78 1.78 0 0 0-1.36-.64c-.48 0-.9.2-1.23.52a1.87 1.87 0 0 0-1.85-1.63c-.65 0-1.22.34-1.55.84a3.1 3.1 0 0 1 .16-.73c.5-1.44 1.35-2.05 2.42-2.26.36-.07.66 0 .99.1.32.1.67.26 1.09.34a.21.21 0 0 0 .25-.25c-.11-.67.07-1.26.34-1.74a3.71 3.71 0 0 1 .66-.86m-4.36 5A1.44 1.44 0 0 1 8.8 8.53a.21.21 0 0 0 .17.28.21.21 0 0 0 .24-.15 1.37 1.37 0 0 1 2.62 0 .21.21 0 0 0 .41-.1 1.5 1.5 0 0 1 1.5-1.66c.69 0 1.26.44 1.45 1.05a.21.21 0 0 0 .26.15l.15-.04a.21.21 0 0 0 .05-.02 1.14 1.14 0 0 1 1.7 1 1.14 1.14 0 0 1-.98 1.12 2.21 2.21 0 0 0-.49.13 10.65 10.65 0 0 1-1.18.36.21.21 0 0 0-.16.2 1.28 1.28 0 0 1-.14.47 2.07 2.07 0 0 0-.24 1.11v.15a.44.44 0 0 1-.16.36.67.67 0 0 1-.43.14.59.59 0 0 1-.59-.59.8.8 0 0 0-.38-.68 1.28 1.28 0 0 1-.53-.64.21.21 0 0 0-.21-.14 19.47 19.47 0 0 1-5.37-.6 9 9 0 0 0-.84-.2 1.16 1.16 0 0 1-.94-1.13c0-.62.5-1.11 1.1-1.14a.21.21 0 0 0 .21-.17A1.44 1.44 0 0 1 7.44 6.6m8.55 4.1v.46c0 .32.26.57.57.57h1.33a1.4 1.4 0 0 1 1.4 1.4v5.8a1.4 1.4 0 0 1-1.4 1.4h-1.32a.57.57 0 0 0-.58.57v1.6c0 .05-.02.08-.05.11-.35.26-1.75.95-4.92.95-3.1 0-4.59-.52-4.99-.75a.14.14 0 0 1-.06-.12l-.03-11.95.43.1.39.1v10.37c0 .13.07.25.18.31.45.22 1.77.74 4.07.74 2.32 0 3.6-.63 4.02-.89a.36.36 0 0 0 .17-.3v-10.2l.79-.26m-8 .9a.5.5 0 0 1 .5.48v8.58a.5.5 0 0 1-.49.5.5.5 0 0 1-.5-.5V12.1a.5.5 0 0 1 .5-.49zm8.66 1.13a.66.66 0 0 0-.66.66v5.21a.66.66 0 0 0 .66.66h1.14a.66.66 0 0 0 .66-.66v-5.2a.66.66 0 0 0-.66-.67zm0 .43h1.14a.23.23 0 0 1 .23.23v5.21a.23.23 0 0 1-.23.23h-1.14a.23.23 0 0 1-.23-.23v-5.2a.23.23 0 0 1 .23-.24"/>',
};

export const Icons = {
	...BuiltInIcons,
	...FileIcons,
};
