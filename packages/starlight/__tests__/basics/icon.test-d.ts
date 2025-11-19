import { expectTypeOf, test } from 'vitest';
import type { BuiltInIcon, BuiltInIcons } from '../../src/components/Icons';
import type { FileIcon, FileIcons } from '../../src/user-components/file-tree-icons';

test('includes every built-in icons in the `BuiltInIcon` type', () => {
	expectTypeOf<keyof typeof BuiltInIcons>().toEqualTypeOf<BuiltInIcon>();
});

test('includes every seti file icons in the `FileIcon` type', () => {
	expectTypeOf<keyof typeof FileIcons>().toEqualTypeOf<FileIcon>();
});
