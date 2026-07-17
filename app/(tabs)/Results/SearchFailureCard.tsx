import { Colors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
	message: string;
	variant: "error" | "stopped";
	onRetry: () => void;
	onEdit: () => void;
};

const SearchFailureCard = ({ message, variant, onRetry, onEdit }: Props) => {
	const isStopped = variant === "stopped";

	if (isStopped) {
		return (
			<View style={[styles.container, styles.stoppedContainer]}>
				<View style={styles.stoppedContent}>
					<View style={styles.headerRow}>
						<Ionicons name="stop-circle" size={20} color="#92400E" />
						<Text style={[styles.message, styles.stoppedText]}>{message}</Text>
					</View>

					<View style={styles.actions}>
						<TouchableOpacity style={styles.retryButton} onPress={onRetry}>
							<Ionicons name="refresh" size={16} color="#FFF" />
							<Text style={styles.retryButtonText}>Retry</Text>
						</TouchableOpacity>

						<TouchableOpacity style={styles.editButton} onPress={onEdit}>
							<Ionicons
								name="create-outline"
								size={16}
								color={Colors.blueDark}
							/>
							<Text style={styles.editButtonText}>Edit</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>
		);
	}

	return (
		<View style={[styles.container, styles.errorContainer]}>
			<View style={styles.headerRow}>
				<Ionicons name="alert-circle" size={20} color="#DC2626" />
				<Text style={[styles.message, styles.errorText]}>{message}</Text>
			</View>

			<View style={styles.actions}>
				<TouchableOpacity style={styles.retryButton} onPress={onRetry}>
					<Ionicons name="refresh" size={16} color="#FFF" />
					<Text style={styles.retryButtonText}>Retry</Text>
				</TouchableOpacity>

				<TouchableOpacity style={styles.editButton} onPress={onEdit}>
					<Ionicons name="create-outline" size={16} color={Colors.blueDark} />
					<Text style={styles.editButtonText}>Edit</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
};

export default SearchFailureCard;

const styles = StyleSheet.create({
	container: {
		alignSelf: "flex-start",
		width: "98%",
		maxWidth: "98%",
		paddingHorizontal: 14,
		paddingVertical: 12,
		borderRadius: 14,
		marginTop: 10,
		marginBottom: 8,
		marginHorizontal: "1%",
		borderWidth: 1,
	},

	errorContainer: {
		backgroundColor: "#FEE2E2",
		borderColor: "#FECACA",
	},

	stoppedContainer: {
		backgroundColor: "#FEF3C7",
		borderColor: "#FDE68A",
	},

	stoppedContent: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		gap: 12,
	},

	headerRow: {
		flexDirection: "row",
		alignItems: "center",
		flex: 1,
	},

	message: {
		marginLeft: 10,
		fontSize: 13,
		lineHeight: 19,
		flexShrink: 1,
	},

	errorText: {
		color: "#DC2626",
	},

	stoppedText: {
		color: "#92400E",
	},

	actions: {
		flexDirection: "row",
		gap: 10,
	},

	retryButton: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: Colors.blueDark,
		paddingHorizontal: 14,
		paddingVertical: 8,
		borderRadius: 8,
		gap: 6,
	},

	retryButtonText: {
		color: "#FFF",
		fontSize: 13,
		fontWeight: "600",
	},

	editButton: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#FFF",
		paddingHorizontal: 14,
		paddingVertical: 8,
		borderRadius: 8,
		borderWidth: 1,
		borderColor: Colors.blueDark,
		gap: 6,
	},

	editButtonText: {
		color: Colors.blueDark,
		fontSize: 13,
		fontWeight: "600",
	},
});
