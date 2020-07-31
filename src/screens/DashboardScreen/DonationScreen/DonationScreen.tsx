import React, { useState } from 'react';
import { useNavigation } from 'react-navigation-hooks';
import {
	View,
	KeyboardAvoidingView, ScrollView, Platform, Text, Image,
} from 'react-native';
import useGlobal from '@state';
import {
	NavBar,
	SpacerInline,
	FormTextInput,
	LinkButton,
} from '@elements';
import validate from 'validate.js';
import { NewDonation } from '@screens/DashboardScreen/DonationScreen/DonationScreen.type';
import donationConstraints from '@util/constraints/donation';
import { categoryImage } from '@util/donationCategory';
import styles from './DonationScreen.styles';

export default () => {
	const [ state, actions ] = useGlobal() as any;
	const { user } = state;
	const [ newDonation, setNewDonation ] = useState<NewDonation>({ pickupInstructions: user.pickup_instructions } as NewDonation);
	const [ validateError, setValidateError ] = useState({} as any);
	const { postDonation } = actions;
	const { navigate } = useNavigation();

	const foodCategories: Array<string> = [ 'Bread', 'Dairy', 'Hot Meal', 'Produce', 'Protein', 'Others' ];
	newDonation.pickupAddress = `${user.address_street} ${user.address_city}, ${user.address_state} ${user.address_zip}`;

	const validateInputs = async () => {
		const validateResults = validate(newDonation, donationConstraints);
		if (validateResults) {
			setValidateError(validateResults);
		} else {
			setValidateError({});
			const result = await postDonation(newDonation);
			if (result === 201) {
				navigate('DashboardScreen');
			} else {
				// TODO: communicate failures better
				console.log('There was a problem creating the donation');
			}
		}
	};
	return (
		<KeyboardAvoidingView
			style={styles.keyboardAvoidContainer}
			behavior={Platform.OS === 'ios' ? 'padding' : 'height'} // Android and iOS both interact with this prop differently
			enabled={true}
			keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
		>
			<NavBar showBackButton={true} />
			<ScrollView style={styles.scrollContainer}>

				<View style={styles.imageInputContainer}>
					<Image source={categoryImage(newDonation.category)} style={styles.icon} />
				</View>

				<SpacerInline height={20} />
				<FormTextInput
					label="Item Name"
					value={newDonation.itemName}
					setValue={s => setNewDonation({ ...newDonation, itemName: s })}
					style={styles.input}
					error={validateError.itemName}
					errorMessage={validateError.itemName}
					autoFocus={true}
				/>

				<FormTextInput
					label="Food Category"
					dropdownData={foodCategories}
					setValue={s => setNewDonation({ ...newDonation, category: s })}
					value={newDonation.category}
					type="dropdown"
					error={!!validateError.category}
					errorMessage={validateError.category}
					placeholder="Select one"
				/>

				<FormTextInput
					label="Total Amount"
					value={newDonation.totalAmount}
					setValue={s => setNewDonation({ ...newDonation, totalAmount: s })}
					style={styles.input}
					error={validateError.totalAmount}
					errorMessage={validateError.totalAmount}
				/>

				<View>
					<Text style={styles.pickupAddressLabel}>
						PICKUP ADDRESS
					</Text>
					<Text style={styles.pickupAddressStyle}>
						{newDonation.pickupAddress}
					</Text>
				</View>

				<FormTextInput
					label="Pickup Instructions"
					value={newDonation.pickupInstructions}
					setValue={s => setNewDonation({ ...newDonation, pickupInstructions: s })}
					style={styles.input}
					error={validateError.pickupInstructions}
					errorMessage={validateError.pickupInstructions}
				/>

				<View style={styles.button}>
					<LinkButton
						text="Publish"
						onPress={validateInputs}
					/>
				</View>
			</ScrollView>
		</KeyboardAvoidingView>

	);
};
