"use client";

import * as React from "react";
import RouterLink from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Collapse from "@mui/material/Collapse";
import { CaretDownIcon } from "@phosphor-icons/react/dist/ssr/CaretDown";

import type { NavItemConfig } from "@/types/nav";
import { paths } from "@/paths";
import { isNavItemActive } from "@/lib/is-nav-item-active";
import { useUser } from "@/hooks/use-user";

import { navItems } from "./config";
import { navIcons } from "./nav-icons";

export function SideNav(): React.JSX.Element {
	const pathname = usePathname();
	const { user } = useUser();
	const [isPending, startTransition] = React.useTransition();

	// Filter nav items based on user role
	const filteredNavItems = navItems.filter((item) => {
		// Hide User item for promoters
		if (item.key === "user" && user?.role === "promoter") {
			return false;
		}
		
		// Hide User Management for promoters
		if (item.key === "user-management" && user?.role === "promoter") {
			return false;
		}
		
		return true;
	}).map((item) => {
		// For admin role, show User Management but filter sub-items to only Promoter Users
		if (item.key === "user-management" && user?.role === "admin" && item.items) {
			return {
				...item,
				items: item.items.filter((subItem) => subItem.key === "promoter-users"),
			};
		}
		return item;
	});

	return (
		<Box
			sx={{
				"--SideNav-background": "var(--mui-palette-neutral-950)",
				"--SideNav-color": "var(--mui-palette-common-white)",
				"--NavItem-color": "var(--mui-palette-neutral-300)",
				"--NavItem-hover-background": "rgba(255, 255, 255, 0.04)",
				"--NavItem-active-background": "var(--mui-palette-primary-main)",
				"--NavItem-active-color": "var(--mui-palette-primary-contrastText)",
				"--NavItem-disabled-color": "var(--mui-palette-neutral-500)",
				"--NavItem-icon-color": "var(--mui-palette-neutral-400)",
				"--NavItem-icon-active-color": "var(--mui-palette-primary-contrastText)",
				"--NavItem-icon-disabled-color": "var(--mui-palette-neutral-600)",
				bgcolor: "var(--SideNav-background)",
				color: "var(--SideNav-color)",
				display: { xs: "none", lg: "flex" },
				flexDirection: "column",
				height: "100%",
				left: 0,
				maxWidth: "100%",
				position: "fixed",
				scrollbarWidth: "none",
				top: 0,
				width: "var(--SideNav-width)",
				zIndex: "var(--SideNav-zIndex)",
				"&::-webkit-scrollbar": { display: "none" },
			}}
		>
			<Stack spacing={2} sx={{ p: 3 }}>
				<Box component={RouterLink} href={paths.home} sx={{ display: "inline-flex" }}>
					{/* <Logo color="light" height={32} width={122} /> */}
					<h3 style={{ color: "#fff" }}>Taxi Sampling Activity</h3>
				</Box>
			</Stack>
			<Divider sx={{ borderColor: "var(--mui-palette-neutral-700)" }} />
			<Box component="nav" sx={{ flex: "1 1 auto", p: "12px", position: "relative" }}>
				{isPending && (
					<Box
						sx={{
							position: "absolute",
							top: 0,
							left: 0,
							right: 0,
							bottom: 0,
							backgroundColor: "rgba(0, 0, 0, 0.3)",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							borderRadius: 1,
							zIndex: 10,
						}}
					>
						<CircularProgress size={24} sx={{ color: "white" }} />
					</Box>
				)}
				{renderNavItems({ pathname, items: filteredNavItems, onNavigate: startTransition })}
			</Box>
			<Divider sx={{ borderColor: "var(--mui-palette-neutral-700)" }} />
		</Box>
	);
}

