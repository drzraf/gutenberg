/**
 * External dependencies
 */
import type { ComponentMeta, ComponentStory } from '@storybook/react';
import type { ComponentProps } from 'react';
/**
 * WordPress dependencies
 */
import { useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import FormTokenField from '../';

const meta: ComponentMeta< typeof FormTokenField > = {
	component: FormTokenField,
	title: 'Components/FormTokenField',
	argTypes: {
		value: {
			control: { type: null },
		},
		__experimentalValidateInput: {
			control: { type: null },
		},
	},
	parameters: {
		controls: {
			expanded: true,
		},
		docs: { source: { state: 'open' } },
	},
};
export default meta;

const continents = [
	'Africa',
	'America',
	'Antarctica',
	'Asia',
	'Europe',
	'Oceania',
];

const DefaultTemplate: ComponentStory< typeof FormTokenField > = ( {
	...args
} ) => {
	const [ selectedContinents, setSelectedContinents ] = useState<
		ComponentProps< typeof FormTokenField >[ 'value' ]
	>( [] );

	return (
		<FormTokenField
			{ ...args }
			value={ selectedContinents }
			onChange={ ( tokens ) => setSelectedContinents( tokens ) }
		/>
	);
};

export const Default: ComponentStory< typeof FormTokenField > =
	DefaultTemplate.bind( {} );
Default.args = {
	label: 'Type a continent',
	suggestions: continents,
};

export const Async: ComponentStory< typeof FormTokenField > = ( {
	suggestions,
	...args
} ) => {
	const [ selectedContinents, setSelectedContinents ] = useState<
		ComponentProps< typeof FormTokenField >[ 'value' ]
	>( [] );
	const [ availableContinents, setAvailableContinents ] = useState<
		string[]
	>( [] );

	const searchContinents = ( input: string ) => {
		const timeout = setTimeout( () => {
			const available = ( suggestions || [] ).filter( ( continent ) =>
				continent.toLowerCase().includes( input.toLowerCase() )
			);
			setAvailableContinents( available );
		}, 1000 );

		return () => clearTimeout( timeout );
	};

	return (
		<FormTokenField
			{ ...args }
			value={ selectedContinents }
			suggestions={ availableContinents }
			onChange={ ( tokens ) => setSelectedContinents( tokens ) }
			onInputChange={ searchContinents }
		/>
	);
};
Async.args = {
	label: 'Type a continent',
	suggestions: continents,
};

/**
 * The rendered output of each suggestion can be customized by passing a
 * render function to the `__experimentalRenderItem` prop. (This is still an experimental feature
 * and is subject to change.)
 */
export const WithCustomRenderItem: ComponentStory< typeof FormTokenField > =
	DefaultTemplate.bind( {} );
WithCustomRenderItem.args = {
	...Default.args,
	__experimentalRenderItem: ( { item } ) => (
		<div>{ `${ item } — a nice place to visit` }</div>
	),
};
