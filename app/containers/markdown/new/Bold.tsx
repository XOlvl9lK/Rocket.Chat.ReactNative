/* eslint-disable react/no-array-index-key */
import React, { FC } from 'react';
import { StyleSheet, Text } from 'react-native';
import { Bold as BoldProps } from '@rocket.chat/message-parser';

import Strike from './Strike';
import Italic from './Italic';
import Plain from './Plain';

interface IBoldProps {
	value: BoldProps['value'];
}

const styles = StyleSheet.create({
	text: {
		fontWeight: 'bold'
	}
});

const Bold: FC<IBoldProps> = ({ value }) => (
	<Text style={styles.text}>
		{value.map(block => {
			switch (block.type) {
				case 'PLAIN_TEXT':
					return <Plain value={block.value} />;
				case 'STRIKE':
					return <Strike value={block.value} />;
				case 'ITALIC':
					return <Italic value={block.value} />;
				default:
					return null;
			}
		})}
	</Text>
);

export default Bold;