function renderNavItems({ items = [], pathname, onNavigate, level = 0 }: { items?: NavItemConfig[]; pathname: string; onNavigate?: (fn: () => void) => void; level?: number }): React.JSX.Element {
	const children = items.reduce((acc: React.ReactNode[], curr: NavItemConfig): React.ReactNode[] => {
		const { key, ...item } = curr;

		acc.push(<NavItem key={key} pathname={pathname} onNavigate={onNavigate} level={level} {...item} />);

		return acc;
	}, []);

	return (
		<Stack component="ul" spacing={1} sx={{ listStyle: "none", m: 0, p: 0 }}>
			{children}
		</Stack>
	);
}

interface NavItemProps extends Omit<NavItemConfig, "items" | "key"> {
	pathname: string;
	onNavigate?: (fn: () => void) => void;
	items?: NavItemConfig[];
	level?: number;
}

function NavItem({ disabled, external, href, icon, matcher, pathname, title, onNavigate, items = [], level = 0 }: NavItemProps): React.JSX.Element {
	const router = useRouter();
	const [expanded, setExpanded] = React.useState(false);
	const active = isNavItemActive({ disabled, external, href, matcher, pathname });
	const IconComponent = icon ? navIcons[icon] : null;
	const hasSubItems = items && items.length > 0;

	const handleClick = (e: React.MouseEvent<HTMLDivElement>): void => {
		if (disabled) return;
		
		// If this item has sub-items but NO href, expand/collapse instead of navigate
		if (hasSubItems && !href) {
			e.preventDefault();
			setExpanded(!expanded);
			return;
		}

		if (external || !href) return;
		
		// Prevent default link behavior
		e.preventDefault();
		
		// If has sub-items with href, always expand/collapse when clicking
		if (hasSubItems) {
			setExpanded(!expanded);
			return;
		}
		
		// Use transition to wrap navigation
		onNavigate?.(() => {
			router.push(href);
		});
	};

	return (
		<>
			<li>
				<Box
					onClick={handleClick}
					sx={{
						alignItems: "center",
						borderRadius: 1,
						color: "var(--NavItem-color)",
						display: "flex",
						flex: "0 0 auto",
						gap: 1,
						p: "6px 16px",
						position: "relative",
						textDecoration: "none",
						whiteSpace: "nowrap",
						transition: "all 0.2s ease-in-out",
						marginLeft: `${level * 16}px`,
						...(disabled && {
							bgcolor: "var(--NavItem-disabled-background)",
							color: "var(--NavItem-disabled-color)",
							cursor: "not-allowed",
						}),
						...(!disabled && {
							"&:hover": {
								bgcolor: "var(--NavItem-hover-background)",
								cursor: "pointer",
							},
						}),
						...(active && { bgcolor: "var(--NavItem-active-background)", color: "var(--NavItem-active-color)" }),
					}}
				>
					<Box sx={{ alignItems: "center", display: "flex", justifyContent: "center", flex: "0 0 auto" }}>
						{IconComponent ? (
							<IconComponent
								fill={active ? "var(--NavItem-icon-active-color)" : "var(--NavItem-icon-color)"}
								fontSize="var(--icon-fontSize-md)"
							/>
						) : null}
					</Box>
					<Box sx={{ flex: "1 1 auto" }}>
						<Typography
							component="span"
							sx={{ color: "inherit", fontSize: "0.875rem", fontWeight: 500, lineHeight: "28px" }}
						>
							{title}
						</Typography>
					</Box>
					{hasSubItems && (
						<Box
							sx={{
								display: "flex",
								alignItems: "center",
								transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
								transition: "transform 0.2s ease-in-out",
							}}
						>
							<CaretDownIcon fontSize="var(--icon-fontSize-md)" />
						</Box>
					)}
				</Box>
			</li>
			{hasSubItems && (
				<Collapse in={expanded} timeout="auto" unmountOnExit>
					<Box component="ul" sx={{ listStyle: "none", m: 0, p: 0 }}>
						{items.map((subItem) => {
							const { key, ...itemProps } = subItem;
							return (
								<NavItem
									key={key}
									pathname={pathname}
									onNavigate={onNavigate}
									level={level + 1}
									{...itemProps}
								/>
							);
						})}
					</Box>
				</Collapse>
			)}
		</>
	);
}
