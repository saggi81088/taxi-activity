import { ChartPie } from '@phosphor-icons/react/dist/ssr/ChartPie';
import { Users } from '@phosphor-icons/react/dist/ssr/Users';
import { Car } from '@phosphor-icons/react/dist/ssr/Car';
import { GearSix } from '@phosphor-icons/react/dist/ssr/GearSix';
import { User } from '@phosphor-icons/react/dist/ssr/User';
import { UserFocus } from '@phosphor-icons/react/dist/ssr/UserFocus';
import type { ComponentType, SVGProps } from 'react';

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

export const navIcons: Record<string, IconComponent> = {
  'chart-pie': ChartPie,
  users: Users,
  car: Car,
  'gear-six': GearSix,
  user: User,
  userfocus: UserFocus,
};

export default navIcons;
