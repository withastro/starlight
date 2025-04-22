/**
 * This file is meant to be imported first in the various Starlight entry points to ensure a
 * specific order of CSS cascade layers.
 */

// Important that this is the first import so it can override cascade layers order.
import 'virtual:starlight/user-css';

// Starlight nested cascade layers definitions which specify the default order of internal layers.
import '../style/layers.css';
