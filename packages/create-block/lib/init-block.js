/**
 * External dependencies
 */
const { omitBy } = require( 'lodash' );
const { dirname, join } = require( 'path' );
const makeDir = require( 'make-dir' );
const { writeFile } = require( 'fs' ).promises;

/**
 * Internal dependencies
 */
const { info } = require( './log' );
const { writeOutputTemplate } = require( './output' );

async function initBlockJSON( {
	$schema,
	apiVersion,
	plugin,
	slug,
	namespace,
	title,
	version,
	description,
	category,
	attributes,
	supports,
	dashicon,
	textdomain,
	folderName,
	editorScript,
	editorStyle,
	style,
} ) {
	info( '' );
	info( 'Creating a "block.json" file.' );

	const outputFile = plugin
		? join( process.cwd(), slug, folderName, 'block.json' )
		: join( process.cwd(), slug, 'block.json' );
	await makeDir( dirname( outputFile ) );
	await writeFile(
		outputFile,
		JSON.stringify(
			omitBy(
				{
					$schema,
					apiVersion,
					name: namespace + '/' + slug,
					version,
					title,
					category,
					icon: dashicon,
					description,
					attributes,
					supports,
					textdomain,
					editorScript,
					editorStyle,
					style,
				},
				( value ) => ! value
			),
			null,
			'\t'
		)
	);
}

module.exports = async function ( outputTemplates, view ) {
	await Promise.all(
		Object.keys( outputTemplates ).map( async ( outputFile ) => {
			const pathName = view.plugin
				? join( view.folderName, outputFile )
				: join( process.cwd(), view.slug, outputFile );

			await writeOutputTemplate(
				outputTemplates[ outputFile ],
				pathName,
				view
			);
		} )
	);
	await initBlockJSON( view );
};
