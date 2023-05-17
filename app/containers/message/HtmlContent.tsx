import { useWindowDimensions, View } from 'react-native';
import React from 'react';
import RenderHTML from 'react-native-render-html';
import Reactotron from 'reactotron-react-native';

const DomParser = require('react-native-html-parser').DOMParser;

interface IHtmlContent {
	content?: string;
}
export const HtmlContent = React.memo(
	({ content }: IHtmlContent) => {
		const { width } = useWindowDimensions();
		const document = new DomParser().parseFromString(content || '', 'text/html');

		const getElementStyle = (element: any) => {
			const stringified = element.getAttribute('style') as string;
			const rows = stringified.split(';').filter(r => r.length > 1);
			return rows.reduce((acc, row) => {
				acc[row.split(':')[0].trim()] = row.split(':')[1].trim();
				return acc;
			}, {} as Record<string, string>);
		};
		const setElementStyle = (element: any, styles: Record<string, string>) => {
			const stringified = Object.entries(styles)
				.map(([key, value]) => `${key}: ${value};`)
				.join('');
			element.setAttribute('style', stringified);
		};

		const getElementsByTagNames = (root: any, tags: string[]) => {
			const elements = [];
			for (const tag of tags) {
				const _elements = root.getElementsByTagName(tag);
				for (let i = 0; i < _elements.length; i++) {
					elements.push(_elements[i]);
				}
			}
			return elements;
		};

		const tables = document.getElementsByTagName('table');
		for (let i = 0; i < tables.length; i++) {
			const styles = getElementStyle(tables[i]);
			setElementStyle(tables[i], { ...styles, border: '1px solid', height: 'auto', width: '100%' });
		}
		const otherElements = getElementsByTagNames(document, ['td', 'th']);
		for (const element of otherElements) {
			const styles = getElementStyle(element);
			setElementStyle(element, {
				...styles,
				border: '1px solid'
			});
		}

		const elementsWithBadHeight = getElementsByTagNames(document, ['tr', 'td', 'th']);
		for (const element of elementsWithBadHeight) {
			const styles = getElementStyle(element);
			setElementStyle(element, {
				...styles,
				height: 'auto'
			});
		}
		const strongElements = getElementsByTagNames(document, ['tr']);
		for (const element of strongElements) {
			const styles = getElementStyle(element);
			setElementStyle(element, {
				...styles,
				color: 'black'
			});
		}

		const correctedHtml = document.toString();
		Reactotron.log?.(correctedHtml);
		return (
			<View style={{ flex: 1 }}>
				<RenderHTML contentWidth={width} source={{ html: correctedHtml || '' }} />
			</View>
		);
	},
	(prev, current) => prev.content === current.content
);
