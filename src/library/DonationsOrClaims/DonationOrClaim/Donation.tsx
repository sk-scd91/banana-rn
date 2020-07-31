import React from 'react';
import { useNavigation } from 'react-navigation-hooks';
import {
	View,
	Text,
	TouchableOpacity,
	Image,
} from 'react-native';
import { Icon } from '@elements';
import { categoryImage } from '@util/donationCategory';
import typography from '@util/typography';
import { Donation } from './DonationOrClaim.type';
import styles from './DonationOrClaim.styles';

export default ({ donation }: Donation) => {
	const { navigate } = useNavigation();
	const {
		category,
		created_at,
		duration_minutes,
		food_name,
		id,
	} = donation;
	const icon = categoryImage(category);

	const startTime = new Date(created_at);
	const now = new Date();
	const minutesElapsed = Math.round(now.getTime() - (startTime.getTime()) / 1000 / 60);
	const timeLeft = minutesElapsed < duration_minutes
		? duration_minutes - minutesElapsed
		: 0;

	// TODO: Get organization name and distance for donor.
	const organization_name = 'Unknown';
	const distance = 0.0;

	return (
		<TouchableOpacity
			onPress={() => navigate('MakeClaimScreen', { donation, id })}
		>
			<View style={styles.card}>
				<View style={styles.categoryText}>
					<Text style={typography.h4}>{category}</Text>
				</View>
				<View style={styles.mainContainer}>
					<View style={[ styles.iconContainer, { backgroundColor: timeLeft > 0 ? 'blue' : 'gray' } ]}>
						<Image source={icon} style={styles.icon} />
					</View>
					<View style={styles.infoContainer}>
						<Text style={typography.h3}>{food_name}</Text>
						<View style={styles.infoBottomContainer}>
							{/* TODO: Add pindrop icon. */}
							<Icon name="arrowDown" size={18} />
							<Text style={[ typography.body3, { fontSize: 18, marginHorizontal: 4 } ]}>{organization_name}</Text>
							<Icon name="distance" size={18} />
							<Text style={[ typography.body3, { fontSize: 18, marginHorizontal: 4 } ]}>{`${distance.toFixed(1)} mi`}</Text>
						</View>
					</View>
				</View>
			</View>
		</TouchableOpacity>
	);
};
