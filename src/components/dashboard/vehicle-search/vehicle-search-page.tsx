import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import axiosInstance from "@/lib/axios";
import Swal from "sweetalert2";

import DriverFeedbackForm from "@/components/dashboard/vehicle-search/driver-feedback-form";
import TaxiRegistrationForm from "@/components/dashboard/vehicle-search/taxi-registration-form";

export default function VehicleSearchPage(): React.JSX.Element {
	const [carNumber, setCarNumber] = React.useState("");
	const [isSearching, setIsSearching] = React.useState(false);
	const [searchResult, setSearchResult] = React.useState<{ success: boolean; message: string; data?: Record<string, unknown> } | null>(
		null
	);
	const [taxiRegistered, setTaxiRegistered] = React.useState(false);
	const [registeredDriverName, setRegisteredDriverName] = React.useState("");
	const [registrationCompleted, setRegistrationCompleted] = React.useState(false);

	// Auto-hide registration completed message after 5 seconds
	React.useEffect(() => {
		if (registrationCompleted) {
			// Show success alert
			Swal.fire({
				icon: "success",
				title: "Success",
				text: "Feedback Submitted Successfully!",
			});

			const timer = setTimeout(() => {
				setRegistrationCompleted(false);
				// Reset everything for new search
				setSearchResult(null);
				setTaxiRegistered(false);
				setCarNumber("");
				setRegisteredDriverName("");
			}, 5000);
			return () => clearTimeout(timer);
		}
	}, [registrationCompleted]);

	const handleSearch = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSearching(true);
		setSearchResult(null);
		setTaxiRegistered(false);
		setRegistrationCompleted(false);

		try {
			const token = localStorage.getItem("custom-auth-token");
			
			if (!token) {
				Swal.fire({
					icon: "error",
					title: "Authentication Error",
					text: "Authentication token not found. Please login again.",
				});
				setIsSearching(false);
				return;
			}

			const response = await axiosInstance.get(`/taxi/${carNumber}`);

			setSearchResult({
				success: true,
				message: "Taxi found successfully!",
				data: response.data,
			});
			Swal.fire({
				icon: "success",
				title: "Success",
				text: "Taxi found successfully!",
			});
		} catch (error_: unknown) {
			const error = error_ as Record<string, unknown>;
			
			let errorMessage: string = "Taxi not found";
			
			// Try to extract error message from response
			if ((error as Record<string, unknown>).response && typeof (error as Record<string, unknown>).response === 'object') {
				const responseData = ((error as Record<string, unknown>).response as Record<string, unknown>).data;
				if (responseData && typeof responseData === 'object') {
					const dataObj = responseData as Record<string, unknown>;
					if (dataObj.message) {
						errorMessage = String(dataObj.message);
					} else if (dataObj.error) {
						errorMessage = String(dataObj.error);
					}
				} else if (typeof responseData === 'string') {
					errorMessage = responseData;
				}
			} else if ((error as Record<string, unknown>).message) {
				errorMessage = String((error as Record<string, unknown>).message);
			}
			
			// Update the error message for better UX
			if (errorMessage.includes("Could not find Taxi for specified ID")) {
				errorMessage = "Please register the taxi details.";
			}
			
			setSearchResult({
				success: false,
				message: errorMessage,
			});
			Swal.fire({
				icon: "info",
				title: "Taxi Not Found",
				text: errorMessage,
			});
		} finally {
			setIsSearching(false);
		}
	};

	const handleCarNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const raw = e.target.value;
		// Keep only letters and numbers, convert letters to uppercase
		const filtered = raw.toUpperCase().replaceAll(/[^A-Z0-9]/g, "");
		setCarNumber(filtered);
	};

	const handleTaxiRegistrationSuccess = (driverName: string) => {
		setRegisteredDriverName(driverName);
		setTaxiRegistered(true);
		setSearchResult(null);
	};

	const handleFeedbackSuccess = () => {
		setRegistrationCompleted(true);
	};

	return (
		<Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mt: 8, gap: 6 }}>
			{/* Search Section - Always Visible */}
			<Box sx={{ width: "100%" }}>
				<Typography variant="h4" sx={{ mb: 4, textAlign: "center" }}>
					Find Vehicle Information by Car Number
				</Typography>
				<form onSubmit={handleSearch} style={{ width: "100%" }}>
					<Stack direction="column" spacing={2} sx={{ alignItems: "center", width: "100%" }}>
						<TextField
							variant="outlined"
							placeholder="Enter Car Number"
							value={carNumber}
							onChange={handleCarNumberChange}
							sx={{ width: { xs: "100%", sm: 600 } }}
							InputProps={{
								sx: { fontSize: 28, height: 72, background: "#fff", borderRadius: 2 },
							}}
						/>
						<Button
							type="submit"
							variant="contained"
							color="primary"
							size="large"
							sx={{ fontSize: 18, px: 6, borderRadius: 2, width: { xs: "100%", sm: 300 } }}
							disabled={!carNumber.trim() || isSearching}
						>
							{isSearching ? <CircularProgress size={24} color="inherit" /> : "Search Vehicle"}
						</Button>
					</Stack>
					</form>

			{/* Registration Completed Message */}
			{/* Now using SweetAlert2 instead of Alert component */}

			{/* Search Results - Only show if not registration completed */}
			{!registrationCompleted && searchResult && (
			<Box sx={{ mt: 3, width: "100%", display: "flex", justifyContent: "center" }}>
				<Box sx={{ width: "100%", maxWidth: 600 }}>
					{searchResult.success && searchResult.data?.client ? (
						<Box
							sx={{
								backgroundColor: "#f5f5f5",
								p: { xs: 1.5, sm: 2 },
								borderRadius: 1,
								border: "1px solid #ddd",
							}}
						>
							<Stack spacing={1}>
								<Box>
									<Typography
										variant="subtitle2"
										sx={{ fontWeight: 600, mb: 1, fontSize: { xs: "0.9rem", sm: "1rem" } }}
									>
										Taxi Information
									</Typography>
									<Stack spacing={1}>
										<Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
											<Typography
												variant="caption"
												sx={{ fontWeight: 500, fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
											>
												Taxi Number:
											</Typography>
											<Typography
												variant="caption"
												sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" }, textAlign: "right" }}
											>
												{String((searchResult.data.client as Record<string, unknown>).taxi_number)}
											</Typography>
										</Box>
										<Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
											<Typography
												variant="caption"
												sx={{ fontWeight: 500, fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
											>
												Driver Name:
											</Typography>
											<Typography
												variant="caption"
												sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" }, textAlign: "right" }}
											>
												{String((searchResult.data.client as Record<string, unknown>).driver_name)}
											</Typography>
										</Box>
										<Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
											<Typography
												variant="caption"
												sx={{ fontWeight: 500, fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
											>
												Mobile:
											</Typography>
											<Typography
												variant="caption"
												sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" }, textAlign: "right" }}
											>
												{String((searchResult.data.client as Record<string, unknown>).mobile)}
											</Typography>
										</Box>
										<Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
											<Typography
												variant="caption"
												sx={{ fontWeight: 500, fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
											>
												Owner Name:
											</Typography>
													<Typography
														variant="caption"
														sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" }, textAlign: "right" }}
													>
														{String((searchResult.data.client as Record<string, unknown>).owner_name)}
													</Typography>
												</Box>
												<Box
													sx={{
														display: "flex",
														justifyContent: "space-between",
														gap: 2,
														pt: 1,
														borderTop: "1px solid #ddd",
													}}
												>
													<Typography
														variant="caption"
														sx={{ fontWeight: 500, fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
													>
														Status:
													</Typography>
													<Box
														sx={{
															backgroundColor:
															(searchResult.data.client as Record<string, unknown>).air_freshener_installed === "1" ? "#c8e6c9" : "#fff3cd",
															color: (searchResult.data.client as Record<string, unknown>).air_freshener_installed === "1" ? "#2e7d32" : "#856404",
															px: 1.5,
															py: 0.25,
															borderRadius: 0.5,
															fontWeight: 500,
															fontSize: "0.7rem",
														}}
													>
														{(searchResult.data.client as Record<string, unknown>).air_freshener_installed === "1"
															? "Sampling Completed"
															: "Sampling Pending"}
													</Box>
												</Box>
											</Stack>
					</Box>
				</Stack>
			</Box>
					) : null}

						{/* Taxi Not Found - Show Registration Form */}
						{!searchResult.success && (
							<Box sx={{ mt: 4, width: "100%", maxWidth: 720, mx: "auto" }}>
								<TaxiRegistrationForm
									defaultTaxiNumber={carNumber}
									onRegistrationSuccess={handleTaxiRegistrationSuccess}
								/>
							</Box>
						)}
					</Box>
				</Box>
			)}
		</Box>
			{/* Driver Feedback Form - Show only after taxi registration */}
			{taxiRegistered && (
				<Box sx={{ width: "100%", maxWidth: 720 }}>
					<DriverFeedbackForm
						driverName={registeredDriverName}
						taxiNumber={carNumber}
						onSubmit={async (_values) => {
							handleFeedbackSuccess();
						}}
					/>
				</Box>
			)}
		</Box>
	);
}
