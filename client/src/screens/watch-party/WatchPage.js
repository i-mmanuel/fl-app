import axios from 'axios';
import React, { Component, useState } from 'react';
import { ScrollView, useWindowDimensions } from 'react-native';
import HTML from 'react-native-render-html';

const WatchPage = () => {
	const [htmlContent, setHtmlContent] = useState('');

	const content = async () => {
		try {
			let response = await axios.get(
				'https://messages-and-fellowships.herokuapp.com/watch/v3hkiqr3vvk?url=eJ5maoSvFPA'
			);

			setHtmlContent(response.data);
			return response.data;
		} catch (error) {
			console.log(`error:`, error);
		}
	};
	content();

	let contentWidth = useWindowDimensions().width;

	return (
		<ScrollView style={{ flex: 1 }}>
			<HTML
				source={{
					html: htmlContent,
					uri:
						'https://messages-and-fellowships.herokuapp.com/watch/v3hkiqr3vvk?url=eJ5maoSvFPA',
					method: 'get',
				}}
				contentWidth={contentWidth}
			/>
		</ScrollView>
	);
};

export default WatchPage;
