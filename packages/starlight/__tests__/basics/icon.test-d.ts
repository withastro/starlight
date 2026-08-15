import { expectTypeOf, test } from 'vitest';
import type { BuiltInIcon, BuiltInIcons } from '../../src/components-internals/Icons';
import type { FileIcon, FileIcons } from '../../src/user-components/file-tree-icons';

test('keeps built-in icon names and the `BuiltInIcon` type synced', () => {
	expectTypeOf<Exclude<keyof typeof BuiltInIcons, BuiltInIcon>>().toBeNever();
	expectTypeOf<Exclude<BuiltInIcon, keyof typeof BuiltInIcons>>().toBeNever();
});

test('keeps seti file icon names and the `FileIcon` type synced', () => {
	expectTypeOf<Exclude<keyof typeof FileIcons, FileIcon>>().toBeNever();
	expectTypeOf<Exclude<FileIcon, keyof typeof FileIcons>>().toBeNever();
});
